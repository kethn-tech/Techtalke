import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "./components/ui/sonner.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import AppWrapper from "./components/AppWrapper.jsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <AppWrapper>
          <App />
          <Toaster richColors position="top-right" />
        </AppWrapper>
      </SocketProvider>
    </BrowserRouter>
  </React.StrictMode>
);
