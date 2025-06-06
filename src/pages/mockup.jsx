import React from 'react';
//import { useNavigate } from "react-router-dom";

function Mockup(){
    //const navigate = useNavigate();
    return(
        <div>
            <section id="articles">
                <article>
                    <header>
                        <h2>Mockup of the Project</h2>
                        <p>By Florent Epiney the 29/03/2025 at 16:30</p>
                    </header>
                    <div className="container">
                        <h3>Warning Page</h3>
                        <p>
                            Because of the reference and inspiration from GTA, the game "Sun City" will as well hold a
                            warning page when entering the game. <br/>
                            Players must confirm the age of 18 years or older to access the game.
                        </p>
                        <img src="/resources/images/mockup/warning-18.png" alt="warningpage"/>

                        <h3>Access denied Page</h3>
                        <p>
                            Players under the age of 18 will lang on the page that denies the access to the game.
                        </p>
                        <img src="/resources/images/mockup/accessDenied.png" alt="accessdeniedpage"/>

                        <h3>Homepage</h3>
                        <div>
                            After confirming the age, the players will be redirected to the homepage.
                            The homepage is the main page of the game. It is the first page that the players will see
                            when they enter the game.<br/>
                            Players can choose between 3 options:
                            <ul>
                                <li>Play the game</li>
                                <li>Check out the leaderboard</li>
                                <li>Leave the game</li>
                            </ul>
                        </div>
                        <img src="/resources/images/mockup/homePage.png" alt="homepage"/>

                        <h3>Selection of the avater and the player</h3>
                        <p>
                            After clicking the button <i>PLAY</i>, players will be redirected to the selection of the
                            avatar and the player.
                            Both players can choose a different alias. The alias will be used to store the highscore
                            inside of the leaderboard. If
                            an alias is already used, the previous score will be overridden with the new one.
                            The players location origin is by default automatically recognized. However, they can
                            correct it if
                            they want.
                            Furthermore, players can choose between a set of avatars ehich can be selected by drag and
                            drop to the dedicated field.
                        </p>
                        <img src="/resources/images/mockup/avatarPlayerSelection.png" alt="avatarplayerselection"/>

                        <h3>Count down</h3>
                        <p>
                            The countdown serves to prepare the players before the game starts. It allows them to get
                            ready
                            and to be in best conditions to play. It lasts 3 seconds.
                        </p>
                        <img src="/resources/images/mockup/countdown.png" alt="countdown"/>

                        <h3>Game</h3>
                        <p>
                            The game page is divided in 2 parts, one for each player. It includes the game map with the
                            own view of the player and a board with the life points, the timers and some indications.
                            At the top, there is a <i>Pause</i> button.
                            At the bottom, there are 2 buttons to manage the game sounds.
                        </p>
                        <img src="/resources/images/mockup/gamePage.png" alt="gamepage"/>

                        <h3>Game pause</h3>
                        <p>
                            If one of the players click on the <i>Pause</i> button, the game will be paused and a popup
                            appears.
                            The players can decide whether they want to continue the game, restart from beginning or
                            leave the
                            game and go back to the homepage.
                            Chosing one of the options <em>Restart</em> or <em>Exit</em> will end the game without
                            saving the score.
                        </p>
                        <img src="/resources/images/mockup/gamePause.png" alt="gamepause"/>

                        <h3>Game finished</h3>
                        <p>
                            If one of the player dies, the party is over. The winner and the loser are announced.
                            After 5 seconds, the players are redirected to the leaderboard.
                        </p>
                        <img src="/resources/images/mockup/gameFinish.png" alt="gamefinish"/>

                        <h3>Leaderboard</h3>
                        <p>
                            On the leaderboard, the players can see all the result of the previous games.
                            The leaderboard is sorted by the score. The player with the highest score will be displayed
                            on top.
                            The score is calculated according to the time the player survived in Sun City.
                        </p>
                        <img src="/resources/images/mockup/leaderBoard.png" alt="leaderboard"/>

                        <h3>Exit Page</h3>
                        <p>Clicking the button <i>EXIT</i> will redirect the player to the exit page wishing the player
                            a goodbye.</p>
                        <img src="/resources/images/mockup/exitPage.png" alt="exitpage"/>
                    </div>
                </article>
            </section>
        </div>
    );
}

export default Mockup;