import React from 'react';
import { useNavigate } from "react-router-dom";

function Models(){
    const navigate = useNavigate();
    return(
        <div>
            <section id="articles">
                <article>
                    <header>
                        <h2>Visual Models of the Project</h2>
                        <p>By Micha Meichtry the 29/03/2025 at 16:30</p>
                    </header>
                    <h3>Players</h3>
                    <p> At the start of the game players are asked to choose between a male or female figure.</p>
                    <img id="playerMale" src="../resources/images/models/figures/man/npcmaleidle.png" alt="playerMan"/>
                    <img id="playerFemale" src="../resources/images/models/figures/woman/npcfemaleidle.png"
                         alt="playerWoman"/>

                    <p>Additionally, there is a specific alias of each player that will be displayed above the figure to
                        indicate which player is which.</p>
                    <img src="../resources/images/models/figures/man/leon.png" alt="leonPlayer"/>
                    <img src="../resources/images/models/figures/woman/madeline.png" alt="madelinePlayer"/>

                    <h3>Enemies</h3>
                    <p>There is a generic enemy model. Every enemy spawned on the map will look like the enemy figure
                        presented in different orientations.</p>
                    <img src="../resources/images/models/figures/enemy/dudeWutIsScratch.png" alt="enemy"/>

                    <p>The health bar on top of each enemy indicates how much health points are left.</p>
                    <img src="../resources/images/models/figures/enemy/enemy.png" alt="enemyLifeBar"/>

                    <h3>Sun City Map</h3>
                    <p>
                        The game map is inspired by the city of Sierre, also called "sun city". There are some key
                        elements of Sierre
                        represented in the game such as the main streets, the traditional squares, both lakes and some
                        well-known buildings like the hospital or the police
                        office.<br/>
                        The game is designed in 2D. The players can only walk on top of the streets and on the gras.
                        The player will be blocked from walking on top of buildings or water or from walking through
                        trees.
                    </p>
                    <img src="../resources/images/mockup/suncity_map.png" alt="suncitymap"/>

                    <h3>Building</h3>
                    <p>The game map is filled with some well-known buildings of Sierre such as the followin
                        buildings.</p>

                    <h4>Bus station</h4>
                    <img src="../resources/images/models/buildings/bus_depo_0.png" alt="busstation"/>

                    <h4>Hospital</h4>
                    <img src="../resources/images/models/buildings/spr_hospital.png" alt="hospital"/>

                    <h4>Church</h4>
                    <img src="../resources/images/models/buildings/church.gif" alt="church"/>

                    <h4>Petrol station</h4>
                    <img src="../resources/images/models/buildings/petrol_station_0.png" alt="petrolstation"/>

                    <h4>Football pitch</h4>
                    <img src="../resources/images/models/buildings/football-pitch.png" alt="footballpitch"/>

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

export default Models;