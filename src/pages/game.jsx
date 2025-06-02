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