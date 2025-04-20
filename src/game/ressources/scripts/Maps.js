export default function Maps (id, imgSrc, grid) {
    const TILE_SIZE = 64; // set your tile size here


    var self = {
        id: id,
        image: new Image(),
        width: grid[0].length * TILE_SIZE,
        height: grid.length * TILE_SIZE,
        grid: grid,
    }
    self.image.src = imgSrc;

    self.isPositionWall = function(pt) {
        var gridX = Math.floor(pt.x / TILE_SIZE);
        var gridY = Math.floor(pt.y / TILE_SIZE);
        if (gridX < 0 || gridX >= self.grid[0].length)
            return true;
        if (gridY < 0 || gridY >= self.grid.length)
            return true;
        return self.grid[gridY][gridX];
    }

    self.draw = function(ctx, player) {
        var x = WIDTH / 2 - player.x;
        var y = HEIGHT / 2 - player.y;
        ctx.drawImage(self.image, 0, 0, self.image.width, self.image.height, x, y, self.image.width * 2, self.image.height * 2);
    }
    return self;
}