import {WIDTH, HEIGHT} from "./Game.js";

export default function Maps (id, imgSrc, grid) {
    const TILE_SIZE = 64; // set your tile size here


    let self = {
        id: id,
        image: new Image(),
        width: grid[0].length * TILE_SIZE,
        height: grid.length * TILE_SIZE,
        grid: grid,
    }
    self.image.src = imgSrc;

    self.isPositionWall = function(pt) {
        let gridX = Math.floor(pt.x / TILE_SIZE);
        let gridY = Math.floor(pt.y / TILE_SIZE);
        if (gridX < 0 || gridX >= self.grid[0].length)
            return true;
        if (gridY < 0 || gridY >= self.grid.length)
            return true;
        return self.grid[gridY][gridX];
    }

    self.draw = function(ctx, player) {
        let x = WIDTH / 2 - player.x;
        let y = HEIGHT / 2 - player.y;
        ctx.drawImage(self.image, 0, 0, self.image.width, self.image.height, x, y, self.image.width * 2, self.image.height * 2);
    }
    return self;
}