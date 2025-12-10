import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {AuthProvider} from "./contexts/AuthContext.jsx";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter basename="/tsr-invoice">
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </GoogleOAuthProvider>
    </BrowserRouter>
);
