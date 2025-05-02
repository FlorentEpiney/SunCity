import Maps from './Maps.js'; 
import Player from './Player.js';
import Enemy from './Enemy.js';
import Bullet from './Bullet.js';
import Upgrade from './Upgrade.js';
import Leaderboard from './Leaderboard.js';
import { Img } from './Managers/ImagesManager.js';
import EnemyFactory from './Managers/EnemyFactory.js'
export { WIDTH, HEIGHT };


// Define global variables that will be used by other modules
window.WIDTH = 1000;
window.HEIGHT = 250;
window.TILE_SIZE = 32 * 2;
window.timeWhenGameStarted = Date.now();
window.frameCount = 0;
window.score = 0;
window.paused = false;


// Variables globales pour les dimensions du canvas
let WIDTH = window.innerWidth * 0.45; // 45% de la largeur de la fenêtre
let HEIGHT = window.innerHeight * 0.8; // 80% de la hauteur de la fenêtre


// Fonction pour redimensionner les canvas
function resizeCanvases() {
    WIDTH = window.innerWidth * 0.45;
    HEIGHT = window.innerHeight * 0.8;

    console.log("WIDTH : " + WIDTH);
    console.log("HEIGHT : " + HEIGHT);
    // Limiter les dimensions minimales pour éviter les problèmes de jeu
    WIDTH = Math.max(WIDTH, 400);
    HEIGHT = Math.max(HEIGHT, 400);

    // Mettre à jour les dimensions des canvas
    const canvas1 = document.getElementById('player1Canvas');
    const canvas2 = document.getElementById('player2Canvas');

    canvas1.width = WIDTH;
    canvas1.height = HEIGHT;
    canvas2.width = WIDTH;
    canvas2.height = HEIGHT;

    // Régénérer le contexte après redimensionnement
    ctx1 = canvas1.getContext('2d');
    ctx2 = canvas2.getContext('2d');

    // Réinitialiser les paramètres de contexte si nécessaire
    ctx1.textAlign = 'center';
    ctx2.textAlign = 'center';
}

// Appeler la fonction au chargement et au redimensionnement de la fenêtre
window.addEventListener('load', resizeCanvases);
window.addEventListener('resize', function() {
    // Utiliser un debounce pour éviter des redimensionnements trop fréquents
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(resizeCanvases, 250);
});




var canvas1 = document.getElementById("player1Canvas");
var ctx1 = canvas1.getContext("2d");
var canvas2 = document.getElementById("player2Canvas");
var ctx2 = canvas2.getContext("2d");

ctx1.font = '30px Arial';
ctx1.mozImageSmoothingEnabled = false;
ctx1.msImageSmoothingEnabled = false;
ctx1.imageSmoothingEnabled = false;

ctx2.font = '30px Arial';
ctx2.mozImageSmoothingEnabled = false;
ctx2.msImageSmoothingEnabled = false;
ctx2.imageSmoothingEnabled = false;

var TILE_SIZE = 32 * 2;
// var WIDTH = 1000;
// var HEIGHT = 250;
var timeWhenGameStarted = Date.now();
var scorePlayer1 = 0;
var scorePlayer2 = 0;
var paused = false;
var gameloop;

function testCollisionRectRect(rect1, rect2) {
    return rect1.x <= rect2.x + rect2.width &&
        rect2.x <= rect1.x + rect1.width &&
        rect1.y <= rect2.y + rect2.height &&
        rect2.y <= rect1.y + rect1.height;
}


var player1;
var player2;
var player;

// Load the collision map data
fetch('../../gameData/collision_map.json')
    .then(response => response.json())
    .then(response => {
        var array = response;
        var array2D = [];
        for (var i = 0; i < 100; i++) {
            array2D[i] = [];
            for (var j = 0; j < 200; j++) {
                array2D[i][j] = array[i * 200 + j];
            }
        }
        Maps.current = Maps('field', '../../ressources/images/suncity_map.png', array2D);

// fetch('gameData/collision_map_test.json')
//     .then(response => response.json())
//     .then(response => {
//         var array = response;
//         var array2D = [];
//         for(var i = 0 ; i < 10; i++){
//             array2D[i] = [];
//             for(var j = 0 ; j < 10; j++){
//                 array2D[i][j] = array[i * 10 + j];
//             }
//         }
//         Maps.current = Maps('field', 'ressources/images/map.png', array2D);

        // Initialize players
        let player1Name = localStorage.getItem("player1Name");
        let player1Img = Img.player[localStorage.getItem("player1Img")];
        let player2Name =  localStorage.getItem("player2Name");
        let player2Img =  Img.player[localStorage.getItem("player2Img")];
        player1 = Player(250, 100, player1Name, player1Img, 'player1'); // Starting position for player1
        player2 = Player(350, 100, player2Name, player2Img, 'player2'); // Starting position for player2
        player = player1;
        startNewGame();

        gameloop = setInterval(update, 40);
    })
