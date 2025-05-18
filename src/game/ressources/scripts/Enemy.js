
import Maps from './Maps.js';
import { Img } from './Managers/ImagesManager.js'; 
import Actor from './Actor.js';
import EnemyFactory from './Managers/EnemyFactory.js';


export default function Enemy(id, x, y, width, height, img, hp, atkSpd) {
    let self = Actor('enemy', id, x, y, width, height, img, hp, atkSpd,'');

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
     * Update method for the enemy
     * self.update is called every frame
     * self.updateAim is called to update the aim angle
     * self.updateKeyPress is called to update the enemy's movement direction
     * self.performAttack is called to perform the attack
     */
    let super_update = self.update;
    self.update = function(ctx, player) {
        // Store current position to calculate movement direction
        const oldX = self.x;
        const oldY = self.y;

        self.targetPlayer = player; // Store the player reference for use in other methods
        super_update(ctx, player);
        self.spriteAnimCounter += 0.2;
        
        self.updateAim();
        self.pursuePlayer();
        //self.performAttack(); // Enemies perform attack automatically
        
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
        let diffX = self.targetPlayer.x - self.x;
        let diffY = self.targetPlayer.y - self.y;
        
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
        
        let diffX = self.targetPlayer.x - self.x;
        let diffY = self.targetPlayer.y - self.y;

        self.aimAngle = Math.atan2(diffY, diffX) / Math.PI * 180;
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

// Modify the Enemy.update function in Enemy.js to prevent duplicate drawing
Enemy.update = function(ctx1, ctx2, player1, player2) {
    // Get the current enemy scaling factor from the window object (set by GameLoop)
    const scalingFactor = window.enemyScalingFactor || 1.0;

    if (window.frameCount % 100 === 0) { // every 4 sec
        // Check if EnemyFactory exists, otherwise use the original method
        if (typeof EnemyFactory !== 'undefined') {
            EnemyFactory.randomlyGenerate(scalingFactor);
        } else {
            // Fallback to original method
            Enemy.randomlyGenerate();
        }
    }

    // First update all enemies
    for (let key in Enemy.list) {
        // Only update the state, don't draw during update
        const enemy = Enemy.list[key];
        
        // Store current position for motion calculation before updating
        const oldX = enemy.x;
        const oldY = enemy.y;
        
        // Calculate distance to both players
        const distToPlayer1 = calculateDistance(enemy, player1);
        const distToPlayer2 = calculateDistance(enemy, player2);
        
        // Choose closest player as target
        const targetPlayer = distToPlayer1 <= distToPlayer2 ? player1 : player2;

        // Only call the base update logic without drawing
        if (enemy.updateState) {
            // If enemy has a dedicated updateState method, use it
            enemy.updateState(targetPlayer);
        } else {
            // Otherwise, manage state update manually
            enemy.targetPlayer = targetPlayer;
            
            // Handle aiming and movement updates
            if (enemy.state !== 'dead' && enemy.hp > 0) {
                enemy.updateAim();
                enemy.pursuePlayer();
            }
            
            // Update standard properties
            enemy.attackCounter += enemy.atkSpd;
            if (enemy.hp <= 0 && enemy.state !== 'dead') {
                enemy.state = 'dead';
                enemy.onDeath();
            }
            
            // Update position if not dead
            if (enemy.state !== 'dead') {
                enemy.updatePosition();
            }
            
            // Calculate movement direction for rotation
            enemy.lastMoveX = enemy.x - oldX;
            enemy.lastMoveY = enemy.y - oldY;
            
            // Update rotation if applicable
            if (enemy.updateRotation && enemy.state === 'alive') {
                enemy.updateRotation();
            }
            
            // Update sprite direction if applicable
            if (enemy.updateSpriteDirection) {
                enemy.updateSpriteDirection();
            }
        }
    }
    
    // Then draw all enemies separately for each canvas
    for (let key in Enemy.list) {
        Enemy.list[key].draw(ctx1, player1);
    }
    
    for (let key in Enemy.list) {
        Enemy.list[key].draw(ctx2, player2);
    }

    // Clean up dead enemies
    for (let key in Enemy.list) {
        if (Enemy.list[key].toRemove) {
            delete Enemy.list[key];
        }
    }
};

function calculateDistance(entity1, entity2) {
    const dx = entity1.x - entity2.x;
    const dy = entity1.y - entity2.y;
    return Math.sqrt(dx * dx + dy * dy);
}


