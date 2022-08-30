import "../styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { wrapper } from "../redux/store";
import { Box, CssBaseline } from "@mui/material";
import ModeProvider from "../theme/ModeProvider";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, ...rest }) {
  return (
    <>
      <ModeProvider>
        <CssBaseline />
        <Box>
          <SessionProvider session={rest.session}>
            <Component {...rest.pageProps} />
          </SessionProvider>
          <ToastContainer theme="colored" />
        </Box>
      </ModeProvider>
    </>
  );
}

export default wrapper.withRedux(MyApp);
