// Player.js with dedicated rotation mode toggle
import { Img } from './Managers/ImagesManager.js';
import RotatingEntityRenderer from './Managers/RotatingEntityRenderer.js';
import Actor from './Actor.js';

export default function Player(startX, startY, name, img) {
    var self = Actor('player', 'myId', startX, startY, 64, 64, img, 10, 1, name);
    
    // Initialize rotating renderer
    self.renderer = new RotatingEntityRenderer();
    
    // Set initial state and rotation
    self.state = 'alive';
    self.rotation = 0;
    self.maxMoveSpd = 10 * 5;
    self.pressingMouseLeft = false;
    self.pressingMouseRight = false;
    
    // Rotation mode properties
    self.rotationMode = false;
    self.rotationModeTimer = 0;
    self.ROTATION_MODE_DURATION = 60; 
    
    // Visual indicator for rotation mode
    self.rotationModeIndicator = {
        active: false,
        alpha: 0.7,
        color: 'rgba(255, 255, 0, 0.7)' // Yellow glow
    };
    
    // Variables to track movement for rotation calculation
    self.lastMoveX = 0;
    self.lastMoveY = 0;
    
    // Store original methods before overriding
    var originalUpdatePosition = self.updatePosition;
    
    // Override updatePosition to handle rotation mode
    self.updatePosition = function() {
        if (self.rotationMode) {
            // In rotation mode, don't update position
            return;
        }
        // Call the original method when not in rotation mode
        originalUpdatePosition.call(self);
    };
    
    var super_update = self.update;
    self.update = function(ctx) {
        // Store previous position to calculate movement direction
        const oldX = self.x;
        const oldY = self.y;
        
        // Handle rotation mode timer if it's active and not toggled on permanently
        if (self.rotationMode && self.rotationModeTimer > 0) {
            self.rotationModeTimer--;
            if (self.rotationModeTimer <= 0 && !self.rotationModeToggled) {
                self.rotationMode = false;
                self.rotationModeIndicator.active = false;
            }
        }
        
        // Call parent update - updatePosition is now handled with our override
        super_update(ctx, self);
        
        // Calculate actual movement that occurred
        self.lastMoveX = self.x - oldX;
        self.lastMoveY = self.y - oldY;
        
        // Update direction and aim angle based on key presses
        self.updateDirectionFromKeys();
        
        // Animation counter update - even in rotation mode to show "turning" animation
        if (self.pressingRight || self.pressingLeft || self.pressingDown || self.pressingUp)
            self.spriteAnimCounter += 0.2;
            
        // Handle attacks
        if (self.pressingMouseLeft)
            self.performAttack();
        if (self.pressingMouseRight)
            self.performSpecialAttack();
    };
    
    // New method to update direction and rotation based on key presses
    self.updateDirectionFromKeys = function() {
        // If any directional key is pressed, update rotation and aimAngle
        if (self.pressingRight) {
            self.rotation = 0;
            self.aimAngle = 0;
        } else if (self.pressingDown) {
            self.rotation = 90;
            self.aimAngle = 90;
        } else if (self.pressingLeft) {
            self.rotation = 180;
            self.aimAngle = 180;
        } else if (self.pressingUp) {
            self.rotation = 270;
            self.aimAngle = 270;
        }
        
        // Handle diagonal directions
        if (self.pressingRight && self.pressingUp) {
            self.rotation = 315;
            self.aimAngle = 315;
        } else if (self.pressingRight && self.pressingDown) {
            self.rotation = 45;
            self.aimAngle = 45;
        } else if (self.pressingLeft && self.pressingDown) {
            self.rotation = 135;
            self.aimAngle = 135;
        } else if (self.pressingLeft && self.pressingUp) {
            self.rotation = 225;
            self.aimAngle = 225;
        }
    };
    
    // Toggle rotation mode on/off
    self.toggleRotationMode = function() {
        self.rotationMode = !self.rotationMode;
        self.rotationModeIndicator.active = self.rotationMode;
        
        // If turning on rotation mode, reset the timer
        if (self.rotationMode) {
            self.rotationModeTimer = self.ROTATION_MODE_DURATION;
        }
        
        // Visual feedback that rotation mode changed
        console.log("Rotation mode " + (self.rotationMode ? "enabled" : "disabled"));
    };
    
    // Original attack methods
    var originalPerformAttack = self.performAttack;
    var originalPerformSpecialAttack = self.performSpecialAttack;
    
    // Override attack methods to enable temporary rotation mode
    self.performAttack = function() {
        // Enable temporary rotation mode when attacking
        if (!self.rotationMode) {
            self.rotationMode = true;
            self.rotationModeTimer = 15; // Short duration, about 0.6 seconds
            self.rotationModeIndicator.active = true;
        }
        
        // Call the original attack method
        originalPerformAttack.call(self);
    };
    
    self.performSpecialAttack = function() {
        // Enable temporary rotation mode when special attacking
        if (!self.rotationMode) {
            self.rotationMode = true;
            self.rotationModeTimer = 15; // Short duration
            self.rotationModeIndicator.active = true;
        }
        
        // Call the original special attack method
        originalPerformSpecialAttack.call(self);
    };

    // Override the draw method to use the rotating renderer and show rotation mode indicator
    self.draw = function(ctx) {
        // Draw rotation mode indicator if active
        if (self.rotationModeIndicator.active) {
            ctx.save();
            // Center of the screen
            var x = WIDTH / 2;
            var y = HEIGHT / 2;
            
            // Draw a semi-transparent circle around the player
            ctx.globalAlpha = self.rotationModeIndicator.alpha;
            ctx.fillStyle = self.rotationModeIndicator.color;
            ctx.beginPath();
            ctx.arc(x, y, self.width/1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
            ctx.restore();
        }
        
        // Draw the player with rotation
        self.renderer.draw(ctx, self, self);
    };
    
    // Override the drawAt method for player-to-player rendering
    self.drawAt = function(ctx, x, y) {
        // Create a temporary entity with adjusted position
        var tempEntity = {
            ...self,
            x: self.x + x,
            y: self.y + y
        };
        
        // Use the renderer to draw at the specific position
        self.renderer.draw(ctx, tempEntity, self);
    };
    
    // Add a custom drawName method to handle player names
    self.drawName = function(ctx, x, y) {
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(self.name, x, y);
    };

    // Override onDeath to update state
    self.onDeath = function() {
        self.state = 'dead';  // Update state for the renderer
        var timeSurvived = Date.now() - timeWhenGameStarted;
        console.log("You lost! You survived for " + timeSurvived + " ms.");
        startNewGame();
    };

    return self;
};