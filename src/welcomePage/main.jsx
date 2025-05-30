import React from 'react';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import RouteApp from "./component/routeApp";
import "./resources/css/style.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouteApp />
    </StrictMode>
);