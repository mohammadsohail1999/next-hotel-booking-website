import catchAsync from "../middlewares/catchAsync";
import ErrorHandler from "../utils/ErrorHandler";
import Stripe from "stripe";
import { buffer } from "micro";
import userModel from "../Models/UserModel";
import BookingModel from "../Models/BookingsModel";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeCheckout = catchAsync(async (req, res, next) => {
  const {
    price,
    email,
    hotelName,
    image,
    roomId,
    checkInDate,
    checkOutDate,
    daysOfStay,
  } = req.body;

  const product = await stripe.products.create({
    name: hotelName,
    images: [image],
  });

  const stripeprice = await stripe.prices.create({
    product: product.id,
    unit_amount: price * 100,
    currency: "inr",
  });

  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    client_reference_id: roomId,
    line_items: [
      {
        price: stripeprice.id,
        quantity: 1,
      },
    ],
    metadata: {
      checkInDate,
      checkOutDate,
      daysOfStay,
    },
    mode: "payment",
    success_url: `${req.headers.origin}/me/bookings`,
    cancel_url: `${req.headers.origin}/${roomId}`,
  });

  res.status(200).json({
    success: true,
    session,
  });
});

export const webHookHandler = catchAsync(async (req, res, next) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const sig = req.headers["stripe-signature"];
  const buf = await buffer(req);

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    // roomId, checkInDate, checkOutDate, amountPaid, daysOfStay
    case "checkout.session.completed":
      const session = event.data.object;
      const roomId = session.client_reference_id;
      const user = await userModel.findOne({
        email: session.customer_email,
      });
      const { daysOfStay, checkInDate, checkOutDate } = session.metadata;

      const paymentInfo = {
        id: session.payment_intent,
        status: session.payment_status,
      };

      try {
        const Booking = await BookingModel.create({
          room: roomId,
          user: user._id,
          checkInDate,
          checkOutDate,
          amountPaid: session.amount_total / 100,
          daysOfStay,
          paymentInfo,
        });
        res.status(200).json({ success: true });
        return;
      } catch (error) {
        res.status();
      }

      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ success: true });
});