.catch(error => {
        console.error('Error loading collision map:', error);
    });

    document.onkeydown = function(event) {
        // Player 1 controls
        if (event.keyCode === 68) { //d
            player1.pressingRight = true;
        } else if (event.keyCode === 83) { //s
            player1.pressingDown = true;
        } else if (event.keyCode === 65) { //a
            player1.pressingLeft = true;
        } else if (event.keyCode === 87) { // w
            player1.pressingUp = true;
        } else if (event.keyCode === 16) { // Shift key - toggle rotation mode
            player1.toggleRotationMode();
        } else if (event.keyCode === 81) { // q - attack
            player1.performAttack();
        } else if (event.keyCode === 69) { // e - special attack
            player1.performSpecialAttack();
        }

        // Player 2 controls
        if (event.keyCode === 39) { // right arrow
            player2.pressingRight = true;
        } else if (event.keyCode === 40) { // down arrow
            player2.pressingDown = true;
        } else if (event.keyCode === 37) { // left arrow
            player2.pressingLeft = true;
        } else if (event.keyCode === 38) { // up arrow
            player2.pressingUp = true;
        } else if (event.keyCode === 13) { // Enter key - toggle rotation mode
            player2.toggleRotationMode();
        } else if (event.keyCode === 48) { // 0 - attack
            player2.performAttack();
        } else if (event.keyCode === 57) { // 9 - special attack
            player2.performSpecialAttack();
        } else if (event.keyCode === 80) { //p - pause
            paused = !paused;
            paused ? showPausePopup() : hidePausePopup();
        }
    };

    document.onkeyup = function(event) {
        // Player 1 controls
        if (event.keyCode === 68) //d
            player1.pressingRight = false;
        else if (event.keyCode === 83) //s
            player1.pressingDown = false;
        else if (event.keyCode === 65) //a
            player1.pressingLeft = false;
        else if (event.keyCode === 87) // w
            player1.pressingUp = false;

        // Player 2 controls
        if (event.keyCode === 39) // right arrow
            player2.pressingRight = false;
        else if (event.keyCode === 40) // down arrow
            player2.pressingDown = false;
        else if (event.keyCode === 37) // left arrow
            player2.pressingLeft = false;
        else if (event.keyCode === 38) // up arrow
            player2.pressingUp = false;
    };

