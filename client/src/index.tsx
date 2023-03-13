import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import FlightProvider from "./stateManagement/FlightContext";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <FlightProvider>
        <App />
      </FlightProvider>
    </BrowserRouter>
  </React.StrictMode>
);
