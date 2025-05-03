import Entity from './Entity.js';
import { Img } from './Managers/ImagesManager.js'; 
import Maps from './Maps.js';
import Enemy from './Enemy.js'; // Import Enemy to check for collisions
import {WIDTH, HEIGHT} from "./Game.js";

export default function Bullet (id, x, y, spdX, spdY, width, height, combatType, ownerId) {
    let self = Entity('bullet', id, x, y, width, height, Img.bullet);
    self.timer = 0;
    self.combatType = combatType;
    self.ownerId = ownerId;
    self.spdX = spdX;
    self.spdY = spdY;
    self.toRemove = false;

    let super_update = self.update;
    self.update = function(ctx, player) {
        self.updatePosition();
        super_update(ctx, player);
        self.timer++;
        if (self.timer > 75) // Increase this value to make bullets last longer
            self.toRemove = true;

        if (self.combatType === 'player') { // bullet was shot by player
            for (let key2 in Enemy.list) {
                let enemy = Enemy.list[key2];
                
                // Only check collision with living enemies
                // Skip collision detection for dead enemies or specifically for rotating enemies in 'dead' state
                if ((enemy.state === 'dead') || (enemy.hp <= 0)) {
                    continue; // Skip this enemy
                }
                
                if (self.testCollision(enemy)) {
                    self.toRemove = true;
                    enemy.hp -= 1;
                }
            }
                if (self.testCollision(player)) {
                    if(self.ownerId !== player.id){
                        self.toRemove = true;
                        player.hp -= 1;
                    }
                }

        } else if (self.combatType === 'enemy') {
            if (self.testCollision(player)) {
                self.toRemove = true;
                player.hp -= 1;
            }
        }
        if (Maps.current.isPositionWall(self)) {
            self.toRemove = true;
        }
    };

    self.updatePosition = function() {
        self.x += self.spdX;
        self.y += self.spdY;

        if (self.x < 0 || self.x > Maps.current.width) {
            self.spdX = -self.spdX;
        }
        if (self.y < 0 || self.y > Maps.current.height) {
            self.spdY = -self.spdY;
        }
    };

    self.draw = function(ctx, player) {
        ctx.save();
        let x = self.x - player.x + WIDTH / 2;
        let y = self.y - player.y + HEIGHT / 2;

        x -= self.width / 2;
        y -= self.height / 2;

        ctx.drawImage(self.img,
            0, 0, self.img.width, self.img.height,
            x, y, self.width, self.height
        );

        ctx.restore();
    };

    Bullet.list[id] = self;
};

Bullet.list = {};

Bullet.update = function(ctx1, ctx2, player1, player2) {
    for (let key in Bullet.list) {
        let b = Bullet.list[key];
        b.update(ctx1, player1);
        b.update(ctx2, player2);
        b.draw(ctx1, player1);
        b.draw(ctx2, player2);

        if (b.toRemove) {
            delete Bullet.list[key];
        }
    }
};

Bullet.generate = function(actor, aimOverwrite) {
    let x = actor.x;
    let y = actor.y;
    let height = 24;
    let width = 24;
    let id = Math.random();

    let angle;
    if (aimOverwrite !== undefined)
        angle = aimOverwrite;
    else angle = actor.aimAngle;

    let spdX = Math.cos(angle / 180 * Math.PI) * 5;
    let spdY = Math.sin(angle / 180 * Math.PI) * 5;
    Bullet(id, x, y, spdX, spdY, width, height, actor.type, actor.id);
};