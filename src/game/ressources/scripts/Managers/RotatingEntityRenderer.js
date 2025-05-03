// RotatingEntityRenderer.js - Improved to handle health bars properly
// Path: ressources/scripts/Managers/RotatingEntityRenderer.js
import {WIDTH, HEIGHT} from "../Game.js";

/**
 * RotatingEntityRenderer - Renders entities with rotation
 * This renderer is specifically designed for enemies that use rotation for movement
 * and have separate images for alive and dead states
 */
export default class RotatingEntityRenderer {
    constructor() {
        // No configuration needed for now
    }
    
    /**
     * Draw the entity on the canvas with rotation
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {Object} entity - The entity to render
     * @param {Object} player - The player for position reference
     */
    draw(ctx, entity, player) {
        if (!ctx || !entity || !player) return;
        
        ctx.save();
        
        // Calculate position relative to the player's view
        let x = entity.x - player.x + WIDTH / 2;
        let y = entity.y - player.y + HEIGHT / 2;
        
        // Define the center point for rotation
        const centerX = x;
        const centerY = y;
        
        // Move to the center point
        ctx.translate(centerX, centerY);
        
        // Only apply rotation if the entity is alive
        if (entity.state === 'alive') {
            ctx.rotate(entity.rotation * Math.PI / 180);
        }
        
        // Check if image is loaded
        if (!entity.img || !entity.img.complete) {
            console.warn("Image not loaded for entity", entity.id);
            // Draw a placeholder rectangle
            ctx.fillStyle = entity.state === 'alive' ? 'purple' : 'gray';
            ctx.fillRect(-entity.width / 2, -entity.height / 2, entity.width, entity.height);
        } else {
            // Draw the entity with the appropriate image
            try {
                const frameWidth = entity.img.width;
                const frameHeight = entity.img.height;
                
                ctx.drawImage(
                    entity.img,
                    0, 0, // Source coordinates (using full image)
                    frameWidth, frameHeight, // Source dimensions
                    -entity.width / 2, -entity.height / 2, // Destination coordinates (centered)
                    entity.width, entity.height // Destination dimensions
                );
            } catch (e) {
                console.error("Error drawing entity", entity.id, e);
                // Draw a fallback rectangle
                ctx.fillStyle = entity.state === 'alive' ? 'purple' : 'gray';
                ctx.fillRect(-entity.width / 2, -entity.height / 2, entity.width, entity.height);
            }
        }
        
        // Reset transformation
        ctx.resetTransform();

        // Display player name above the entity
        if(entity.type == 'player') {
            drawName(ctx, x, y, entity, entity.name);
        }

        // Draw health bar if entity is alive
        if (entity.state === 'alive') {
            this.drawHealthBar(ctx, x - entity.width / 2, y - entity.height / 2 - 20, entity);
        }
        
        ctx.restore();
    }
    
    /**
     * Draw a health bar above the entity
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} x - X position of the entity
     * @param {number} y - Y position of the entity
     * @param {Object} entity - The entity with health properties
     */
    drawHealthBar(ctx, x, y, entity) {
        const healthBarX = x;
        const healthBarY = y - 10;
        const barWidth = entity.width;
        
        // Red background for empty health
        ctx.fillStyle = '#FF3333';
        ctx.fillRect(healthBarX, healthBarY, barWidth, 5);
        
        // Green foreground for current health
        ctx.fillStyle = '#33FF33';
        let entityHP = entity.hp;
        if(entityHP > entity.hpMax) entityHP = entity.hpMax;    //The green bar should not exceed the bar width
        const healthWidth = barWidth * (entityHP / entity.hpMax);
        ctx.fillRect(healthBarX, healthBarY, healthWidth, 5);
        
        // Black border
        ctx.strokeStyle = 'black';
        ctx.strokeRect(healthBarX, healthBarY, barWidth, 5);
    }
}


function drawName(ctx, x, y, entity, name) {
    const nameX = x ;
    const nameY = y - entity.height / 2;

    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(name, nameX, nameY);
}