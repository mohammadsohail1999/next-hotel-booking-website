import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const RoomCard = ({ room }) => {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "none",
        height: "100%",
      }}
    >
      <CardMedia
        sx={{
          width: "100%",
          "& .room_image": {
            borderRadius: "10px",
          },
        }}
      >
        <Image
          src={room?.images[0].url}
          height={150}
          width={180}
          layout="responsive"
          className="room_image"
        />
      </CardMedia>
      <CardContent>
        <Link href={`/room/${room?._id}`}>
          <Typography
            sx={{
              cursor: "pointer",
              "&:hover": {
                color: "#e83e8c",
              },
            }}
            variant="h5"
          >
            {room?.name}
          </Typography>
        </Link>

        <Typography variant="h6">
          <strong>{room?.price} Rs</strong> / Night
        </Typography>
      </CardContent>
      <CardActions sx={{ position: "relative", bottom: 0 }}>
        <Link href={`/room/${room?._id}`} passHref>
          <Button
            sx={{
              background: "#e83e8c",
              color: "#fff",
              "&:hover": {
                background: "#e83e8c",
                color: "#fff",
              },
            }}
            fullWidth
          >
            View Details
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default RoomCard;
