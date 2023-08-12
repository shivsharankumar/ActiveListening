import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import ProtectedRoute from "./HOC/protectedRoute";
const Login = lazy(() => import("./Components/login"));
const Home = lazy(() => import("./Components/form"));
const Analysis = lazy(() => import("./Components/Analysis"));
const renderLoader = () => (
  <main className="d-flex justify-content-center">
    <CircularProgress />
  </main>
);

export default function Router() {
  return (
    <Box sx={{ display: "flex" }}>
      <Suspense fallback={renderLoader()}>
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/analysis" component={Analysis} />

          <Route render={() => <Redirect to={{ pathname: "/" }} />} />
        </Switch>
      </Suspense>
    </Box>
  );
}
