import Home from "../components/Home";
import Layout from "../components/Layout";
import { fetchAllRooms, getRoomState } from "../redux/features/roomSlice";
import { wrapper } from "../redux/store";
import { useSession, signIn, signOut } from "next-auth/react";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

export default function index() {
  const { data: session, status } = useSession();

  return (
    <Layout title="Book IT">
      <Home />
    </Layout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { query } = ctx;
    await store.dispatch(fetchAllRooms(query));
    return {
      props: {
        page: ctx.query.page || 1,
      },
    };
  }
);
