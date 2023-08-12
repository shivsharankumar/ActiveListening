import React from "react";
// eslint-disable-next-line react/no-deprecated
import { render } from "react-dom";
// import "./index.css";
import App from "./App";

// const rootElement = document.getElementById("root");
// // const root = createRoot(rootElement);
render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root"),
);
