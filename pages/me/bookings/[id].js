import {
  Button,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { getSession } from "next-auth/react";
import React from "react";
import { useSelector } from "react-redux";
import Layout from "../../../components/Layout";
import {
  fetchBookingDetails,
  getBookingDetailState,
} from "../../../redux/features/BookingDetailSlice";
import { wrapper } from "../../../redux/store";
import moment from "moment";
import Link from "next/link";
import EasyInvoice from "easyinvoice";

const BookingDetails = () => {
  const { success, error } = useSelector(getBookingDetailState);

  const format1 = "YYYY-MM-DD HH:mm:ss";

  const downloadInvoiceHandler = (data) => async (e) => {
    console.log(data.user.name);
    let invoiceData = {
      // "customize": {
      //     "template": "SGVsbG8gd29ybGQh" // Must be base64 encoded html. This example contains 'Hello World!' in base64
      // },
      images: {
        logo: "https://public.easyinvoice.cloud/img/logo_en_original.png",
        background: "https://public.easyinvoice.cloud/img/watermark-draft.jpg",
      },
      sender: {
        company: "Book IT",
        address: "New Delhi 11",
        zip: "110095",
        city: "Delhi",
        country: "India",
        // "custom1": "custom value 1",
        // "custom2": "custom value 2",
        // "custom3": "custom value 3"
      },
      client: {
        company: data.user.name,
        // address: "Clientstreet 456",
        // zip: "4567 CD",
        // city: "Clientcity",
        country: "India",
        // name: data.user.name,
        // "custom2": "custom value 2",
        // "custom3": "custom value 3"
      },
      information: {
        date: new Date().toDateString(),
      },
      products: [
        {
          quantity: 2,
          description: data.room.name,
          "tax-rate": 0,
          price: data.amountPaid,
          daysOfStay: data.daysOfStay,
        },
      ],
      "bottom-notice": "Amount Is Paid",
      settings: {
        currency: "INR", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
        // "locale": "nl-NL", // Defaults to en-US, used for number formatting (see docs)
        // "taxNotation": "gst", // Defaults to vat
        // "margin-top": 25, // Default to 25
        // "margin-right": 25, // Default to 25
        // "margin-left": 25, // Default to 25
        // "margin-bottom": 25, // Default to 25
        // "format": "Letter", // Defaults to A4
        // "height": "1000px", // allowed units: mm, cm, in, px
        // "width": "500px", // allowed units: mm, cm, in, px
        // "orientation": "landscape", // portrait or landscape, defaults to portrait
      },
      // Used for translating the headers to your preferred language
      // Defaults to English. Below example is translated to Dutch
      // "translate": {
      //     "invoice": "FACTUUR",
      //     "number": "Nummer",
      //     "date": "Datum",
      //     "due-date": "Verloopdatum",
      //     "subtotal": "Subtotaal",
      //     "products": "Producten",
      //     "quantity": "Aantal",
      //     "price": "Prijs",
      //     "product-total": "Totaal",
      //     "total": "Totaal"
      // },
    };
    const result = await EasyInvoice.createInvoice(invoiceData);
    EasyInvoice.download("Invoice.pdf", result.pdf);
  };

  return (
    <Layout title="Booking Detail">
      <Container sx={{ marginTop: "5rem" }} maxWidth="lg">
        {success ? (
          <Box sx={{ paddingTop: "2rem" }}>
            <Typography gutterBottom variant="h4">
              Booking {`#${success?.booking._id}`}
            </Typography>
            <Box marginY={"2rem"}>
              <Typography gutterBottom variant="h5">
                User Info
              </Typography>
              <Box>
                <Typography gutterBottom variant="p" component={"div"}>
                  <b>Name:</b> {success?.booking.user.name}
                </Typography>
                <Typography gutterBottom variant="p" component={"div"}>
                  <b>Email:</b> {success?.booking.user.email}
                </Typography>
                <Typography gutterBottom variant="p" component={"div"}>
                  <b>Amount:</b> {success?.booking.amountPaid} Rs
                </Typography>
              </Box>
            </Box>
            <Divider />
            <Box marginY={"2rem"}>
              <Typography gutterBottom variant="h5">
                Booking Info
              </Typography>
              <Box>
                <Typography gutterBottom variant="p" component={"div"}>
                  <b>Check In:</b>{" "}
                  {moment(success?.booking.checkInDate).format(format1)}
                </Typography>
                <Typography gutterBottom variant="p" component={"div"}>
                  <b>Check Out:</b>{" "}
                  {moment(success?.booking.checkOutDate).format(format1)}
                </Typography>
              </Box>
            </Box>
            <Divider />
            <Box marginY={"2rem"}>
              <Typography gutterBottom variant="h5">
                Payment Status
              </Typography>
              <Box>
                {success?.booking?.paymentInfo?.status ? (
                  <Chip label="Paid" variant="outLined" color="success" />
                ) : (
                  <Chip label="Unpaid" variant="outLined" color="error" />
                )}
              </Box>
            </Box>
            <Divider />
            <Box marginY={"2rem"}>
              <Typography gutterBottom variant={"h5"}>
                Booked Room
              </Typography>
              <Box marginTop={"2rem"}>
                <Stack direction={"row"} spacing={3}>
                  <img
                    src={success?.booking?.room?.images[0].url}
                    style={{ width: "50px", height: "40px" }}
                  />
                  <Link href={`/room/${success?.booking?.room?._id}`} passHref>
                    <Typography variant="p" sx={{ cursor: "pointer" }}>
                      {success?.booking?.room?.name}
                    </Typography>
                  </Link>
                  <Typography variant="p">
                    Rs {success?.booking?.room?.price}
                  </Typography>
                  <Typography variant="p">
                    {success?.booking?.daysOfStay > 1
                      ? `${success?.booking?.daysOfStay} days`
                      : `${success?.booking?.daysOfStay} day`}
                  </Typography>
                </Stack>
              </Box>
            </Box>
            <Button onClick={downloadInvoiceHandler(success?.booking)}>
              {" "}
              Download Invoice{" "}
            </Button>
          </Box>
        ) : null}
      </Container>
    </Layout>
  );
};

export default BookingDetails;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const session = await getSession(ctx);
    const { id } = ctx.query;
    if (!session) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    await store.dispatch(
      fetchBookingDetails({ cookie: ctx.req.headers.cookie, id })
    );
  }
);
