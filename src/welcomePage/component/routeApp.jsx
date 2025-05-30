import React from 'react';
import Description from "../pages/description";
import Logbook from "../pages/logbook";
import Models from "../pages/models";
import Mockup from "../pages/mockup";
import Flow from "../pages/flow";
import {BrowserRouter, NavLink, Navigate, Route, Routes} from "react-router-dom";

function RouteApp() {
    return (
        <>
            <BrowserRouter>
                <h1>HES-SO Vs - 64-31 - Web Development</h1>
                <nav>
                    <ul>
                        <li className="hamburger">
                            <img src="../resources/images/hamburger_icon.svg"/>
                        </li>
                        <li>
                            <NavLink to="/description">Description</NavLink>
                        </li>
                        <li>
                            <NavLink to="/models">Models</NavLink>
                        </li>
                        <li>
                            <NavLink to="/mockup">Mockup</NavLink>
                        </li>
                        <li>
                            <NavLink to="/flow">Flow</NavLink>
                        </li>
                        <li>
                            <NavLink to="/logbook">Project Logbook</NavLink>
                        </li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/description" element={<Description/>}/>
                    <Route path="/models" element={<Models/>}/>
                    <Route path="/mockup" element={<Mockup/>}/>
                    <Route path="/flow" element={<Flow/>}/>
                    <Route path="/logbook" element={<Logbook/>}/>
                    <Route path="*" element={<Navigate to="/description" replace/>}/>
                </Routes>
                <footer>
                    <img id="logo" src="../resources/images/logo.png"/>
                </footer>

                <script src="../resources/js/script.js"></script>
            </BrowserRouter>
        </>
    );
}

export default RouteApp;