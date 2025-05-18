import Entity from './Entity.js';
import Maps from './Maps.js';
import { Img } from './Managers/ImagesManager.js';
import {WIDTH, HEIGHT} from "./Game.js";


export default function Upgrade(id, x, y, width, height, category, img) {
    let self = Entity('upgrade', id, x, y, width, height, img);
    self.category = category;
    self.timer = 0; // Add timer property

    let super_update = self.update;
    self.update = function(ctx, player) {
        super_update(ctx, player);
        self.timer += 40; // update is called every 40ms
        if (self.timer >= 20000) { // Remove upgrade after 20 seconds
            self.toRemove = true;
        }

        self.x = self.x + WIDTH/2;
        self.y = self.y + HEIGHT/2;
        let isColliding = player.testCollision(self);
        self.x = self.x - WIDTH/2;
        self.y = self.y - HEIGHT/2;

        if (isColliding) {
            if (self.category === 'score') {
                player.score += 1000;
            }
            if (self.category === 'hp') {
                player.hp += 3;
            }
            if (self.category === 'atkSpeed') {
                player.atkSpd += 1;
            }
            self.toRemove = true; // Mark for removal when collected
        }
    };

    return self;
};

Upgrade.list = {};

Upgrade.update = function(ctx1, ctx2, player1, player2) {
    if (frameCount % 10 === 0) { // Generate a new upgrade every 10 frames
        Upgrade.randomlyGenerate();
    }

    for (let key in Upgrade.list) {
        let u = Upgrade.list[key];
        u.update(ctx1, player1);
        u.update(ctx2, player2);

        if (u.toRemove) {
            delete Upgrade.list[key];
        }
    }
};

Upgrade.randomlyGenerate = function() {
    let x = Math.random() * Maps.current.width;
    let y = Math.random() * Maps.current.height;
    let height = 32;
    let width = 32;
    let id = Math.random();

    let category, img;

    let upgradeType = Math.floor(Math.random() * 3); // 0-2
    switch (upgradeType) {
        case 0:
            // Score Upgrade
            category = 'score';
            img = Img.upgrade1; // Fallback to existing upgrade1 if scoreUpgrade doesn't exist
            break;
        case 1:
            // Health Upgrade
            category = 'hp';
            img = Img.upgrade2; // Fallback to existing upgrade2 if hpUpgrade doesn't exist
            break;
        case 2:
            // Attack Speed Upgrade
            category = 'atkSpeed';
            img = Img.upgrade3; // Fallback to upgrade1 if atkSpeedUpgrade doesn't exist
            break;
    }

    let upgrade = Upgrade(id, x, y, width, height, category, img);
    Upgrade.list[id] = upgrade;
};