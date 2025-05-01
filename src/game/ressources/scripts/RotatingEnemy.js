// RotatingEnemy.js - This should be in ressources/scripts/
import Actor from './Actor.js';
import Maps from './Maps.js';
import RotatingEntityRenderer from './Managers/RotatingEntityRenderer.js';
import { Img } from './Managers/ImagesManager.js';
import Bullet from './Bullet.js';

/**
 * RotatingEnemy - An enemy that uses rotation instead of sprite animation
 * @param {string} id - Unique identifier for the enemy
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} width - Width of the enemy
 * @param {number} height - Height of the enemy
 * @param {Image} img - Image object for the alive enemy sprite
 * @param {number} hp - Health points
 * @param {number} atkSpd - Attack speed
 * @param {number} atkRange - Attack range (distance at which enemy can attack)
 * @returns {Object} - RotatingEnemy instance
 */
export default function RotatingEnemy(id, x, y, width, height, img, hp, atkSpd, atkRange) {
    
    // Create an actor as the base, but with 'rotatingEnemy' type
    const self = Actor('enemy', id, x, y, width, height, img, hp, atkSpd, '');
    
    // Track state (alive/dead) and rotation
    self.state = 'alive'; // Can be 'alive' or 'dead'
    self.aliveImg = img; // Store the alive image
    
    // Check if the dead image exists
    if (Img.rotatingEnemyDead) {
        self.deadImg = Img.rotatingEnemyDead; // Store the dead image
    } else {
        console.warn("Dead enemy image not found, using alive image");
        self.deadImg = img; // Fallback to the alive image
    }
    
    self.rotation = 0; // Rotation angle in degrees
    self.targetPlayer = null; // Store the target player reference
    self.lastMoveX = 0; // Track horizontal movement
    self.lastMoveY = 0; // Track vertical movement
    self.moveSpeed = 2; // Slightly slower than regular enemies
    
    // Attack properties
    self.attackCounter = 0;
    self.attackDistance = atkRange || 250; // Use provided attack range or default to 250
    self.attackRate = atkSpd || 1; // Default to 1 if not provided
    
    // Create specialized renderer for this enemy type
    self.renderer = new RotatingEntityRenderer();
    
    // Override the updatePosition method to prevent movement when dead
    const super_updatePosition = self.updatePosition;
    self.updatePosition = function() {
        // If the enemy is dead, don't update position
        if (self.state === 'dead') {
            // Stop all movement
            self.pressingRight = false;
            self.pressingLeft = false;
            self.pressingUp = false;
            self.pressingDown = false;
            
            // Change to dead image
            if (self.deadImg) {
                self.img = self.deadImg;
            }
            return; // Exit early without moving
        }
        super_updatePosition();
    };
    
    self.updateState = function(player) {
        // Store current position to calculate movement direction
        const oldX = self.x;
        const oldY = self.y;
        
        self.targetPlayer = player; // Store the player reference
        
        // Only update aim and pursue player if alive
        if (self.state === 'alive') {
            // Calculate direction to player
            self.updateAim();
            self.pursuePlayer();
        }
        
        // Update attack counter
        self.attackCounter += self.atkSpd;
        
        const distance = self.getDistanceToPlayer();
        if (distance < self.attackDistance) {
            self.performAttack();
        }

        // Update position if not dead
        self.updatePosition();
        
        // Calculate movement direction
        self.lastMoveX = self.x - oldX;
        self.lastMoveY = self.y - oldY;
        
        // Only update rotation if alive
        if (self.state === 'alive') {
            self.updateRotation();
        }
        
        // Update state if dead
        if (self.hp <= 0 && self.state === 'alive') {
            self.state = 'dead';
            // Switch to dead image
            self.img = self.deadImg;
            self.onDeath();
        }
    };

    // Override the default update method
    const super_update = self.update;
    self.update = function(ctx, player) {
        // Store current position to calculate movement direction
        const oldX = self.x;
        const oldY = self.y;
        
        self.targetPlayer = player; // Store the player reference
        
        // Only update aim, pursue player, and attack if alive
        if (self.state === 'alive') {
            // Calculate direction to player
            self.updateAim();
            
            // Update attack counter
            self.attackCounter += self.attackRate;
            
            // Check for attack conditions
            const distance = self.getDistanceToPlayer();
            if (distance < self.attackDistance) {
                self.performAttack();
            }
            
            // Pursue player
            self.pursuePlayer();
        }
        
        // Continue with standard update
        super_update(ctx, player);
        
        // Calculate movement direction
        self.lastMoveX = self.x - oldX;
        self.lastMoveY = self.y - oldY;
        
        // Only update rotation if alive
        if (self.state === 'alive') {
            self.updateRotation();
        }
        
        // Update state if dead
        if (self.hp <= 0 && self.state === 'alive') {
            self.state = 'dead';
            // Switch to dead image
            self.img = self.deadImg;
        }
    };

    /**
     * Attack the player by generating bullets
     */
    self.performAttack = function() {
        // Only attack if enough time has passed since last attack
        if (self.attackCounter > 60) { // Adjust this threshold to balance attack frequency
            self.attackCounter = 0;
            
            // Generate bullet using existing Bullet.generate function
            // The aim angle is already set in updateAim
            Bullet.generate(self);
        }
    };
    
    /**
     * Calculate distance to the target player
     * @returns {number} - Distance to player
     */
    self.getDistanceToPlayer = function() {
        if (!self.targetPlayer) return Infinity;
        
        const diffX = self.targetPlayer.x - self.x;
        const diffY = self.targetPlayer.y - self.y;
        return Math.sqrt(diffX * diffX + diffY * diffY);
    };

    /**
     * Update the aim angle towards the player
     */
    self.updateAim = function() {
        if (!self.targetPlayer) return;
        
        const diffX = self.targetPlayer.x - self.x;
        const diffY = self.targetPlayer.y - self.y;
        
        self.aimAngle = Math.atan2(diffY, diffX) / Math.PI * 180;
    };
    
    /**
     * Move towards the player
     */
    self.pursuePlayer = function() {
        if (!self.targetPlayer || self.hp <= 0) return;
        
        // Calculate direction to player
        const diffX = self.targetPlayer.x - self.x;
        const diffY = self.targetPlayer.y - self.y;
        
        // Normalize direction
        const distance = Math.sqrt(diffX * diffX + diffY * diffY);
        
        if (distance > 0) {
            const dirX = diffX / distance;
            const dirY = diffY / distance;
            
            // Move towards player
            self.pressingRight = dirX > 0;
            self.pressingLeft = dirX < 0;
            self.pressingDown = dirY > 0;
            self.pressingUp = dirY < 0;
            
            // If in attack range, reduce movement (optional)
            if (distance < self.attackDistance * 0.7) {
                // Reduce movement speed or introduce randomness to make the enemy circle the player
                if (Math.random() < 0.4) {
                    self.pressingRight = !self.pressingRight;
                    self.pressingLeft = !self.pressingLeft;
                    self.pressingUp = !self.pressingUp;
                    self.pressingDown = !self.pressingDown;
                }
            } else {
                // Add some randomness to movement (20% chance to move randomly)
                if (Math.random() < 0.2) {
                    self.pressingRight = Math.random() < 0.5;
                    self.pressingLeft = Math.random() < 0.5;
                    self.pressingDown = Math.random() < 0.5;
                    self.pressingUp = Math.random() < 0.5;
                }
            }
        }
    };
    
    /**
     * Update rotation based on movement direction
     */
    self.updateRotation = function() {
        if (self.hp <= 0) return; // Don't update rotation if dead
        
        // Calculate movement angle
        if (Math.abs(self.lastMoveX) > 0.1 || Math.abs(self.lastMoveY) > 0.1) {
            const moveAngle = Math.atan2(self.lastMoveY, self.lastMoveX) / Math.PI * 180;
            
            // Smooth rotation (interpolate between current and target rotation)
            const angleDiff = moveAngle - self.rotation;
            
            // Handle angle wrapping
            let delta = ((angleDiff + 180) % 360) - 180;
            if (delta < -180) delta += 360;
            
            // Apply smooth rotation
            self.rotation += delta * 0.1; // Adjust rotation speed here
            
            // Ensure rotation stays in 0-360 range
            self.rotation = (self.rotation + 360) % 360;
        }
    };
    
    /**
     * Override draw method to use the rotating renderer
     */
    self.draw = function(ctx, player) {
        self.renderer.draw(ctx, self, player);
    };
    
    /**
     * On death, set state to dead but don't remove immediately
     */
    self.onDeath = function() {
        self.state = 'dead';
        
        // Stop all movement immediately
        self.pressingRight = false;
        self.pressingLeft = false;
        self.pressingUp = false;
        self.pressingDown = false;
        
        // Change to dead image
        if (self.deadImg) {
            self.img = self.deadImg;
        }
        
        // Add a delay before removing the entity
        setTimeout(() => {
            self.toRemove = true;
        }, 5000); // 5 seconds delay to show the dead state
    };
    
    return self;
}