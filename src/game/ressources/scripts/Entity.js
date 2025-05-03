// ressources/scripts/Entity.js
import { Img } from './Managers/ImagesManager.js';
import {WIDTH, HEIGHT} from "./Game.js";

function testCollisionRectRect(rect1, rect2) {
    return rect1.x <= rect2.x + rect2.width &&
        rect2.x <= rect1.x + rect1.width &&
        rect1.y <= rect2.y + rect2.height &&
        rect2.y <= rect1.y + rect1.height;
}

export default function Entity(type, id, x, y, width, height, img) {
    var self = {
        type: type,
        id: id,
        x: x,
        y: y,
        width: width,
        height: height,
        img: img,
    };

    self.update = function(ctx, player) {
        self.updatePosition();
        self.draw(ctx, player);
    };

    self.draw = function(ctx, player) {
        if (!ctx) {
            console.error('Context is undefined in draw method');
            return;
        }
        ctx.save();
        var x = self.x - player.x + WIDTH / 2;
        var y = self.y - player.y + HEIGHT / 2;

        x += WIDTH / 2;
        y += HEIGHT / 2;

        x -= self.width / 2;
        y -= self.height / 2;

        ctx.drawImage(self.img,
            0, 0, self.img.width, self.img.height,
            x, y, self.width, self.height
        );

        ctx.restore();
    };

    self.getDistance = function(entity2) {
        var vx = self.x - entity2.x;
        var vy = self.y - entity2.y;
        return Math.sqrt(vx * vx + vy * vy);
    };

    self.testCollision = function(entity2) {
        var rect1 = {
            x: self.x - self.width / 2,
            y: self.y - self.height / 2,
            width: self.width,
            height: self.height,
        };
        var rect2 = {
            x: entity2.x - entity2.width / 2,
            y: entity2.y - entity2.height / 2,
            width: entity2.width,
            height: entity2.height,
        };
        return testCollisionRectRect(rect1, rect2);
    };

    self.updatePosition = function() {};

    return self;
};