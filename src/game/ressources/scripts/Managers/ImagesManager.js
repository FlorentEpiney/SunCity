// ImagesManager.js
// Path: ressources/scripts/Managers/ImagesManager.js

/**
 * ImagesManager.js
 * This module manages the loading and storing of images used in the game.
 * It creates an object containing all the images and their respective sources.
 */
export const Img = {
    player: [],

    // bullets images
    bullet: new Image(),

    //upgrades images
    upgrade1: new Image(),
    upgrade2: new Image(),

    //enemy images
    handgunEnemy: new Image(),
    flameThrowerEnemy: new Image(),
    pumpgunEnemy: new Image(),
    knifeEnemy: new Image(),
    rotatingEnemyDead: new Image(), // New rotating enemy dead image
};

// Function to load an image with error handling
function loadImage(image, src, fallbackSrc = null) {
    image.onerror = function() {
        console.error(`Error loading image: ${src}`);
        if (fallbackSrc) {
            console.log(`Falling back to: ${fallbackSrc}`);
            image.src = fallbackSrc;
        }
    };
    
    image.onload = function() {
        console.log(`Image loaded successfully: ${src}`);
    };
    
    image.src = src;
}

// Assigning image sources with error handling
Img.player[0] = new Image();
loadImage(Img.player[0], '../../ressources/images/player-img/player_soldier.png');

Img.player[1] = new Image();
loadImage(Img.player[1], '../../ressources/images/player-img/player_hitman.png');


loadImage(Img.bullet, '../../ressources/images/bullet.png');


loadImage(Img.upgrade1, '../../ressources/images/upgrade1.png');
loadImage(Img.upgrade2, '../../ressources/images/upgrade2.png');



loadImage(Img.handgunEnemy, '../../ressources/images/enemy-img/enemy_9mmhandgun.png');

loadImage(Img.flameThrowerEnemy, '../../ressources/images/enemy-img/enemy_flamethrower.png');

loadImage(Img.pumpgunEnemy, '../../ressources/images/enemy-img/enemy_pumpgun.png');

loadImage(Img.knifeEnemy, '../../ressources/images/enemy-img/enemy_knife.gif');

loadImage(Img.rotatingEnemyDead, '../../ressources/images/enemy-img/rotating_enemy_dead.png');

// Adding custom metadata for sprite sheets
/**
Img.bat.rows = 4;
Img.bat.columns = 3;

Img.bee.rows = 4;
Img.bee.columns = 3;

Img.guard_white.rows = 4;
Img.guard_white.columns = 4;

Img.guard_yellow.rows = 4;
Img.guard_yellow.columns = 4;

Img.inspector.rows = 4;
Img.inspector.columns = 4;
*/
// Output loaded images to console for debugging
console.log("ImagesManager initialized with the following images:", Img);