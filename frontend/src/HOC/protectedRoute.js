import React, { useEffect, useState } from "react";
import { Route, Redirect, useHistory } from "react-router-dom";

import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

import { useAuth } from "../context/authContext";
import Navbar from "../Components/Navbar";
import callAPI from "../utils/callApi";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export default function ProtectedRoute({ component: Component, ...rest }) {
  const auth = useAuth();
  const history = useHistory();
  const loggedInUser = localStorage.getItem("user");
  const [open, setOpen] = useState(false);
  const [shouldDashboardsReload, setShouldDashboardsReload] = useState(true);

  useEffect(() => {
    callAPI("GET", "logged_in/", "").then((res) => {
      if (!res.is_authenticated) {
        localStorage.removeItem("user");
        history.push("/login");
      } else {
        const userName = res.user;
        if (res.status === 200) {
          auth.signin(200, userName);
          // history.push(from.pathname);
        } else {
          auth.signin(400, userName);
        }
      }
    });
  }, [history]);

  return (
    <>
      <Navbar
        open={open}
        setOpen={setOpen}
        shouldDashboardsReload={shouldDashboardsReload}
        setShouldDashboardsReload={setShouldDashboardsReload}
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Route
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...rest}
          render={({ match, location }) =>
            loggedInUser !== (undefined || null) ? (
              <main>
                <Component
                  match={match}
                  sidebarOPen={open}
                  shouldDashboardsReload={shouldDashboardsReload}
                  setShouldDashboardsReload={setShouldDashboardsReload}
                />
              </main>
            ) : (
              <Redirect
                to={{
                  pathname: "/login",
                  state: { from: location },
                }}
              />
            )
          }
        />
      </Box>
    </>
  );
}
