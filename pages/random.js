import React from "react";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import { fetchAllRooms, getRoomState } from "../redux/features/roomSlice";
import { wrapper } from "../redux/store";

const Random = () => {
  const state = useSelector(getRoomState);
  console.log(state);

  return <Layout title="random">Random</Layout>;
};

export default Random;

export const getStaticProps = wrapper.getStaticProps((store) => async (ctx) => {
  console.log("getStaticProps Called");

  return {
    props: {
      hello: "hello",
    },
  };
});
