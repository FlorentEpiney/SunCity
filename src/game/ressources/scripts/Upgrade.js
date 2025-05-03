// Upgrade function
import Entity from './Entity.js';
import Maps from './Maps.js';  // Import Maps from Maps.js
import { Img } from './Managers/ImagesManager.js';  // Import Img properly
import {WIDTH, HEIGHT} from "./Game.js";


export default function Upgrade (id, x, y, width, height, category, img) {
    let self = Entity('upgrade', id, x, y, width, height, img);
    self.category = category;
    self.timer = 0; // Add timer property

    let super_update = self.update;
    self.update = function(ctx, player) {
        super_update(ctx, player);
        self.timer += 40; // Assuming update is called every 40ms
        if (self.timer >= 20000) { // Remove upgrade after 20 seconds
            self.toRemove = true;
        }
        this.x = this.x + WIDTH/2;
        this.y = this.y + HEIGHT/2;
        let isColliding = player.testCollision(this);
        this.x = this.x - WIDTH/2;
        this.y = this.y - HEIGHT/2;
        if (isColliding) {
            if (this.category === 'score'){
                player.score += 1000;
            }
            if (this.category === 'hp'){
                player.hp += 3;
            }
            this.toRemove = true;
        }
    };

    return self;
};

Upgrade.list = {};

Upgrade.update = function(ctx1, ctx2, player1, player2) {

    if (frameCount % 10 === 0) { //every 3 sec. 75;
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
    if (Math.random() < 0.5) {
        category = 'score';
        img = Img.upgrade1;
    } else {
        category = 'hp';
        img = Img.upgrade2;
    }
    let upgrade = Upgrade(id, x, y, width, height, category, img);
    Upgrade.list[id] = upgrade;
};