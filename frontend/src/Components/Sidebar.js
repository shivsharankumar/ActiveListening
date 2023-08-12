import React from "react";
import { NavLink, useLocation } from "react-router-dom";

import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import { Dashboard, FormatListBulleted } from "@mui/icons-material";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  minHeight: "10px",
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});
const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const ModifiedListItemIcon = styled(ListItemIcon)(() => ({ minWidth: "20px" }));
const CollapsedListItemIcon = styled(ListItemIcon)(() => ({
  minWidth: "max-content",
}));

export default function Sidebar({ open, handleDrawerClose }) {
  const location = useLocation();
  const pathName = location.pathname;
  console.log("location", location, pathName);

  return (
    <Drawer variant="permanent" open={open} onClose={handleDrawerClose}>
      <div
        className="d-flex link m-0 mb-5 d-flex align-items-center justify-content-center"
        style={{
          maxHeight: "64px",
          height: "64px",
        }}
      >
        {open ? (
          <>
            {/* <span className="text-lg">Active Listening</span> */}
            <DrawerHeader style={{ minHeight: "100px" }}>
              <IconButton onClick={handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </DrawerHeader>
          </>
        ) : null}
      </div>
      {open ? (
        <>
          <p className="uppercase ms-4 mt-[-3rem]">Main Menu</p>
          <List className="p-6 pr-3">
            <NavLink to="/">
              <ListItem button>
                <ModifiedListItemIcon>
                  <FormatListBulleted
                    sx={{ fontSize: "15px" }}
                    style={{
                      color: pathName === "/" ? "#997850" : "",
                    }}
                  />
                </ModifiedListItemIcon>

                <ListItemText
                  disableTypography
                  primary={
                    <Typography
                      variant="body2"
                      style={{
                        color: pathName === "/" ? "#997850" : "",
                        fontSize: "1rem",
                      }}
                    >
                      Home
                    </Typography>
                  }
                />
              </ListItem>
            </NavLink>
            <NavLink to="/analysis">
              <ListItem button>
                <ModifiedListItemIcon>
                  <Dashboard
                    sx={{ fontSize: "15px" }}
                    color={pathName === "/analysis" ? "#997850" : ""}
                  />
                </ModifiedListItemIcon>

                <ListItemText
                  disableTypography
                  primary={
                    <Typography
                      variant="body2"
                      color={pathName === "/analysis" ? "#997850" : ""}
                      style={{ fontSize: "15px" }}
                    >
                      Analysis
                    </Typography>
                  }
                />
              </ListItem>
            </NavLink>
          </List>
        </>
      ) : (
        <List>
          <NavLink to="/">
            <ListItem className="d-flex justify-content-center mb-2" button>
              <CollapsedListItemIcon>
                <FormatListBulleted
                  style={{
                    color: pathName === "/" ? "#997850" : "",
                  }}
                />
              </CollapsedListItemIcon>
            </ListItem>
          </NavLink>
          <NavLink to="/analysis">
            <ListItem className="d-flex justify-content-center mb-2" button>
              <CollapsedListItemIcon>
                <Dashboard color={pathName === "/analysis" ? "#997850" : ""} />
              </CollapsedListItemIcon>
            </ListItem>
          </NavLink>
        </List>
      )}
    </Drawer>
  );
}
