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
                    </header>
                    <div className="container">
                        <h3>Sun City</h3>
                        <p>
                            Welcome to <strong>Sun City</strong>, a 2-player survival game developed as part of the Web
                            development course at <a href="https://www.hevs.ch" target="_blank" rel="noreferrer"><strong>HES-SO Valais</strong></a>.
                            Set in a post-apocalyptic version of the city Sierre, the game immerses you in a World
                            devastated by a virus outbreak.
                            With society in ruins and the law of the jungle prevailing, your only goal is to survive
                            against relentless waves of enemies.
                        </p>

                        <h3>Objective</h3>
                        <p>
                            The objective of <strong>Sun City</strong> is simple: survive for as long as possible.
                            A timer tracks each player's survival time, and the longer you stay alive, the more points you accumulate.
                            However, with time comes increasing difficulty—more enemies appear, stamina decreases, and survival becomes harder.
                            The ultimate challenge is to outlast your opponent while staying alive in a harsh, enemy-filled environment.
                        </p>

                        <h3>Gameplay Overview</h3>
                        <ul>
                            <li>Choose your avatar and enter the destroyed streets of Sierre.</li>
                            <li>Use your weapon to fight enemies and extend your survival time.</li>
                            <li>Collect health kits scattered around the map to recover lost life points.</li>
                            <li>The difficulty increases over time: more time = more enemies = higher challenge.</li>
                            <li>The match ends as soon as one of the two players dies.</li>
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
                        </ul>
                    </div>
                </article>
            </section>
        </div>
    );
}

export default Description;