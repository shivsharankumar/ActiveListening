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
  const handleMouseLeave = (event) => {
    setAnchorEl(null);
  };
  const handleMenuClick = (event) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      const target = event.currentTarget;
      setAnchorEl(target);
    }
  };
  const handleClose = () => {
    callAPI("GET", "logout/", "")
      .then(() => {
        localStorage.clear();

        /* change expire attribute of cookies to current time, so it expires.
Note this doesn't work for http only cookies, so only csrf cookie will expire. sessionid is handled by django itself */
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
              <div className="flex flex-row justify-end mr-[-3rem]">
                <span className="mt-2">{auth.userName}</span>
                <div className="mx-2">
                  <IconButton
                    className="dropdown-trigger"
                    data-target="account-dropdown"
                    // onMouseOver={handleMouseOver}
                    onClick={handleMenuClick}
                  >
                    <AccountCircleIcon
                      style={{ color: "#997850", fontSize: "28px" }}
                    />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
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
