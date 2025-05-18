// GameLoop.js - A class to manage the game loop and enemy power scaling
import Maps from './Maps.js';
import Player from './Player.js';
import Enemy from './Enemy.js';
import Bullet from './Bullet.js';
import Upgrade from './Upgrade.js';
import Leaderboard from './Leaderboard.js';
import EnemyFactory from './Managers/EnemyFactory.js';

export default class GameLoop {
    /**
     * Creates a new GameLoop instance
     * @param {HTMLCanvasElement} canvas1 - First player's canvas
     * @param {HTMLCanvasElement} canvas2 - Second player's canvas
     * @param {Player} player1 - First player instance
     * @param {Player} player2 - Second player instance
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     */
    constructor(canvas1, canvas2, player1, player2, width, height) {
        // Canvas and context references
        this.canvas1 = canvas1;
        this.ctx1 = canvas1.getContext('2d');
        this.canvas2 = canvas2;
        this.ctx2 = canvas2.getContext('2d');

        // Canvas dimensions
        this.WIDTH = width;
        this.HEIGHT = height;

        // Player references
        this.player1 = player1;
        this.player2 = player2;

        // Game state
        this.frameCount = 0;
        this.timeWhenGameStarted = Date.now();
        this.paused = false;
        this.gameLoopInterval = null;
        this.winner = null;

        // Enemy difficulty scaling variables
        this.enemyScalingFactor = 1.0;
        this.difficultyLevel = 1;
        this.lastDifficultyIncreaseTime = Date.now();
        this.DIFFICULTY_INCREASE_INTERVAL = 30000; // 30 seconds

        // Bind methods to this instance
        this.update = this.update.bind(this);
        this.togglePause = this.togglePause.bind(this);
        this.startGameLoop = this.startGameLoop.bind(this);
        this.stopGameLoop = this.stopGameLoop.bind(this);
    }

    /**
     * Initialize and start the game loop
     */
    startGameLoop() {
        // Set initial game state
        this.resetGame();

        // Start the game loop
        this.gameLoopInterval = setInterval(this.update, 40); // 25 FPS
        console.log("Game loop started with enemy power scaling enabled");

        // Expose frameCount to window for compatibility with existing code
        window.frameCount = this.frameCount;
    }

    /**
     * Reset the game state
     */
    resetGame() {
        // Reset game state variables
        this.frameCount = 0;
        this.timeWhenGameStarted = Date.now();
        this.paused = false;
        this.winner = null;

        // Reset players
        this.player1.hp = 10;
        this.player1.score = 0;
        this.player2.hp = 10;
        this.player2.score = 0;

        // Reset difficulty scaling
        this.enemyScalingFactor = 1.0;
        this.difficultyLevel = 1;
        this.lastDifficultyIncreaseTime = Date.now();

        // Clear entity lists
        Enemy.list = {};
        Bullet.list = {};
        Upgrade.list = {};

        // Generate initial enemy
        EnemyFactory.randomlyGenerate(1.0);

        // Sync with window globals for compatibility
        window.timeWhenGameStarted = this.timeWhenGameStarted;
        window.frameCount = this.frameCount;
        window.paused = this.paused;
    }

