import React from 'react';
import { useNavigate } from "react-router-dom";

function Logbook(){
    const navigate = useNavigate();
    return(
        <div>
            <section id="articles">
                <article>
                    <header>
                        <h2>Project Logbook</h2>
                        <p>By Micha Meichtry the 29/03/2025 at 16:30</p>
                    </header>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Task</th>
                                <th>Responsible</th>
                                <th>Assigned To</th>
                                <th>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>01.03.2025</td>
                                <td>Create GitHub repository</td>
                                <td>Florent</td>
                                <td>Florent</td>
                                <td>30M</td>
                            </tr>
                            <tr>
                                <td>28.02.2025</td>
                                <td>Brainstorm game ideas</td>
                                <td>Julio</td>
                                <td>Micha, Florent, Walter, Julio</td>
                                <td>2H</td>
                            </tr>
                            <tr>
                                <td>28.02.2025</td>
                                <td>Define game mechanics and core concept</td>
                                <td>Julio</td>
                                <td>Micha, Florent, Walter, Julio</td>
                                <td>3H</td>
                            </tr>
                            <tr>
                                <td>21.03.2025</td>
                                <td>Create wireframes and UI mockups</td>
                                <td>Florent</td>
                                <td>Florent</td>
                                <td>2H</td>
                            </tr>
                            <tr>
                                <td>21.03.2025</td>
                                <td>Set up project structure (HTML, CSS, JS)</td>
                                <td>Florent</td>
                                <td>Julio, Florent</td>
                                <td>2H</td>
                            </tr>
                            <tr>
                                <td>22.03.2025</td>
                                <td>Implement CSS styles</td>
                                <td>Micha</td>
                                <td>Micha</td>
                                <td>5H30M</td>
                            </tr>
                            <tr>
                                <td>28.03.2025</td>
                                <td>Mockup & Models</td>
                                <td>Florent</td>
                                <td>Florent</td>
                                <td>3H</td>
                            </tr>
                            <tr>
                                <td>29.03.2025</td>
                                <td>HTML & CSS modification & clean up</td>
                                <td>Micha</td>
                                <td>Micha</td>
                                <td>3H</td>
                            </tr>
                            <tr>
                                <td>TBD</td>
                                <td>Code main game loop</td>
                                <td>TBD</td>
                                <td>TBD</td>
                                <td>TBD</td>
                            </tr>
                            <tr>
                                <td>TBD</td>
                                <td>Add player movement</td>
                                <td>TBD</td>
                                <td>TBD</td>
                                <td>TBD</td>
                            </tr>
                            <tr>
                                <td>TBD</td>
                                <td>Implement collision detection</td>
                                <td>TBD</td>
                                <td>TBD</td>
                                <td>TBD</td>
                            </tr>
                            <tr>
                                <td>TBD</td>
                                <td>Develop enemies and obstacles</td>
                                <td>TBD</td>
                                <td>TBD</td>
                                <td>TBD</td>
                            </tr>
                            <tr>
                                <td>TBD</td>
                                <td>Develop textures</td>
                                <td>TBD</td>
                                <td>TBD</td>
                                <td>TBD</td>
                            </tr>
                            <tr>
                                <td>TBD</td>
                                <td>Add animations</td>
                                <td>TBD</td>
                                <td>TBD</td>
                                <td>TBD</td>
                            </tr>
                            <tr>
                                <td>TBD</td>
                                <td>Implement game sounds and music</td>
                                <td>TBD</td>
                                <td>TBD</td>
                                <td>TBD</td>
                            </tr>
                            <tr>
                                <td>TBD</td>
                                <td>Develop scoring system</td>
                                <td>TBD</td>
                                <td>TBD</td>
                                <td>TBD</td>
                            </tr>
                            <tr>
                                <td>TBD</td>
                                <td>Create UI elements (menus, buttons, scoreboard)</td>
                                <td>TBD</td>
                                <td>TBD</td>
                                <td>TBD</td>
                            </tr>
                            <tr>
                                <td>TBD</td>
                                <td>Optimize performance</td>
                                <td>TBD</td>
                                <td>TBD</td>
                                <td>TBD</td>
                            </tr>
                            <tr>
                                <td>TBD</td>
                                <td>Test and debug</td>
                                <td>TBD</td>
                                <td>TBD</td>
                                <td>TBD</td>
                            </tr>
                            <tr>
                                <td>TBD</td>
                                <td>Add responsive design for mobile</td>
                                <td>TBD</td>
                                <td>TBD</td>
                                <td>TBD</td>
                            </tr>
                            <tr>
                                <td>TBD</td>
                                <td>Implement game over & restart logic</td>
                                <td>TBD</td>
                                <td>TBD</td>
                                <td>TBD</td>
                            </tr>
                            <tr>
                                <td>TBD</td>
                                <td>Refactor code and optimize</td>
                                <td>TBD</td>
                                <td>TBD</td>
                                <td>TBD</td>
                            </tr>
                            <tr>
                                <td>TBD</td>
                                <td>Deploy game online (GitHub Pages / Netlify)</td>
                                <td>TBD</td>
                                <td>TBD</td>
                                <td>TBD</td>
                            </tr>
                            <tr>
                                <td>TBD</td>
                                <td>Final bug fixes and polish</td>
                                <td>TBD</td>
                                <td>TBD</td>
                                <td>TBD</td>
                            </tr>
                            <tr>
                                <td>TBD</td>
                                <td>Prepare for presentation/demo</td>
                                <td>TBD</td>
                                <td>TBD</td>
                                <td>TBD</td>
                            </tr>
                        </tbody>
                    </table>


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

export default Logbook;