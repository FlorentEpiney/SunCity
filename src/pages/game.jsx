import React from 'react';
//import { useNavigate } from "react-router-dom";

function Game(){
    //const navigate = useNavigate();
    return(
        <div>
            <section id="articles">
                <article>
                    <header>
                        <h2>Game</h2>
                    </header>
                    <div className="container">
                        <p>
                            The game is a simple two-player game where each player controls a character that can move
                            around the screen. The objective is to collect as many points as possible while avoiding
                            obstacles.
                        </p>
                        <p>
                            Players can control their characters using the arrow keys on their keyboard. The game
                            features a timer, and the player with the most points at the end of the time limit wins.
                        </p>
                        <p>
                            The game is designed to be fun and engaging, with colorful graphics and sound effects. It is
                            a great way to test your reflexes and compete with friends.
                        </p>
                        <button onClick={() => window.location.href = '/game/navigation/pages/homePage.html'}>
                            Start Game
                        </button>
                    </div>
                </article>
            </section>
        </div>
    );
}

export default Game;