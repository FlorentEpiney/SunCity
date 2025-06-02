import React from 'react';
//import { useNavigate } from "react-router-dom";

function Models(){
    //const navigate = useNavigate();
    return(
        <div>
            <section id="articles">
                <article>
                    <header>
                        <h2>Visual Models of the Project</h2>
                    </header>
                    <h3>Players</h3>
                    <p> At the start of the game, players are asked to choose between 4 figures: <br/>
                        <b>Hitman</b>, <b>Soldier</b>, <b>Survivor</b> and <b>Resident</b></p>
                    <img id="hitman" src="/game/ressources/images/player-img/avatar_hitman.png" alt="hitman"/>
                    <img id="soldier" src="/game/ressources/images/player-img/avatar_soldier.png"
                         alt="soldier"/>
                    <img id="survivor" src="/game/ressources/images/player-img/avatar_survivor.png" alt="survivor"/>
                    <img id="resident" src="/game/ressources/images/player-img/avatar_woman.png" alt="resident"/>

                    <h3>Upgrades</h3>
                    <p>There are several kinds of upgrades. Each one has its particular effect:
                        #Julio, list and describe the upgrades...</p>
                    <img id="medal" className="white-image upgrade-image" src="/game/ressources/images/upgrades/upgrade1.png"
                         alt="medal"/>
                    <img id="gun" className="white-image upgrade-image" src="/game/ressources/images/upgrades/upgrade3.png"
                         alt="gun"/>
                    <img id="more" className="upgrade-image" src="/game/ressources/images/upgrades/upgrade2.png" alt="more"/>

                    <h3>Enemies</h3>
                    <p>There are different type of enemmies:
                        #Julio to list and describe the different types
                        #Julio do you have better images for that ?</p>
                    <img id="9mmhandgun" src="/game/ressources/images/enemy-img/enemy_9mmhandgun.png" alt="9mmhandgun"/>
                    <img id="flamethrower" src="/game/ressources/images/enemy-img/enemy_flamethrower.png"
                         alt="flamethrower"/>
                    <img id="knife." src="/game/ressources/images/enemy-img/enemy_knife.gif" alt="knife."/>
                    <img id="pumpgun" src="/game/ressources/images/enemy-img/enemy_pumpgun.png" alt="pumpgun"/>

                    <h3>Sun City Map</h3>
                    <p>
                        The game map is inspired by the city of Sierre, also called "sun city". There are some key
                        elements of Sierre
                        represented in the game such as the Rhones river, the Chateau Mercier castel,
                        the Petit Bois park or offices on the Avenue Général Guisan.
                    </p>
                    <img src="/game/ressources/images/suncity_map.png" alt="suncitymap"/>
                </article>
            </section>
        </div>
    );
}

export default Models;