// Update function in Game.js
function update() {
    if (paused) {return;}

    // Verification of the end of the game
    if (player1.hp <= 0 || player2.hp <= 0) {

        clearInterval(gameloop); // stop the game loop

        localStorage.setItem('hpPlayer1',player1.hp);
        localStorage.setItem('hpPlayer2',player2.hp);

        if(player1.hp <= 0){
            localStorage.setItem('winner','2');
            ctx1.fillStyle = 'rgba(255, 0, 0, 0.3)';
            ctx1.fillRect(2, 2, WIDTH - 4, HEIGHT - 4);
            ctx2.fillStyle = 'rgba(0, 255, 0, 0.3)';
            ctx2.fillRect(2, 2, WIDTH - 4, HEIGHT - 4);

            ctx1.font = 'bold 40px Arial';
            ctx1.fillStyle = 'black';
            ctx1.textAlign = 'center';
            ctx1.fillText('You Lose!', WIDTH / 2, HEIGHT / 2);

            ctx2.font = 'bold 40px Arial';
            ctx2.fillStyle = 'black';
            ctx2.textAlign = 'center';
            ctx2.fillText('You Win!', WIDTH / 2, HEIGHT / 2);

            setTimeout(() => showEndGamePopup(2), 5000);

        }else{
            localStorage.setItem('winner','1');
            ctx2.fillStyle = 'rgba(255, 0, 0, 0.3)';
            ctx2.fillRect(2, 2, WIDTH - 4, HEIGHT - 4);
            ctx1.fillStyle = 'rgba(0, 255, 0, 0.3)';
            ctx1.fillRect(2, 2, WIDTH - 4, HEIGHT - 4);

            ctx2.font = 'bold 40px Arial';
            ctx2.fillStyle = 'black';
            ctx2.textAlign = 'center';
            ctx2.fillText('You Lose!', WIDTH / 2, HEIGHT / 2);

            ctx1.font = 'bold 40px Arial';
            ctx1.fillStyle = 'black';
            ctx1.textAlign = 'center';
            ctx1.fillText('You Win!', WIDTH / 2, HEIGHT / 2);

            setTimeout(() => showEndGamePopup(1), 5000);
        }

        //Leaderboard
        Leaderboard().saveScore();

        return;
    }

    ctx1.clearRect(0, 0, WIDTH, HEIGHT);
    ctx2.clearRect(0, 0, WIDTH, HEIGHT);

    // Update players
    player1.update(ctx1);
    player2.update(ctx2);

    // Draw the map and players on canvas 1 (Player 1's perspective)
    Maps.current.draw(ctx1, player1);
    player1.draw(ctx1);

    // Draw player2 relative to player1's position
    let p2_x_relative_to_p1 = player2.x - player1.x;
    let p2_y_relative_to_p1 = player2.y - player1.y;
    player2.drawAt(ctx1, p2_x_relative_to_p1, p2_y_relative_to_p1);

    // Draw the map and players on canvas 2 (Player 2's perspective)
    Maps.current.draw(ctx2, player2);
    player2.draw(ctx2);

    // Draw player1 relative to player2's position
    let p1_x_relative_to_p2 = player1.x - player2.x;
    let p1_y_relative_to_p2 = player1.y - player2.y;
    player1.drawAt(ctx2, p1_x_relative_to_p2, p1_y_relative_to_p2);

    // Update game state
    frameCount++;
    player1.score++;
    player2.score++;

    // Store player stats in local storage
    localStorage.setItem('hpPlayer1', player1.hp);
    localStorage.setItem('scorePlayer1', player1.score);
    localStorage.setItem('hpPlayer2', player2.hp);
    localStorage.setItem('scorePlayer2', player2.score);

    // Update game entities
    Bullet.update(ctx1, ctx2, player1, player2);
    Upgrade.update(ctx1, ctx2, player1, player2);
    Enemy.update(ctx1, ctx2, player1, player2);

}

function startNewGame() {
    player1.hp = 10;
    player1.score = 0;
    player2.hp = 10;
    player2.score = 0;
    timeWhenGameStarted = Date.now();
    frameCount = 0;
    scorePlayer1 = 0;
    scorePlayer2 = 0;
    Enemy.list = {};
    Upgrade.list = {};
    Bullet.list = {};
    /*
    Enemy.randomlyGenerate();
    Enemy.randomlyGenerate();
    Enemy.randomlyGenerate();
    */
    EnemyFactory.randomlyGenerate();


}

// Pause Popup Logic
function showPausePopup() {
    document.getElementById('pausePopup').style.display = 'flex';
}
function hidePausePopup() {
    document.getElementById('pausePopup').style.display = 'none';
}
const resumeGameButton = document.getElementById('resumeGame');
resumeGameButton.addEventListener('click', function () {
    paused = false;
    hidePausePopup();
});
const restartGameButton = document.getElementById('restartGame');
restartGameButton.addEventListener('click', function () {
    paused = false;
    hidePausePopup();
    location.reload();
});
const exitGameButton = document.getElementById('exitGame');
exitGameButton.addEventListener('click', function () {
    paused = false;
    hidePausePopup();
    window.location.href = 'exit.html';
});

const pauseButton = document.getElementById('pauseButton');
pauseButton.addEventListener('click', function () {
    paused = true;
    showPausePopup();
});
function showEndGamePopup(winner) {
    const popup = document.getElementById('endGamePopup');
    const localPlayer = localStorage.getItem('playerNumber');

    popup.style.display = 'flex';
}

document.getElementById('replayGame').addEventListener('click', () => {
    location.reload();
});
document.getElementById('exitGameEnd').addEventListener('click', () => {
    window.location.href = 'exit.html';
});


