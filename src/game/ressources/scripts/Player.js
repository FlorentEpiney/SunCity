import { Img } from './Managers/ImagesManager.js';
import EntityRenderer from './Managers/EntityRenderer.js';
import Actor  from './Actor.js';

export default function Player(startX, startY, name, img) {
    var self = Actor('player', 'myId', startX, startY, 50 * 1.5, 70 * 1.5, img, 10, 1);
    self.maxMoveSpd = 10 * 5;
    self.pressingMouseLeft = false;
    self.pressingMouseRight = false;

    var super_update = self.update;
    self.update = function(ctx) {
        self.updatePosition();
        super_update(ctx, self);
        if (self.pressingRight || self.pressingLeft || self.pressingDown || self.pressingUp)
            self.spriteAnimCounter += 0.2;
        if (self.pressingMouseLeft)
            self.performAttack();
        if (self.pressingMouseRight)
            self.performSpecialAttack();
    };

    var super_draw = self.draw;
    self.draw = function(ctx) {
        super_draw(ctx);
    };


    self.onDeath = function() {
        var timeSurvived = Date.now() - timeWhenGameStarted;
        console.log("You lost! You survived for " + timeSurvived + " ms.");
        startNewGame();
    };

    return self;
};