import Maps from './Maps.js';
import Player from './Player.js';
import Enemy from './Enemy.js';
import Bullet from './Bullet.js';
import Upgrade from './Upgrade.js';
import Leaderboard from './Leaderboard.js';
import GameLoop from "./GameLoop.js"; // Fixed extension
import { Img } from './Managers/ImagesManager.js';
import EnemyFactory from './Managers/EnemyFactory.js'
export { WIDTH, HEIGHT };
export { player1, player2, winner};

// Define global variables that will be used by other modules
window.TILE_SIZE = 32 * 2;
window.timeWhenGameStarted = Date.now();
window.frameCount = 0;
window.score = 0;
window.paused = false;

let WIDTH = window.innerWidth * 0.45; // 45% of windows width
let HEIGHT = window.innerHeight * 0.8; // 80% of windows height
let winner;
let gameLoop; // Game loop manager

// Function for redimensioning the canvas
function resizeCanvases() {
    WIDTH = window.innerWidth * 0.45;
    HEIGHT = window.innerHeight * 0.8;

    // Limit the minimal dimensions in order to avoid game problems
    WIDTH = Math.max(WIDTH, 400);
    HEIGHT = Math.max(HEIGHT, 400);

    // Update the canvas dimensions
    const canvas1 = document.getElementById('player1Canvas');
    const canvas2 = document.getElementById('player2Canvas');

    canvas1.width = WIDTH;
    canvas1.height = HEIGHT;
    canvas2.width = WIDTH;
    canvas2.height = HEIGHT;

    // Regenerate context after redimensioning
    ctx1 = canvas1.getContext('2d');
    ctx2 = canvas2.getContext('2d');

    // Reinizialise context parameters if necessary
    ctx1.textAlign = 'center';
    ctx2.textAlign = 'center';
}

// call function by loading or redimensioning the window
window.addEventListener('load', resizeCanvases);
window.addEventListener('resize', function() {
    // Use the debounce to avoid too frequently redimensioning
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(resizeCanvases, 250);
});

let canvas1 = document.getElementById("player1Canvas");
let ctx1 = canvas1.getContext("2d");
let canvas2 = document.getElementById("player2Canvas");
let ctx2 = canvas2.getContext("2d");

ctx1.font = '30px Arial';
ctx1.mozImageSmoothingEnabled = false;
ctx1.msImageSmoothingEnabled = false;
ctx1.imageSmoothingEnabled = false;

ctx2.font = '30px Arial';
ctx2.mozImageSmoothingEnabled = false;
ctx2.msImageSmoothingEnabled = false;
ctx2.imageSmoothingEnabled = false;

let player1;
let player2;

// Load the collision map data
fetch('../../gameData/collision_map.json')
    .then(response => response.json())
    .then(response => {
        let array = response;
        let array2D = [];
        for (let i = 0; i < 100; i++) {
            array2D[i] = [];
            for (let j = 0; j < 200; j++) {
                array2D[i][j] = array[i * 200 + j];
            }
        }
        Maps.current = Maps('field', '../../ressources/images/suncity_map.png', array2D);

        // Initialize players
        let player1Name = localStorage.getItem("player1Name");
        let player1Img = Img.player[parseInt(localStorage.getItem("player1Img")) || 0];
        let player2Name = localStorage.getItem("player2Name");
        let player2Img = Img.player[parseInt(localStorage.getItem("player2Img")) || 1];
        player1 = Player(250, 100, player1Name, player1Img, 'player1');
        player2 = Player(10000, 100, player2Name, player2Img, 'player2');
        window.player1 = player1;
        window.player2 = player2;

        // Initialize the game loop manager
        gameLoop = new GameLoop(canvas1, canvas2, player1, player2, WIDTH, HEIGHT);

        // Start the game loop (this will reset the game state)
        gameLoop.startGameLoop();
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
        gameLoop.togglePause();
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

// Pause Popup Logic
function showPausePopup() {
    document.getElementById('pausePopup').style.display = 'flex';
}

function hidePausePopup() {
    document.getElementById('pausePopup').style.display = 'none';
}

const resumeGameButton = document.getElementById('resumeGame');
resumeGameButton.addEventListener('click', function () {
    gameLoop.resumeGame();
});

const restartGameButton = document.getElementById('restartGame');
restartGameButton.addEventListener('click', function () {
    gameLoop.stopGameLoop();
    location.reload();
});

const exitGameButton = document.getElementById('exitGame');
exitGameButton.addEventListener('click', function () {
    gameLoop.stopGameLoop();
    window.location.href = 'exit.html';
});

const pauseButton = document.getElementById('pauseButton');
pauseButton.addEventListener('click', function () {
    gameLoop.pauseGame();
});

document.getElementById('replayGame').addEventListener('click', () => {
    location.reload();
});

document.getElementById('exitGameEnd').addEventListener('click', () => {
    window.location.href = 'exit.html';
});