// Upgrade function
Upgrade = function(id, x, y, width, height, category, img) {
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
    };

    return self;
};

Upgrade.list = {};

Upgrade.update = function(ctx, player) {
    if (frameCount % 75 === 0) // every 3 sec
        Upgrade.randomlyGenerate();
    for (var key in Upgrade.list) {
        Upgrade.list[key].update(ctx, player);
        var isColliding = player.testCollision(Upgrade.list[key]);
        if (isColliding) {
            if (Upgrade.list[key].category === 'score')
                score += 1000;
            if (Upgrade.list[key].category === 'atkSpd')
                player.atkSpd += 3;
            delete Upgrade.list[key];
        }
        if (Upgrade.list[key] && Upgrade.list[key].toRemove)
            delete Upgrade.list[key];
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