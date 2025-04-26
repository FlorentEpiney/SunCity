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
    guard_white: new Image(),  
    guard_yellow: new Image(), 
    inspector: new Image(),    
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
Img.guard_white.src = '../../ressources/images/guard_white.png';
Img.guard_yellow.src = '../../ressources/images/guard_yellow.png';
Img.inspector.src = '../../ressources/images/inspector.png';
Img.bullet.src = '../../ressources/images/bullet.png';
Img.upgrade1.src = '../../ressources/images/upgrade1.png';
Img.upgrade2.src = '../../ressources/images/upgrade2.png';


// Adding custom metadata for sprite sheets

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
