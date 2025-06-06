// ressources/scripts/Actor.js
import Entity from './Entity.js';
import Maps from './Maps.js';
import Bullet from './Bullet.js';


export default function Actor(type, id, x, y, width, height, img, hp, atkSpd, name) {
    let self = Entity(type, id, x, y, width, height, img);

    self.hp = hp;
    self.hpMax = hp;
    self.atkSpd = atkSpd;
    self.attackCounter = 0;
    self.aimAngle = 0;
    self.name = name;

    self.spriteAnimCounter = 0;

    self.pressingDown = false;
    self.pressingUp = false;
    self.pressingLeft = false;
    self.pressingRight = false;
    self.maxMoveSpd = 3;

    self.draw = function(ctx) {
        ctx.save();
        let x = self.x - self.x;
        let y = self.y - self.y;

        x += WIDTH / 2;
        y += HEIGHT / 2;

        x -= self.width / 2;
        y -= self.height / 2;

        let frameWidth = self.img.width / 3;
        let frameHeight = self.img.height / 4;

        let aimAngle = self.aimAngle;
        if (aimAngle < 0)
            aimAngle = 360 + aimAngle;

        let directionMod = 3; // draw right
        if (aimAngle >= 45 && aimAngle < 135) // down
            directionMod = 2;
        else if (aimAngle >= 135 && aimAngle < 225) // left
            directionMod = 1;
        else if (aimAngle >= 225 && aimAngle < 315) // up
            directionMod = 0;

        let walkingMod = Math.floor(self.spriteAnimCounter) % 3; // 1,2

        ctx.drawImage(self.img,
            walkingMod * frameWidth, directionMod * frameHeight, frameWidth, frameHeight,
            x, y, self.width, self.height
        );

        if(type == 'player') {
            drawName(ctx, x, y,self, name);
        }
        ctx.restore();
    };

    self.drawAt = function(ctx, x, y) {
        ctx.save();

        x += WIDTH / 2;
        y += HEIGHT / 2;

        x -= self.width / 2;
        y -= self.height / 2;

        let frameWidth = self.img.width / 3;
        let frameHeight = self.img.height / 4;

        let aimAngle = self.aimAngle;
        if (aimAngle < 0)
            aimAngle = 360 + aimAngle;

        let directionMod = 3; // draw right
        if (aimAngle >= 45 && aimAngle < 135) // down
            directionMod = 2;
        else if (aimAngle >= 135 && aimAngle < 225) // left
            directionMod = 1;
        else if (aimAngle >= 225 && aimAngle < 315) // up
            directionMod = 0;

        let walkingMod = Math.floor(self.spriteAnimCounter) % 3; // 1,2

        ctx.drawImage(self.img,
            walkingMod * frameWidth, directionMod * frameHeight, frameWidth, frameHeight,
            x, y, self.width, self.height
        );
        if(type == 'player') {
            drawName(ctx, x, y,self, name);
        }

        ctx.restore();
    };


    self.updatePosition = function() {
        let leftBumper = { x: self.x - 40, y: self.y };
        let rightBumper = { x: self.x + 40, y: self.y };
        let upBumper = { x: self.x, y: self.y - 16 };
        let downBumper = { x: self.x, y: self.y + 64 };

        if (Maps.current.isPositionWall(rightBumper)) {
            self.x -= 5;
        } else {
            if (self.pressingRight)
                self.x += self.maxMoveSpd;
        }

        if (Maps.current.isPositionWall(leftBumper)) {
            self.x += 5;
        } else {
            if (self.pressingLeft)
                self.x -= self.maxMoveSpd;
        }
        if (Maps.current.isPositionWall(downBumper)) {
            self.y -= 5;
        } else {
            if (self.pressingDown)
                self.y += self.maxMoveSpd;
        }
        if (Maps.current.isPositionWall(upBumper)) {
            self.y += 5;
        } else {
            if (self.pressingUp)
                self.y -= self.maxMoveSpd;
        }

        // ispositionvalid
        if (self.x < self.width / 2)
            self.x = self.width / 2;
        if (self.x > Maps.current.width - self.width / 2)
            self.x = Maps.current.width - self.width / 2;
        if (self.y < self.height / 2)
            self.y = self.height / 2;
        if (self.y > Maps.current.height - self.height / 2)
            self.y = Maps.current.height - self.height / 2;
    };

    let super_update = self.update;
    self.update = function(ctx, player) {
        super_update(ctx, player);

        // Only increment attack counter if the actor is alive
        if (self.hp > 0) {
            self.attackCounter += self.atkSpd;
        }

        if (self.hp <= 0)
            self.onDeath();
    };

    self.onDeath = function() {};

    self.performAttack = function() {
        if (self.attackCounter > 25) { // every 1 sec
            self.attackCounter = 0;
            Bullet.generate(self);
        }
    };

    self.performSpecialAttack = function() {
        if (self.attackCounter > 50) { // every 1 sec
            self.attackCounter = 0;
            Bullet.generate(self, self.aimAngle - 5);
            Bullet.generate(self, self.aimAngle);
            Bullet.generate(self, self.aimAngle + 5);
        }
    };

    function drawName(ctx, x, y, entity, name) {
        const nameX = x + entity.width / 2;
        const nameY = y;

        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(name, nameX, nameY);
    }

    return self;

}

