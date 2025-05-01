// In src/game/resources/scripts/Managers/EntityRenderer.js

/**
 * * EntityRenderer.js
 * * This module is responsible for rendering entities on the canvas.
 * * It handles the drawing of entities, including their health bars and animations.
 */
export default class EntityRenderer {
    constructor(spriteConfig) {
        this.spriteConfig = spriteConfig;
    }

    /**
     * * Draws the entity on the canvas.
     * * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * * @param {Entity} entity - The entity object to be drawn
     * * @param {Entity} player - The player entity, used to adjust the position
     */
    draw(ctx, entity, player) {
        ctx.save();

        let x = entity.x - player.x + WIDTH / 2;
        let y = entity.y - player.y + HEIGHT / 2 - entity.height / 2 - 20;
        x -= entity.width / 2;
        y -= entity.height / 2;

        const { frameCount, frameWidth, frameHeight } = this.spriteConfig;
        
         // Default to row 0 if not provided
        const row = entity.spriteRow || 0;
        
        const walkingMod = Math.floor(entity.spriteAnimCounter) % frameCount;

        ctx.drawImage(
            entity.img,
            walkingMod * frameWidth, row*frameHeight, // assuming first row for walking animation
            frameWidth, frameHeight,
            x, y, entity.width, entity.height
        );

        this.drawHealthBar(ctx, x, y, entity);
        ctx.restore();
    }

    /**
     * * Draws the health bar above the entity
     * * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * * @param {number} x - The x coordinate of the entity
     * * @param {number} y - The y coordinate of the entity
     * * @param {Entity} entity - The entity object containing health information
     */
    drawHealthBar(ctx, x, y, entity) {
        const healthBarX = x;
        const healthBarY = y - 20;

        // Red fill for health bar
        ctx.fillStyle = 'red';
        let healthWidth = 100 * entity.hp / entity.hpMax;

        if (healthWidth < 0) healthWidth = 0;

        ctx.fillRect(healthBarX - 50, healthBarY, healthWidth, 10);

        // Black border for health bar
        ctx.strokeStyle = 'black';
        ctx.strokeRect(healthBarX - 50, healthBarY, 100, 10);
    }
}


