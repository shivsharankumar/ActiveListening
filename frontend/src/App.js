import React from "react";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider, createTheme } from "@mui/material/styles";

import Router from "./Router";
import ErrorBoundary from "./Components/errorBoundary/ErrorBoundary";

import { AuthProvider } from "./context/authContext";

const theme = createTheme({
  palette: {
    primary: {
      main: "#dfdfdf",
    },
    secondary: {
      main: "#FFFFF",
    },
  },
});

function App() {
  return (
    <div className="bg-custom-image w-full h-screen flex items-center justify-center">
      <AuthProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <ThemeProvider theme={theme}>
              <Router />
            </ThemeProvider>
          </ErrorBoundary>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