    /**
     * Stop the game loop
     */
    stopGameLoop() {
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
            console.log("Game loop stopped");
        }
    }

    /**
     * Toggle pause state
     */
    togglePause() {
        this.paused = !this.paused;
        window.paused = this.paused;

        if (this.paused) {
            document.getElementById('pausePopup').style.display = 'flex';
        } else {
            document.getElementById('pausePopup').style.display = 'none';
        }
    }

    /**
     * Pause the game
     */
    pauseGame() {
        this.paused = true;
        window.paused = true;
        document.getElementById('pausePopup').style.display = 'flex';
    }

    /**
     * Resume the game
     */
    resumeGame() {
        this.paused = false;
        window.paused = false;
        document.getElementById('pausePopup').style.display = 'none';
    }

    /**
     * Update enemy difficulty based on time
     */
    updateEnemyDifficulty() {
        const currentTime = Date.now();

        // Check if it's time to increase difficulty (every 30 seconds)
        if (currentTime - this.lastDifficultyIncreaseTime >= this.DIFFICULTY_INCREASE_INTERVAL) {
            // Increase difficulty level
            this.difficultyLevel++;

            // Increase scaling factor - adjust this value to control difficulty progression
            this.enemyScalingFactor = 1.0 + (this.difficultyLevel - 1) * 0.1; // 10% increase per level

            // Reset timer
            this.lastDifficultyIncreaseTime = currentTime;

            // Make this scaling factor available globally
            window.enemyScalingFactor = this.enemyScalingFactor;

            console.log(`Difficulty increased to level ${this.difficultyLevel} (scaling: ${this.enemyScalingFactor.toFixed(2)}x)`);
        }
    }

    /**
     * Update UI elements with game state
     */
    updateUI() {
        // Calculate time until next difficulty increase
        const secondsUntilNextLevel = Math.ceil(
            (this.DIFFICULTY_INCREASE_INTERVAL - (Date.now() - this.lastDifficultyIncreaseTime)) / 1000
        );

        // Update player 1 UI
        document.getElementById("textarea-player1").innerHTML = `<b>HP: </b>${this.player1.hp}<br>
                <b>Score: </b>${this.player1.score}<br>
                <b>Enemy Level: </b>${this.difficultyLevel}<br>
                <b>Enemy Power: </b>${(this.enemyScalingFactor * 100).toFixed(0)}%<br>
                <b>Next Level: </b>${secondsUntilNextLevel}s<br><br>
                <b>Keyboard</b><br>w: up<br>s: down<br>a: left<br>d: right<br>q: shoot<br>e: special shoot`;

        // Update player 2 UI
        document.getElementById("textarea-player2").innerHTML = `<b>HP: </b>${this.player2.hp}<br>
                <b>Score: </b>${this.player2.score}<br>
                <b>Enemy Level: </b>${this.difficultyLevel}<br>
                <b>Enemy Power: </b>${(this.enemyScalingFactor * 100).toFixed(0)}%<br>
                <b>Next Level: </b>${secondsUntilNextLevel}s<br><br>
                <b>Keyboard</b><br>arrow: up<br>arrow: down<br>arrow: left<br>arrow: right<br>9: shoot<br>0: special shoot`;
    }

    /**
     * Handle game over state
     */
    handleGameOver() {
        // Stop the game loop
        this.stopGameLoop();

        if (this.player1.hp <= 0) {
            this.winner = 2;
            this.showGameOverScreen(2);
        } else {
            this.winner = 1;
            this.showGameOverScreen(1);
        }

        // Make winner available globally for leaderboard
        window.winner = this.winner;

        // Save score to leaderboard
        Leaderboard().saveScore();

        // Show end game popup after a delay
        setTimeout(() => {
            document.getElementById('endGamePopup').style.display = 'flex';
        }, 5000);
    }

    /**
     * Display game over screen
     * @param {number} winner - Winner index (1 or 2)
     */
    showGameOverScreen(winner) {
        if (winner === 2) {
            // Player 2 wins
            this.ctx1.fillStyle = 'rgba(255, 0, 0, 0.3)';
            this.ctx1.fillRect(2, 2, this.WIDTH - 4, this.HEIGHT - 4);
            this.ctx2.fillStyle = 'rgba(0, 255, 0, 0.3)';
            this.ctx2.fillRect(2, 2, this.WIDTH - 4, this.HEIGHT - 4);

            this.ctx1.font = 'bold 40px Arial';
            this.ctx1.fillStyle = 'black';
            this.ctx1.textAlign = 'center';
            this.ctx1.fillText('You Lose!', this.WIDTH / 2, this.HEIGHT / 2);

            this.ctx2.font = 'bold 40px Arial';
            this.ctx2.fillStyle = 'black';
            this.ctx2.textAlign = 'center';
            this.ctx2.fillText('You Win!', this.WIDTH / 2, this.HEIGHT / 2);
        } else {
            // Player 1 wins
            this.ctx2.fillStyle = 'rgba(255, 0, 0, 0.3)';
            this.ctx2.fillRect(2, 2, this.WIDTH - 4, this.HEIGHT - 4);
            this.ctx1.fillStyle = 'rgba(0, 255, 0, 0.3)';
            this.ctx1.fillRect(2, 2, this.WIDTH - 4, this.HEIGHT - 4);

            this.ctx2.font = 'bold 40px Arial';
            this.ctx2.fillStyle = 'black';
            this.ctx2.textAlign = 'center';
            this.ctx2.fillText('You Lose!', this.WIDTH / 2, this.HEIGHT / 2);

            this.ctx1.font = 'bold 40px Arial';
            this.ctx1.fillStyle = 'black';
            this.ctx1.textAlign = 'center';
            this.ctx1.fillText('You Win!', this.WIDTH / 2, this.HEIGHT / 2);
        }
    }

    /**
     * Main update function - called every frame
     */
    update() {
        // If paused, do nothing
        if (this.paused) return;

        // Increment frame counter
        this.frameCount++;
        window.frameCount = this.frameCount;

        // Update enemy difficulty scaling
        this.updateEnemyDifficulty();

        // Update UI elements
        this.updateUI();

        // Check for game over conditions
        if (this.player1.hp <= 0 || this.player2.hp <= 0) {
            this.handleGameOver();
            return;
        }

        // Clear canvases
        this.ctx1.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        this.ctx2.clearRect(0, 0, this.WIDTH, this.HEIGHT);

        // Update players
        this.player1.update(this.ctx1);
        this.player2.update(this.ctx2);

        // Draw the game state
        this.drawGameState();

        // Update scores
        this.player1.score++;
        this.player2.score++;

        // Update game entities
        Bullet.update(this.ctx1, this.ctx2, this.player1, this.player2);
        Upgrade.update(this.ctx1, this.ctx2, this.player1, this.player2);

        // Make sure the enemy scaling factor is available globally before updating enemies
        window.enemyScalingFactor = this.enemyScalingFactor;
        Enemy.update(this.ctx1, this.ctx2, this.player1, this.player2);
    }

    /**
     * Draw the game state on both canvases
     */
    drawGameState() {
        // Draw for player 1's view
        Maps.current.draw(this.ctx1, this.player1);
        this.player1.draw(this.ctx1);

        // Draw player 2 relative to player 1's view
        let p2_x_relative_to_p1 = this.player2.x - this.player1.x;
        let p2_y_relative_to_p1 = this.player2.y - this.player1.y;
        this.player2.drawAt(this.ctx1, p2_x_relative_to_p1, p2_y_relative_to_p1);

        // Draw for player 2's view
        Maps.current.draw(this.ctx2, this.player2);
        this.player2.draw(this.ctx2);

        // Draw player 1 relative to player 2's view
        let p1_x_relative_to_p2 = this.player1.x - this.player2.x;
        let p1_y_relative_to_p2 = this.player1.y - this.player2.y;
        this.player1.drawAt(this.ctx2, p1_x_relative_to_p2, p1_y_relative_to_p2);
    }
}