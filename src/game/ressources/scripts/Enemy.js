import EntityRenderer from './Managers/EntityRenderer.js';
import Maps from './Maps.js';
import { Img } from './Managers/ImagesManager.js'; 
import Actor from './Actor.js';

export default function Enemy(id, x, y, width, height, img, hp, atkSpd) {
    var self = Actor('enemy', id, x, y, width, height, img, hp, atkSpd);

    self.directionChangeTimer = 0;
    self.spriteAnimCounter = 0;
    self.targetPlayer = null; // Store the target player reference

    /**
     * Renderer for drawing the enemy
     * Creates an instance of EntityRenderer with the sprite configuration
     * 
     * @type {EntityRenderer}
     */
    self.renderer = new EntityRenderer({
        frameCount: 3,
        frameWidth: img.width / 3,
        frameHeight: img.height / 4
    });

    /**
     * Update method for the enemy
     * self.update is called every frame
     * self.updateAim is called to update the aim angle
     * self.updateKeyPress is called to update the enemy's movement direction
     * self.performAttack is called to perform the attack
     */
    var super_update = self.update;
    self.update = function(ctx, player) {
        self.targetPlayer = player; // Store the player reference for use in other methods
        super_update(ctx, player);
        self.spriteAnimCounter += 0.2;
        self.updateAim();
        self.updateKeyPress();
        //self.performAttack(); // Enemies perform attack automatically
    };

    self.updateAim = function() {
        // Use the stored player reference instead of a global player
        if (!self.targetPlayer) return;
        
        var diffX = self.targetPlayer.x - self.x;
        var diffY = self.targetPlayer.y - self.y;

        self.aimAngle = Math.atan2(diffY, diffX) / Math.PI * 180;
    };

    self.updateKeyPress = function() {
        // Randomly change direction every 2 seconds
        self.directionChangeTimer += 40; // Assuming update is called every 40ms

        if (self.directionChangeTimer >= 2000) {
            self.pressingRight = Math.random() < 0.5;
            self.pressingLeft = Math.random() < 0.5;
            self.pressingDown = Math.random() < 0.5;
            self.pressingUp = Math.random() < 0.5;
            self.directionChangeTimer = 0;
        }
    };

    /**
     * Call the draw method of the EntityRenderer
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {Entity} player - The player entity
     */
    self.draw = function(ctx, player) {
        self.renderer.draw(ctx, self, player);
    };

    self.onDeath = function() {
        self.toRemove = true;
    };

    return self;
};

Enemy.list = {};

Enemy.update = function(ctx1, ctx2, player1, player2) {
    if (window.frameCount % 100 === 0) { // every 4 sec
        Enemy.randomlyGenerate();
    }

    for (var key in Enemy.list) {
        Enemy.list[key].update(ctx1, player1);
        Enemy.list[key].update(ctx2, player2);
        Enemy.list[key].draw(ctx1, player1);
        Enemy.list[key].draw(ctx2, player2);
    }

    for (var key in Enemy.list) {
        if (Enemy.list[key].toRemove) {
            delete Enemy.list[key];
        }
    }
};

Enemy.randomlyGenerate = function() {
    var x = Math.random() * Maps.current.width;
    var y = Math.random() * Maps.current.height;
    var height = 64 * 1.5;
    var width = 64 * 1.5;
    var id = Math.random();
    var enemy; // Declare the variable first
    
    if (Math.random() < 0.5) {
        enemy = Enemy(id, x, y, width, height, Img.bat, 2, 1);
    } else {
        enemy = Enemy(id, x, y, width, height, Img.bee, 1, 3);
    }
    
    Enemy.list[id] = enemy;
};
