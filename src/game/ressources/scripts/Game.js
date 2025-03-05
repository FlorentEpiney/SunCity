var canvas1 = document.getElementById("player1Canvas");
var ctx1 = canvas1.getContext("2d");
var canvas2 = document.getElementById("player2Canvas");
var ctx2 = canvas2.getContext("2d");

ctx1.font = '30px Arial';
ctx1.mozImageSmoothingEnabled = false;
ctx1.msImageSmoothingEnabled = false;
ctx1.imageSmoothingEnabled = false;

ctx2.font = '30px Arial';
ctx2.mozImageSmoothingEnabled = false;
ctx2.msImageSmoothingEnabled = false;
ctx2.imageSmoothingEnabled = false;

var TILE_SIZE = 64 * 2;
var WIDTH = 500;
var HEIGHT = 500;
var timeWhenGameStarted = Date.now();
var frameCount = 0;
var score = 0;
var paused = false;

var Img = {};
Img.player = new Image();
Img.player.src = "ressources/images/player.png";
Img.bat = new Image();
Img.bat.src = 'ressources/images/bat.png';
Img.bee = new Image();
Img.bee.src = 'ressources/images/bee.png';
Img.bullet = new Image();
Img.bullet.src = 'ressources/images/bullet.png';
Img.upgrade1 = new Image();
Img.upgrade1.src = 'ressources/images/upgrade1.png';
Img.upgrade2 = new Image();
Img.upgrade2.src = 'ressources/images/upgrade2.png';

testCollisionRectRect = function(rect1, rect2) {
    return rect1.x <= rect2.x + rect2.width &&
        rect2.x <= rect1.x + rect1.width &&
        rect1.y <= rect2.y + rect2.height &&
        rect2.y <= rect1.y + rect1.height;
}

var player1;
var player2;
var player;

// Load the collision map data
fetch('gameData/collision_map.json')
    .then(response => response.json())
    .then(response => {
        var array = response;
        var array2D = [];
        for (var i = 0; i < 100; i++) {
            array2D[i] = [];
            for (var j = 0; j < 200; j++) {
                array2D[i][j] = array[i * 200 + j];
            }
        }
        Maps.current = Maps('field', 'ressources/images/suncity_map.png', array2D);

        player1 = Player(50, 50); // Starting position for player1
        player2 = Player(100, 50); // Starting position for player2
        player = player1;
        startNewGame();

        setInterval(update, 40);
    })
    .catch(error => {
        console.error('Error loading collision map:', error);
    });


document.onmousedown = function(mouse) {
    if (mouse.which === 1) {
        player1.pressingMouseLeft = true;
        player2.pressingMouseLeft = true;
    } else {
        player1.pressingMouseRight = true;
        player2.pressingMouseRight = true;
    }
}
document.onmouseup = function(mouse) {
    if (mouse.which === 1) {
        player1.pressingMouseLeft = false;
        player2.pressingMouseLeft = false;
    } else {
        player1.pressingMouseRight = false;
        player2.pressingMouseRight = false;
    }
}
document.oncontextmenu = function(mouse) {
    mouse.preventDefault();
}

document.onmousemove = function(mouse) {
    if (player1) {
        var mouseX = mouse.clientX - document.getElementById('player1Canvas').getBoundingClientRect().left;
        var mouseY = mouse.clientY - document.getElementById('player1Canvas').getBoundingClientRect().top;

        mouseX -= WIDTH / 2;
        mouseY -= HEIGHT / 2;

        player1.aimAngle = Math.atan2(mouseY, mouseX) / Math.PI * 180;
    }
    if(player2){
        mouseX = mouse.clientX - document.getElementById('player2Canvas').getBoundingClientRect().left;
        mouseY = mouse.clientY - document.getElementById('player2Canvas').getBoundingClientRect().top;

        mouseX -= WIDTH / 2;
        mouseY -= HEIGHT / 2;

        player2.aimAngle = Math.atan2(mouseY, mouseX) / Math.PI * 180;
    }

}

document.onkeydown = function(event) {
    if (event.keyCode === 68) //d
        player1.pressingRight = true;
    else if (event.keyCode === 83) //s
        player1.pressingDown = true;
    else if (event.keyCode === 65) //a
        player1.pressingLeft = true;
    else if (event.keyCode === 87) // w
        player1.pressingUp = true;

    if (event.keyCode === 39) //right arrow
        player2.pressingRight = true;
    else if (event.keyCode === 40) //down arrow
        player2.pressingDown = true;
    else if (event.keyCode === 37) //left arrow
        player2.pressingLeft = true;
    else if (event.keyCode === 38) //up arrow
        player2.pressingUp = true;

    else if (event.keyCode === 80) //p
        paused = !paused;
}

document.onkeyup = function(event) {
    if (event.keyCode === 68) //d
        player1.pressingRight = false;
    else if (event.keyCode === 83) //s
        player1.pressingDown = false;
    else if (event.keyCode === 65) //a
        player1.pressingLeft = false;
    else if (event.keyCode === 87) // w
        player1.pressingUp = false;

   if (event.keyCode === 54) // 6
        player2.pressingRight = false;
    else if (event.keyCode === 53) // 5
        player2.pressingDown = false;
    else if (event.keyCode === 52) // 4
        player2.pressingLeft = false;
    else if (event.keyCode === 56) // 8
        player2.pressingUp = false;
}

update = function() {
    if (paused) {
        ctx1.fillText('Paused', WIDTH / 2, HEIGHT / 2);
        ctx2.fillText('Paused', WIDTH / 2, HEIGHT / 2);
        return;
    }

    ctx1.clearRect(0, 0, WIDTH, HEIGHT);
    ctx2.clearRect(0, 0, WIDTH, HEIGHT);
    Maps.current.draw(ctx1, player1);
    Maps.current.draw(ctx2, player2);
    frameCount++;
    score++;


    Bullet.update(ctx1);
    Bullet.update(ctx2);
    Upgrade.update(ctx1);
    Upgrade.update(ctx2);
    Enemy.update(ctx1);
    Enemy.update(ctx2);

    player1.update(ctx1);
    player2.update(ctx2);

    ctx1.fillText(player1.hp + " Hp", 0, 30);
    ctx1.fillText('Score: ' + score, 200, 30);

    ctx2.fillText(player2.hp + " Hp", 0, 30);
    ctx2.fillText('Score: ' + score, 200, 30);
}

startNewGame = function() {
    player1.hp = 10;
    player2.hp = 10;
    timeWhenGameStarted = Date.now();
    frameCount = 0;
    score = 0;
    Enemy.list = {};
    Upgrade.list = {};
    Bullet.list = {};
    Enemy.randomlyGenerate();
    Enemy.randomlyGenerate();
    Enemy.randomlyGenerate();
}

Maps = function(id, imgSrc, grid) {
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