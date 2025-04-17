// ImagesManager.js

/**
 * ImagesManager.js
 * This module manages the loading and storing of images used in the game.
 * It creates an object containing all the images and their respective sources.
 */
export const Img = {
    player: [],
    bat: new Image(),
    bee: new Image(),
    bullet: new Image(),
    upgrade1: new Image(),
    upgrade2: new Image(),
};

// Assigning image sources
Img.player[0] = new Image();
Img.player[0].src = '../../ressources/images/player.png';
Img.player[1] = new Image();
Img.player[1].src = '../../ressources/images/player.png';
Img.bat.src = '../../ressources/images/bat.png';
Img.bee.src = '../../ressources/images/bee.png';
Img.bullet.src = '../../ressources/images/bullet.png';
Img.upgrade1.src = '../../ressources/images/upgrade1.png';
Img.upgrade2.src = '../../ressources/images/upgrade2.png';

// Adding custom metadata for sprite sheets
// For example, if the bat sprite sheet is organized in 2 rows and 3 columns:
Img.bat.rows = 4;
Img.bat.columns = 3;

// Similarly for the bee sprite sheet:
Img.bee.rows = 4;
Img.bee.columns = 3;