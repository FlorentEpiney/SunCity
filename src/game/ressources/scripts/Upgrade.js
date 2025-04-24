// Upgrade function
import Entity from './Entity.js';
import Maps from './Maps.js';  // Import Maps from Maps.js
import { Img } from './Managers/ImagesManager.js';  // Import Img properly


export default function Upgrade (id, x, y, width, height, category, img) {
    var self = Entity('upgrade', id, x, y, width, height, img);
    self.category = category;
    self.timer = 0; // Add timer property

    var super_update = self.update;
    self.update = function(ctx, player) {
        super_update(ctx, player);
        self.timer += 40; // Assuming update is called every 40ms
        if (self.timer >= 20000) { // Remove upgrade after 20 seconds
            self.toRemove = true;
        }
        this.x = this.x + 250;
        this.y = this.y + 250;
        var isColliding = player.testCollision(this);
        this.x = this.x - 250;
        this.y = this.y - 250;
        if (isColliding) {
            console.log('Collision detected with upgrade');
            if (this.category === 'score'){
                console.log('player.score before', player.score);
                player.score += 1000;
                console.log('player.score after', player.score);
            }
            if (this.category === 'atkSpd'){
                console.log('player.atkSpd before', player.atkSpd);
                player.atkSpd += 3;
                console.log('player.atkSpd after', player.atkSpd);
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

    for (var key in Upgrade.list) {
        var u = Upgrade.list[key];
        u.update(ctx1, player1);
        u.update(ctx2, player2);

        if (u.toRemove) {
            delete Upgrade.list[key];
        }
    }
};


Upgrade.randomlyGenerate = function() {
    var x = Math.random() * Maps.current.width;
    var y = Math.random() * Maps.current.height;
    var height = 32;
    var width = 32;
    var id = Math.random();

    var category, img;
    if (Math.random() < 0.5) {
        category = 'score';
        img = Img.upgrade1;
    } else {
        category = 'atkSpd';
        img = Img.upgrade2;
    }
    var upgrade = Upgrade(id, x, y, width, height, category, img);
    Upgrade.list[id] = upgrade;
};