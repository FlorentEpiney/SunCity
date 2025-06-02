import React, { useEffect } from 'react';
import Description from "../pages/description";
import Logbook from "../pages/logbook";
import Models from "../pages/models";
import Mockup from "../pages/mockup";
import Flow from "../pages/flow";
import Game from "../pages/game";
import {BrowserRouter, NavLink, Navigate, Route, Routes} from "react-router-dom";
import SummaryProject from "../pages/summaryProject";

function RouteApp() {
    useEffect(() => {
        // Hamburger menu functionality
        const burger = document.querySelector("li.hamburger");
        const navList = burger?.parentElement;

        const handleBurgerClick = () => {
            navList?.classList.toggle("open");
        };

        if (burger) {
            burger.addEventListener("click", handleBurgerClick);
        }

        // Total time calculation
        const timeSpan = document.getElementById("total-time");
        if (timeSpan) {
            // Calculate total time from logbook data
            // You'll need to implement this based on your logbook data
            // For now, setting a placeholder
            timeSpan.textContent = "20h 30m"; // Replace with actual calculation
        }

        // Cleanup
        return () => {
            if (burger) {
                burger.removeEventListener("click", handleBurgerClick);
            }
        };
    }, []);

    return (
        <>
            <BrowserRouter>
                <h1>HES-SO Vs - 64-31 - Web Development</h1>
                <nav>
                    <ul>
                        <li className="hamburger">
                            <img src="/resources/images/hamburger_icon.svg" alt="Menu"/>
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
                        <li>
                            <NavLink to="/game">Game</NavLink>
                        </li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/description" element={<Description/>}/>
                    <Route path="/models" element={<Models/>}/>
                    <Route path="/mockup" element={<Mockup/>}/>
                    <Route path="/flow" element={<Flow/>}/>
                    <Route path="/logbook" element={<Logbook/>}/>
                    <Route path="/game" element={<Game/>}/>
                    <Route path="*" element={<Navigate to="/description" replace/>}/>
                </Routes>
                <SummaryProject/>
                <footer>
                    <img id="logo" src="/resources/images/logo.png" alt="Logo"/>
                </footer>
            </BrowserRouter>
        </>
    );
}

export default RouteApp;