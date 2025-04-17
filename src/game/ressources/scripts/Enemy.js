import EntityRenderer from './Managers/EntityRenderer.js';
import Maps from './Maps.js';
import { Img } from './Managers/ImagesManager.js'; 
import Actor from './Actor.js';

export default function Enemy(id, x, y, width, height, img, hp, atkSpd) {
    var self = Actor('enemy', id, x, y, width, height, img, hp, atkSpd,'');

    self.directionChangeTimer = 0;
    self.spriteAnimCounter = 0;
    self.targetPlayer = null; // Store the target player reference
    self.spriteRow = 0; // Default animation row (down)
    self.lastMoveX = 0; // Track horizontal movement
    self.lastMoveY = 0; // Track vertical movement

    // Calculate sprite configuration using custom properties stored in the image
    // Providing fallback defaults if properties are missing:
    const columns = img.columns || 3; // Fallback to 3 columns if not defined
    const rows = img.rows || 4;       // Fallback to 4 rows if not defined
    /**
     * Renderer for drawing the enemy
     * Creates an instance of EntityRenderer with the sprite configuration
     * 
     * @type {EntityRenderer}
     */
    self.renderer = new EntityRenderer({
        frameCount: columns,
        frameWidth: img.width / columns,
        frameHeight: img.height / rows
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
        // Store current position to calculate movement direction
        const oldX = self.x;
        const oldY = self.y;

        self.targetPlayer = player; // Store the player reference for use in other methods
        super_update(ctx, player);
        self.spriteAnimCounter += 0.2;
        
        self.updateAim();
        self.pursuePlayer();
        self.performAttack(); // Enemies perform attack automatically
        
        // Calculate movement direction
        self.lastMoveX = self.x - oldX;
        self.lastMoveY = self.y - oldY;
        
        // Update sprite row based on movement direction
        self.updateSpriteDirection();

    };
    /**
     * 
     * Pursue the player by setting the movement direction
     * 
     */
    self.pursuePlayer = function() {
        if (!self.targetPlayer) return;
        
        // Calculate direction to player
        var diffX = self.targetPlayer.x - self.x;
        var diffY = self.targetPlayer.y - self.y;
        
        // Determine movement direction based on player position
        self.pressingRight = diffX > 0;
        self.pressingLeft = diffX < 0;
        self.pressingDown = diffY > 0;
        self.pressingUp = diffY < 0;
        
        // Add randomness to movement to make it less predictable
        if (Math.random() < 0.1) { // 10% chance to move randomly
            self.pressingRight = Math.random() < 0.5;
            self.pressingLeft = Math.random() < 0.5;
            self.pressingDown = Math.random() < 0.5;
            self.pressingUp = Math.random() < 0.5;
        }
    };

    /**
     * Updates the sprite direction based on movement
     * Sets the appropriate row in the sprite sheet based on the direction
     * Assuming typical sprite sheet layout:
     * Row 0 = Down/South
     * Row 1 = Left/West
     * Row 2 = Right/East
     * Row 3 = Up/North
     */
    self.updateSpriteDirection = function() {
        // Determine the dominant direction of movement
        const absX = Math.abs(self.lastMoveX);
        const absY = Math.abs(self.lastMoveY);
        
        // Only update direction if there's significant movement
        if (absX > 0.1 || absY > 0.1) {
            if (absX > absY) {
                // Horizontal movement is stronger
                if (self.lastMoveX > 0) {
                    self.spriteRow = 2; // Right-facing row (East)
                } else {
                    self.spriteRow = 1; // Left-facing row (West)
                }
            } else {
                // Vertical movement is stronger
                if (self.lastMoveY > 0) {
                    self.spriteRow = 0; // Down-facing row (South)
                } else {
                    self.spriteRow = 3; // Up-facing row (North)
                }
            }
        }
        // If not moving significantly, keep the current direction
    };

    self.updateAim = function() {
        // Use the stored player reference instead of a global player
        if (!self.targetPlayer) return;
        
        var diffX = self.targetPlayer.x - self.x;
        var diffY = self.targetPlayer.y - self.y;

        self.aimAngle = Math.atan2(diffY, diffX) / Math.PI * 180;
    };

    self.updateKeyPress = function() {
        /*
        // Randomly change direction every 2 seconds
        self.directionChangeTimer += 40; // Assuming update is called every 40ms

        if (self.directionChangeTimer >= 20d00) {
            self.pressingRight = Math.random() < 0.5;
            self.pressingLeft = Math.random() < 0.5;
            self.pressingDown = Math.random() < 0.5;
            self.pressingUp = Math.random() < 0.5;
            self.directionChangeTimer = 0;
        }
            */
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
        enemy = Enemy(id, x, y, width, height, Img.bat, 10, 1);
    } else {
        enemy = Enemy(id, x, y, width, height, Img.bee, 5, 3);
    }
    
    Enemy.list[id] = enemy;
};
