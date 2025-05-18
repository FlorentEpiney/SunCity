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
    upgrade3: new Image(),

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
            image.src = fallbackSrc;
        }
    };
    
    image.onload = function() {
    };
    
    image.src = src;
}
/** Preload Player images */
// Preload player sprites
Img.player[0] = new Image();
loadImage(Img.player[0], '../../ressources/images/player-img/player_soldier.png');

Img.player[1] = new Image();
loadImage(Img.player[1], '../../ressources/images/player-img/player_hitman.png');

Img.player[2] = new Image();
loadImage(Img.player[2], '../../ressources/images/player-img/player_survivor.png');

Img.player[3] = new Image();
loadImage(Img.player[3], '../../ressources/images/player-img/player_woman.png');

// Ensure images exist at correct indices in case player1Img/player2Img are read before load
const fallbackPaths = [
    '../../ressources/images/player-img/player_soldier.png',
    '../../ressources/images/player-img/player_hitman.png',
    '../../ressources/images/player-img/player_survivor.png',
    '../../ressources/images/player-img/player_woman.png'
];

for (let i = 0; i < 4; i++) {
    if (!Img.player[i]) {
        Img.player[i] = new Image();
        loadImage(Img.player[i], fallbackPaths[i]);
    }
}


/** Preload bullet image */
loadImage(Img.bullet, '../../ressources/images/bullet/Bullet.png');

/** Preload upgrade images */
loadImage(Img.upgrade1, '../../ressources/images/upgrades/upgrade1.png');
loadImage(Img.upgrade2, '../../ressources/images/upgrades/upgrade2.png');
loadImage(Img.upgrade3, '../../ressources/images/upgrades/upgrade3.png');


/** Preload enemy images */
loadImage(Img.handgunEnemy, '../../ressources/images/enemy-img/enemy_9mmhandgun.png');

loadImage(Img.flameThrowerEnemy, '../../ressources/images/enemy-img/enemy_flamethrower.png');

loadImage(Img.pumpgunEnemy, '../../ressources/images/enemy-img/enemy_pumpgun.png');

loadImage(Img.knifeEnemy, '../../ressources/images/enemy-img/enemy_knife.gif');

loadImage(Img.rotatingEnemyDead, '../../ressources/images/enemy-img/rotating_enemy_dead.png');


