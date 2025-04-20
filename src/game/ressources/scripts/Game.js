import Maps from './Maps.js'; 
import Player from './Player.js';
import Enemy from './Enemy.js';
import Bullet from './Bullet.js';
import Upgrade from './Upgrade.js';
import { Img } from './Managers/ImagesManager.js';


// Define global variables that will be used by other modules
window.WIDTH = 500;
window.HEIGHT = 500;
window.TILE_SIZE = 32 * 2;
window.timeWhenGameStarted = Date.now();
window.frameCount = 0;
window.score = 0;
window.paused = false;



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
var WIDTH = 500;
var HEIGHT = 500;
var timeWhenGameStarted = Date.now();
var frameCount = 0;
var scorePlayer1 = 0;
var scorePlayer2 = 0;
var paused = false;

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
        player1 = Player(250, 100, player1Name, player1Img); // Starting position for player1
        player2 = Player(350, 100, player2Name, player2Img); // Starting position for player2
        player = player1;
        startNewGame();

        setInterval(update, 40);
    })
    .catch(error => {
        console.error('Error loading collision map:', error);
    });

 document.onkeydown = function(event) {
     if (event.keyCode === 68) { //d
         player1.pressingRight = true;
         player1.aimAngle = 0;
     } else if (event.keyCode === 83) {//s
         player1.pressingDown = true;
         player1.aimAngle = 90;
     } else if (event.keyCode === 65) { //a
         player1.pressingLeft = true;
         player1.aimAngle = 180;
     } else if (event.keyCode === 87){ // w
         player1.pressingUp = true;
         player1.aimAngle = 270;
     }else if (event.keyCode === 81) // q
        player1.performAttack();
    else if (event.keyCode === 69) // e
        player1.performSpecialAttack();

    if (event.keyCode === 39) { // right arrow
        player2.pressingRight = true;
        player2.aimAngle = 0;
    }else if (event.keyCode === 40) { // down arrow
        player2.pressingDown = true;
        player2.aimAngle = 90;
    }else if (event.keyCode === 37) { // left arrow
        player2.pressingLeft = true;
        player2.aimAngle = 180;
    }else if (event.keyCode === 38) { // up arrow
        player2.pressingUp = true;
        player2.aimAngle = 270;
    }else if (event.keyCode === 48) // 0
        player2.performAttack();
    else if (event.keyCode === 57) // 9
        player2.performSpecialAttack();

    else if (event.keyCode === 80) //p
        paused = !paused;
}

document.onkeyup = function(event) {
    if (event.keyCode === 68) //d
        player1.pressingRight = false;
    else if (event.keyCode === 83) //s
        player1.pressingDown = false;
    else if (event.keyCode === 65) //a
        player1.pressingLeft = false;
    else if (event.keyCode === 87) // w
        player1.pressingUp = false;

    if (event.keyCode === 39) // right arrow
        player2.pressingRight = false;
    else if (event.keyCode === 40) // down arrow
        player2.pressingDown = false;
    else if (event.keyCode === 37) // left arrow
        player2.pressingLeft = false;
    else if (event.keyCode === 38) // up arrow
        player2.pressingUp = false;
}

function update() {
    if (paused) {
        ctx1.fillText('Paused', WIDTH / 2, HEIGHT / 2);
        ctx2.fillText('Paused', WIDTH / 2, HEIGHT / 2);
        return;
    }

    ctx1.clearRect(0, 0, WIDTH, HEIGHT);
    ctx2.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw the map and players on canvas 1 (Player 1's perspective)
    player1.update(ctx1);
    player2.update(ctx2);
    Maps.current.draw(ctx1, player1);
    player1.draw(ctx1);

    let p2_x_relative_to_p1 = player2.x - player1.x;
    let p2_y_relative_to_p1 = player2.y - player1.y;
    player2.drawAt(ctx1, p2_x_relative_to_p1, p2_y_relative_to_p1);

    localStorage.setItem('hpPlayer1',player1.hp);
    localStorage.setItem('scorePlayer1',scorePlayer1);

    // Draw the map and players on canvas 2 (Player 2's perspective)
    Maps.current.draw(ctx2, player2);
    player2.draw(ctx2);

    let p1_x_relative_to_p2 = player1.x - player2.x;
    let p1_y_relative_to_p2 = player1.y - player2.y;
    player1.drawAt(ctx2, p1_x_relative_to_p2, p1_y_relative_to_p2);


    localStorage.setItem('hpPlayer2',player2.hp);
    localStorage.setItem('scorePlayer2',scorePlayer2);

    frameCount++;
    scorePlayer1++;
    scorePlayer2++;

    Bullet.update(ctx1, ctx2, player1, player2);
    Upgrade.update(ctx1, player1);
    Upgrade.update(ctx2, player2);
    Enemy.update(ctx1, ctx2, player1, player2);

}

function startNewGame() {
    player1.hp = 10;
    player2.hp = 10;
    timeWhenGameStarted = Date.now();
    frameCount = 0;
    scorePlayer1 = 0;
    scorePlayer2 = 0;
    Enemy.list = {};
    Upgrade.list = {};
    Bullet.list = {};
    Enemy.randomlyGenerate();
    Enemy.randomlyGenerate();
    Enemy.randomlyGenerate();
}