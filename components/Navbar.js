import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Divider } from "@mui/material";
import Link from "next/link";
import {
  Avatar,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ThemeContext from "../theme/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { getLoadedUserState, loadUser } from "../redux/features/loadUserSlice";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Brightness5Icon from "@mui/icons-material/Brightness5";
import NotInternet from "./NotInternet";

const NavbarAdminOption = [
  {
    name: "Rooms",
    url: "/admin/rooms",
  },
  {
    name: "Bookings",
    url: "/admin/booking",
  },
  {
    name: "Users",
    url: "/admin/users",
  },
];

export default function Navbar() {
  const theme = useTheme();

  const router = useRouter().query;

  const [elUser, setElUser] = React.useState(null);
  const handleOpenUserMenu = (event) => {
    setElUser(event.currentTarget);
  };
  const handleCloseUserMenu = (event) => {
    setElUser(null);
  };

  // const Routers = useRouter();

  const { setMode, mode } = React.useContext(ThemeContext);

  const dispatch = useDispatch();

  const { isAuthenticated, user, loading } = useSelector(getLoadedUserState);

  React.useEffect(() => {
    if (!user) {
      dispatch(loadUser());
    }
  }, [user]);

  const Router = useRouter();

  const logoutHander = () => {
    signOut({ redirect: false });
    Router.push("/login");
    setElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ bgColor: "background.default" }}>
        <NotInternet />
        <Container maxWidth="lg">
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Link href="/" passHref>
              <Typography
                sx={{ cursor: "pointer" }}
                variant="h6"
                component="div"
              >
                Book IT
              </Typography>
            </Link>
            <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
              <IconButton
                sx={{
                  marginRight: "1rem",
                  color: "#fff",
                  background: theme.palette?.primary.main,
                  "&:hover": {
                    background: theme.palette.primary.main,
                    color: "#fff",
                  },
                }}
                onClick={() => {
                  setMode((state) => (state === "light" ? "dark" : "light"));
                  localStorage.setItem(
                    "muiTheme",
                    mode === "light" ? "dark" : "light"
                  );
                }}
              >
                {mode === "light" ? <DarkModeIcon /> : <Brightness5Icon />}
              </IconButton>
              {isAuthenticated ? (
                <Box>
                  <Tooltip title={user.name}>
                    <Box>
                      <IconButton sx={{ p: 0 }} onClick={handleOpenUserMenu}>
                        <Avatar alt={user.name} src={user.avatar.url} />
                      </IconButton>
                    </Box>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    anchorEl={elUser}
                    open={Boolean(elUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {user.role === "Admin"
                      ? NavbarAdminOption.map((el, i) => {
                          return (
                            <MenuItem
                              key={el.name}
                              onClick={handleCloseUserMenu}
                            >
                              <Link href={el.url} passHref>
                                <Typography textAlign="center">
                                  {el.name}
                                </Typography>
                              </Link>
                            </MenuItem>
                          );
                        })
                      : null}
                    {user.role === "Admin" ? <Divider /> : null}
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Link href={"/me/bookings"} passHref>
                        <Typography textAlign="center">My Bookings</Typography>
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Link href={"/me"} passHref>
                        <Typography textAlign="center">Profile</Typography>
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={logoutHander}>
                      <Typography textAlign="center">Log Out</Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              ) : !loading ? (
                <Link href="/login" passHref>
                  <Button
                    sx={{
                      background: "#e83e8c",
                      color: "#fff",
                      "&:hover": {
                        background: "#e83e8c",
                        color: "#fff",
                      },
                    }}
                  >
                    Login
                  </Button>
                </Link>
              ) : null}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
