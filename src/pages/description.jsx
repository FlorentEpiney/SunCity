import React from 'react';
//import { useNavigate } from "react-router-dom";

function Description(){
    //const navigate = useNavigate();
    return(
        <div>
            <section id="articles">
                <article>
                    <header>
                        <h2>Description</h2>
                        <p>By Micha Meichtry the 29/03/2025 at 16:30</p>
                    </header>
                    <div className="container">
                        <h3>Sun City</h3>
                        <p>
                            Welcome to <strong>Sun City</strong>, a 2-player survival game developed as part of the Web
                            development course at
                            <a href="https://www.hevs.ch" target="_blank" rel="noreferrer"><strong>HES-SO Valais</strong></a>.
                            Set in a post-apocalyptic version of the city Sierre, the game immerses you in a World
                            devastated by a virus outbreak.
                            With society in ruins and the law of the jungle prevailing, your only goal is to survive
                            against relentless waves of enemies.
                        </p>

                        <h3>Objective</h3>
                        <p>
                            In <strong>Sun City</strong>, survival means everything.<br/>
                            A timer tracks how long each player stays alive.
                            The longer you survive, the more points you earn.
                            But danger increases with time — enemies multiply, stamina drops.
                            If an enemy touches you, you lose health. Fortunately for you, by contaminating you, the
                            enemy loses all its vital energy and dies.
                            To regain life points, you need to pick up health kits that are scattered around the map.
                            As soon as one player dies, the match ends.
                        </p>

                        <h3>Gameplay Overview</h3>
                        <ul>
                            <li>Select your avatar and enter the desolate streets of Sierre..</li>
                            <li>Use your weapon to fight off enemies and extend your survival.</li>
                            <li>Pick up health kits to stay in the game longer.</li>
                            <li>The difficulty scales: more time = more enemies = higher challenge.</li>
                        </ul>

                        <h3>Technology Stack</h3>
                        <p>Sun City is developed using core front-end web technologies:</p>
                        <ul>
                            <li>HTML</li>
                            <li>CSS</li>
                            <li>JavaScript</li>
                        </ul>

                        <h3>Inspiration</h3>
                        <div>
                            Sun City takes cues from classic survival and action games, particularly:
                            <ul>
                                <li>Grand Theft Auto (GTA) - for its open-environment chaos and vibe</li>
                                <li>Doom - for the fast-paced combat and survival mechanics</li>
                            </ul>
                            <p>Furthermore, the game is partly inspired from real life examples and events from the
                                development team members:</p>
                            <ul>
                                <li>Sierre, the city where this game development has begun</li>
                            </ul>
                        </div>

                        <h3>Links</h3>
                        <ul>
                            <li><a href="https://github.com/FlorentEpiney/SunCity">GitLab Repository</a></li>
                            <li><a href="/game/navigation/pages/homePage.html">Play the Game</a></li>
                        </ul>
                    </div>
                </article>
            </section>
            <aside>
                <div>
                    <h3>Summary of the project data</h3>
                    <p>Total time of project so far: <span id="total-time">0h 0m</span></p>
                    <p><strong>Development team:</strong></p>
                    <ul>
                        <li>
                            <p><strong>Fernandes Walter</strong>: Design & Gameplay</p>
                        </li>
                        <li>
                            <p><strong>Epiney Florent</strong>: JavaScript Specialist</p>
                        </li>
                        <li>
                            <p><strong>Meichtry Micha</strong>: Style CSS Specialist </p>
                        </li>
                        <li>
                            <p><strong>Cortés Julio</strong>: Game Architect</p>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    );
}

export default Description;