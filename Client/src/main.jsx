import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "./components/ui/sonner.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import AppWrapper from "./components/AppWrapper.jsx";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <SocketProvider>
          <AppWrapper>
            <App />
            <Toaster richColors position="top-right" />
          </AppWrapper>
        </SocketProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
