import React from 'react';
import { useNavigate } from "react-router-dom";


function Flow(){
    const navigate = useNavigate();
    return(
        <div>
            <section id="articles">
                <article>
                    <header>
                        <h2>Game's Website Flow and Interaction</h2>
                        <p>By Micha Meichtry the 29/03/2025 at 16:30</p>
                    </header>

                    <h3>Game Flow</h3>
                    <p>
                        The website guides you through a series of engaging pages: a warm welcome that introduces the
                        game,
                        a selection screen for your avatar and personal details,
                        the main gameplay area, and a leaderboard to track your progress. The visual below shows how
                        these
                        sections connect.
                    </p>
                    <a href="/resources/images/flowDiag.png"><img
                        src="/resources/images/flowDiag.png" alt="Flow diagram"
                        title="Game Flow"/></a>


                    <h3>Game Process</h3>
                    <p>
                        Before starting, players are asked to verify they are 18 or older due to mature content. This
                        step
                        ensures a responsible gaming environment,
                        while smooth transitions and loading screens provide a seamless experience throughout the site.
                    </p>
                    <a href="/resources/images/GameProcessDiagram.drawio.png"><img
                        src="/resources/images/GameProcessDiagram.drawio.png" alt="Process diagram"
                        title="Game Process"/></a>

                    <h3>Gameplay Process</h3>
                    <p>
                        In the game, you'll face increasingly tough challenges. With each phase, expect stronger enemies
                        and
                        helpful health kits at key intervals.
                        Your mission is to outlast every challenge and see how long you can survive.
                    </p>
                    <a href="/resources/images/GamePlayDiagram.drawio.png"><img
                        src="/resources/images/GamePlayDiagram.drawio.png" alt="Gameplay process"
                        title="Gameplay Process"/></a>

                    <h3>Game Sequence</h3>
                    <p>
                        At the end of your session, your score is recorded and displayed on the leaderboard, letting you
                        compare your performance with others.
                        Every playthrough is a fresh challenge in this unpredictable, post-apocalyptic world.
                    </p>
                    <a href="/resources/images/SequenceDiag.drawio.png"><img
                        src="/resources/images/SequenceDiag.drawio.png"
                        alt="Sequence diagram" title="Game Sequence"/></a>
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

export default Flow;