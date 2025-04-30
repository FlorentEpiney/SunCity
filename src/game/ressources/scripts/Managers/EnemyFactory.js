// EnemyFactory.js - Located in ressources/scripts/Managers/
import Enemy from '../Enemy.js';
import { Img } from './ImagesManager.js';
import Maps from '../Maps.js';
import RotatingEnemy from '../RotatingEnemy.js';

/**
 * EnemyFactory - Creates different types of enemies
 * This factory allows for easy creation of different enemy types
 * 
 */
export default class EnemyFactory {
    /**
     * Creates a standard enemy using the existing implementation
     * @param {string} id - Unique identifier for the enemy
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width of the enemy
     * @param {number} height - Height of the enemy
     * @param {Image} img - Image object for the enemy sprite
     * @param {number} hp - Health points
     * @param {number} atkSpd - Attack speed
     * @returns {Object} - Enemy instance
     */
    static createStandardEnemy(id, x, y, width, height, img, hp, atkSpd) {
        return Enemy(id, x, y, width, height, img, hp, atkSpd);
    }

    /**
     * Creates a rotating enemy using the new implementation
     * @param {string} id - Unique identifier for the enemy
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {Image} aliveImg - Image object for the alive enemy sprite
     * @param {number} hp - Health points
     * @param {number} atkSpd - Attack speed
     * @param {number} atkRange - Attack range (distance at which enemy can attack)
     * @returns {Object} - RotatingEnemy instance
     */
    static createRotatingEnemy(id, x, y, aliveImg, hp, atkSpd, atkRange) {
        const width = 96;
        const height = 96;
        return RotatingEnemy(id, x, y, width, height, aliveImg, hp, atkSpd, atkRange);
    }

   /**
     * Randomly generates an enemy at a random position
     * This method creates one of four enemy types: Handgun, Flamethrower, Pumpgun, or Knife
     * @returns {Object} - Enemy instance
     */
   static randomlyGenerate() {
    console.log("EnemyFactory.randomlyGenerate called");
    
    // Check if Maps.current exists to prevent errors
    if (!Maps.current) {
        console.error("Maps.current is undefined in EnemyFactory");
        return null;
    }
    
    const x = Math.random() * Maps.current.width;
    const y = Math.random() * Maps.current.height;
    const id = Math.random();
    let enemy;
    
    // Determine which enemy type to create
    const enemyType = Math.floor(Math.random() * 4); // 0-3
    
    switch (enemyType) {
        case 0:
            // Handgun Enemy
            console.log("Creating HandgunEnemy");
            enemy = EnemyFactory.createRotatingEnemy(id, x, y, Img.handgunEnemy, 5, 1, 200);
            break;
        case 1:
            // Flamethrower Enemy
            console.log("Creating FlameThrowerEnemy");
            enemy = EnemyFactory.createRotatingEnemy(id, x, y, Img.flameThrowerEnemy, 20, 0.5, 100);
            break;
        case 2:
            // Pumpgun Enemy (Using RotatingEnemy implementation)
            console.log("Creating PumpgunEnemy");
            enemy = EnemyFactory.createRotatingEnemy(id, x, y, Img.pumpgunEnemy, 12, 1.5, 150);
            break;
        case 3:
            // Knife Enemy (Using standard enemy implementation)
            console.log("Creating KnifeEnemy");
            enemy = EnemyFactory.createRotatingEnemy(id, x, y, Img.knifeEnemy, 8, 2, 100);
            enemy.maxMoveSpd = 4; // Knife enemies move faster
            break;
    }

     //enemy = EnemyFactory.createRotatingEnemy(id, x, y, Img.rotatingEnemy, 8, 2);
    
    // Add to the existing enemy list to maintain compatibility
    Enemy.list[id] = enemy;
    
    return enemy;
    }
}