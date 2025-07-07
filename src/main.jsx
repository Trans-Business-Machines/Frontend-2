import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import SWRwithRouter from "./SWRwithRouter";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <SWRwithRouter />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
