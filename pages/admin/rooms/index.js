import { Button, Container, Tooltip } from "@mui/material";
import Link from "next/link";
import React from "react";
import Layout from "../../../components/Layout";
import RoomTable from "../../../components/RoomTable";
import AddIcon from "@mui/icons-material/Add";
import { getSession } from "next-auth/react";

const AdminRooms = () => {
  return (
    <Layout title={"Admin Booking"}>
      <Link href={"/admin/rooms/create"} passHref>
        <Tooltip title="Create room">
          <Button
            color="primary"
            variant="contained"
            size="large"
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              position: "fixed",
              bottom: "2rem",
              right: "2rem",
            }}
          >
            <AddIcon />
          </Button>
        </Tooltip>
      </Link>
      <Container sx={{ paddingTop: "4rem" }} maxWidth="lg">
        <RoomTable />
      </Container>
    </Layout>
  );
};

export default AdminRooms;

export const getServerSideProps = async (ctx) => {
  const session = await getSession({ req: ctx.req });

  if (!session || session.user.role !== "Admin") {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
