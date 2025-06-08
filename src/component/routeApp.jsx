// src/component/routeApp.jsx
import React, { useEffect } from 'react';
import { BrowserRouter, NavLink, Navigate, Route, Routes } from "react-router-dom";

// Import the WordPress-powered components
import WordPressPage from "./WordPressPage";
import { getWordPressPageId } from "../config/wordpressConfig";

function RouteApp() {
    // Enable debug mode in development or when needed
    const isDebugMode = process.env.NODE_ENV === 'development' ||
        window.location.search.includes('debug=true');

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
            timeSpan.textContent = "20h 30m"; // UPDATE !!!
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
                    {/* WordPress-powered pages with optional debug */}
                    <Route
                        path="/description"
                        element={
                            <WordPressPage
                                pageId={getWordPressPageId('description')}
                                fallbackTitle="Description"
                                showDebug={isDebugMode}
                            />
                        }
                    />
                    <Route
                        path="/models"
                        element={
                            <WordPressPage
                                pageId={getWordPressPageId('models')}
                                fallbackTitle="Visual Models of the Project"
                                showDebug={isDebugMode}
                            />
                        }
                    />
                    <Route
                        path="/mockup"
                        element={
                            <WordPressPage
                                pageId={getWordPressPageId('mockup')}
                                fallbackTitle="Mockup of the Project"
                                showDebug={isDebugMode}
                            />
                        }
                    />
                    <Route
                        path="/flow"
                        element={
                            <WordPressPage
                                pageId={getWordPressPageId('flow')}
                                fallbackTitle="Game Flow and Interaction"
                                showDebug={isDebugMode}
                            />
                        }
                    />
                    <Route
                        path="/logbook"
                        element={
                            <WordPressPage
                                pageId={getWordPressPageId('logbook')}
                                fallbackTitle="Project Logbook"
                                showDebug={isDebugMode}
                            />
                        }
                    />

                    {/* Game page */}
                    <Route
                        path="/game"
                        element={
                            <WordPressPage
                                pageId={getWordPressPageId('game')}
                                fallbackTitle="Game"
                                showDebug={isDebugMode}
                            />
                        }
                    />

                    {/* Default redirect */}
                    <Route path="*" element={<Navigate to="/description" replace/>}/>
                </Routes>
                <footer>
                    <img id="logo" src="/resources/images/logo.png" alt="Logo"/>
                </footer>
            </BrowserRouter>
        </>
    );
}

export default RouteApp;