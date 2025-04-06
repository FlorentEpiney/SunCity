Enemy = function(id, x, y, width, height, img, hp, atkSpd) {
    var self = Actor('enemy', id, x, y, width, height, img, hp, atkSpd);

    self.directionChangeTimer = 0;

    var super_update = self.update;
    self.update = function(ctx, player) {
        super_update(ctx, player);
        self.spriteAnimCounter += 0.2;
        self.updateAim();
        self.updateKeyPress();
        // self.performAttack(); //Enemies perform attack automatically
    };

    self.updateAim = function() {
        var diffX = player.x - self.x;
        var diffY = player.y - self.y;

        self.aimAngle = Math.atan2(diffY, diffX) / Math.PI * 180;
    };

    self.updateKeyPress = function() {
        // var diffX = player.x - self.x;
        // var diffY = player.y - self.y;
        // self.pressingRight = diffX > 3;
        // self.pressingLeft = diffX < -3;
        // self.pressingDown = diffY > 3;
        // self.pressingUp = diffY < -3;

        self.directionChangeTimer += 40; // Assuming update is called every 40ms

        if (self.directionChangeTimer >= 2000) {
            self.pressingRight = Math.random() < 0.5;
            self.pressingLeft = Math.random() < 0.5;
            self.pressingDown = Math.random() < 0.5;
            self.pressingUp = Math.random() < 0.5;
            self.directionChangeTimer = 0;
        }
    };

    // var super_draw = self.draw;
    self.draw = function(ctx, player) {
        ctx.save();
        var x = self.x - player.x + WIDTH / 2;
        var y = self.y - player.y + HEIGHT / 2 - self.height/2 -20;

        x -= self.width / 2;
        y -= self.height / 2;

        var frameWidth = self.img.width / 3;
        var frameHeight = self.img.height / 4;

        var walkingMod = Math.floor(self.spriteAnimCounter) % 3; // 1,2

        ctx.drawImage(self.img,
            walkingMod * frameWidth, 0, frameWidth, frameHeight,
            x, y, self.width, self.height
        );

        // Draw health bar
        var healthBarX = x;
        var healthBarY = y - 20;
        ctx.fillStyle = 'red';
        var width = 100 * self.hp / self.hpMax;
        if (width < 0) width = 0;
        ctx.fillRect(healthBarX - 50, healthBarY, width, 10);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(healthBarX - 50, healthBarY, 100, 10);

        ctx.restore();
    };

    self.onDeath = function() {
        self.toRemove = true;
    };

    return self;
};

Enemy.list = {};

Enemy.update = function(ctx1, ctx2, player1, player2) {
    if (frameCount % 100 === 0) // every 4 sec
        Enemy.randomlyGenerate();
    for (var key in Enemy.list) {
        Enemy.list[key].update(ctx1, player1);
        Enemy.list[key].update(ctx2, player2);
        Enemy.list[key].draw(ctx1, player1);
        Enemy.list[key].draw(ctx2, player2);
    }
    for (var key in Enemy.list) {
        if (Enemy.list[key].toRemove)
            delete Enemy.list[key];
    }
};

Enemy.randomlyGenerate = function() {
    var x = Math.random() * Maps.current.width;
    var y = Math.random() * Maps.current.height;
    var height = 64 * 1.5;
    var width = 64 * 1.5;
    var id = Math.random();
    if (Math.random() < 0.5)
        enemy = Enemy(id, x, y, width, height, Img.bat, 2, 1);
    else
        enemy = Enemy(id, x, y, width, height, Img.bee, 1, 3);
    Enemy.list[id] = enemy;
};