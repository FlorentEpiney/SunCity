import React from 'react';
//import { useNavigate } from "react-router-dom";

function Logbook(){
    //const navigate = useNavigate();
    return(
        <div>
            <section id="articles">
                <article>
                    <header>
                        <h2>Project Logbook</h2>
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
                                <td>Florent, Julio, Micha, Walter</td>
                                <td>2H</td>
                            </tr>
                            <tr>
                                <td>28.02.2025</td>
                                <td>Define game mechanics and core concept</td>
                                <td>Julio</td>
                                <td>Florent, Julio, Micha, Walter</td>
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
                                <td>Florent, Julio</td>
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
                                <td>10.04.2025</td>
                                <td>Code main game loop</td>
                                <td>Florent</td>
                                <td>Florent, Julio</td>
                                <td>5H</td>
                            </tr>
                            <tr>
                                <td>10.04.2025</td>
                                <td>Add player movement</td>
                                <td>Florent</td>
                                <td>Florent</td>
                                <td>5H</td>
                            </tr>
                            <tr>
                                <td>10.04.2025</td>
                                <td>Implement collision detection</td>
                                <td>Florent</td>
                                <td>Florent</td>
                                <td>6H</td>
                            </tr>
                            <tr>
                                <td>30.04.2025</td>
                                <td>Develop enemies and obstacles</td>
                                <td>Julio</td>
                                <td>Julio</td>
                                <td>5H</td>
                            </tr>
                            <tr>
                                <td>12.05.2025</td>
                                <td>Develop textures</td>
                                <td>Walter</td>
                                <td>Walter</td>
                                <td>4H</td>
                            </tr>
                            <tr>
                                <td>15.05.2025</td>
                                <td>Add animations</td>
                                <td>Walter</td>
                                <td>Walter</td>
                                <td>3H</td>
                            </tr>
                            <tr>
                                <td>03.03.2025</td>
                                <td>Implement game sounds and music</td>
                                <td>Florent</td>
                                <td>Florent</td>
                                <td>1H</td>
                            </tr>
                            <tr>
                                <td>24.04.2025</td>
                                <td>Develop scoring system</td>
                                <td>Florent</td>
                                <td>Florent</td>
                                <td>2H</td>
                            </tr>
                            <tr>
                                <td>01.05.2025</td>
                                <td>Create UI elements (menus, buttons, scoreboard)</td>
                                <td>Walter</td>
                                <td>Micha, Walter</td>
                                <td>4H</td>
                            </tr>
                            <tr>
                                <td>23.05.2025</td>
                                <td>Optimize performance</td>
                                <td>Julio</td>
                                <td>Julio</td>
                                <td>3H</td>
                            </tr>
                            <tr>
                                <td>05.06.2025</td>
                                <td>Test and debug</td>
                                <td>Florent, Micha</td>
                                <td>Florent, Julio, Micha, Walter</td>
                                <td>2H</td>
                            </tr>
                            <tr>
                                <td>20.05.2025</td>
                                <td>Implement game over & restart logic</td>
                                <td>Julio</td>
                                <td>Florent, Julio</td>
                                <td>2H</td>
                            </tr>
                            <tr>
                                <td>29.05.2025</td>
                                <td>Refactor code and optimize</td>
                                <td>Julio</td>
                                <td>Florent, Julio</td>
                                <td>5H</td>
                            </tr>
                            <tr>
                                <td>31.05.2025</td>
                                <td>Deploy game online (GitHub Pages / Netlify)</td>
                                <td>Julio</td>
                                <td>Julio</td>
                                <td>3H</td>
                            </tr>
                            <tr>
                                <td>05.06.2025</td>
                                <td>Final bug fixes and polish</td>
                                <td>Florent, Julio, Walter</td>
                                <td>Florent, Julio, Walter</td>
                                <td>5H</td>
                            </tr>
                            <tr>
                                <td>09.06.2025</td>
                                <td>Prepare for presentation/demo</td>
                                <td>Florent, Julio, Micha, Walter</td>
                                <td>Florent, Julio, Micha, Walter</td>
                                <td>2H</td>
                            </tr>
                        </tbody>
                    </table>
                </article>
            </section>
        </div>
    );
}

export default Logbook;