import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Menu, MenuItem } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Sidebar from "./Sidebar";
import callAPI from "../utils/callApi";
import { useAuth } from "../context/authContext";

const drawerWidth = 240;
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function Navbar({
  open,
  setOpen,
  shouldDashboardsReload,
  setShouldDashboardsReload,
}) {
  const history = useHistory();
  const auth = useAuth();
  // const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  /* The `handleMouseLeave` function is used to handle the event when the mouse leaves the menu
  button. It sets the `anchorEl` state to `null`, which closes the menu. */
  const handleMouseLeave = (event) => {
    setAnchorEl(null);
  };
  /**
   * The function `handleMenuClick` toggles the `anchorEl` state between `null` and the target element
   * of the event.
   * @param event - The `event` parameter is an object that represents the event that triggered the
   * function. It contains information about the event, such as the target element that was clicked.
   */
  const handleMenuClick = (event) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      const target = event.currentTarget;
      setAnchorEl(target);
    }
  };
  /**
   * The `handleClose` function logs out the user by making a GET request to the "logout/" endpoint,
   * clearing the localStorage, deleting all cookies, and redirecting to the login page.
   */
  const handleClose = () => {
    callAPI("GET", "logout/", "")
      .then(() => {
        localStorage.clear();
        document.cookie.split(";").forEach((cookie) => {
          document.cookie = cookie
            .replace(/^ +/, "")
            .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
        });
      })
      .then(() => {
        history.push("/login");
      });
  };

  return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{ backgroundColor: "#F5F5F5" }}
        style={{ boxShadow: "none" }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <div className="container w-100 ">
            <div className="row ">
              {/* <div className="col-10">
                <SearchBar />
              </div> */}
              <div className="flex flex-row justify-end mr-[-3rem] relative">
                <span className="mt-2">{auth.userName}</span>
                <div className="mx-2">
                  <IconButton
                    className="dropdown-trigger"
                    data-target="account-dropdown"
                    // onMouseOver={handleMouseOver}
                    onClick={handleMenuClick}
                  >
                    <AccountCircleIcon
                      style={{
                        color: "#455964",
                        fontSize: "28px",
                        // position: "fixed",
                      }}
                    />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    // className={{
                    //   paper: "absolute top-[3.5rem] right-0 mt-1",
                    // }}
                  >
                    <MenuItem
                      onMouseLeave={handleMouseLeave}
                      onClick={handleClose}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <Sidebar
        open={open}
        handleDrawerClose={handleDrawerClose}
        handleDrawerOpen={handleDrawerOpen}
        shouldDashboardsReload={shouldDashboardsReload}
        setShouldDashboardsReload={setShouldDashboardsReload}
      />
    </>
  );
}
