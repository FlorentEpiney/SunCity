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

        // Initialize controller support
        this.initializeControllerSupport();

        // Bind methods to this instance
        this.update = this.update.bind(this);
        this.togglePause = this.togglePause.bind(this);
        this.startGameLoop = this.startGameLoop.bind(this);
        this.stopGameLoop = this.stopGameLoop.bind(this);
        this.pollGamepads = this.pollGamepads.bind(this);
        this.processControllerInput = this.processControllerInput.bind(this);
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

        // Create UI templates for both players
        const createPlayerUI = (player, controls) => `
        <div class="player-stats">
            <div class="stat-group">
                <div class="health-bar">
                    <div class="health-fill" style="width: ${(player.hp/10)*100}%"></div>
                    <span class="health-text">HP: ${player.hp}</span>
                </div>
                <div class="score-container">${player.score} pts</div>
            </div>
            
            <div class="enemy-info">
                <div class="enemy-level">
                    <span class="level-tag">LVL ${this.difficultyLevel}</span>
                    <span class="power-tag">${(this.enemyScalingFactor * 100).toFixed(0)}%</span>
                </div>
                <div class="level-timer-bar">
                    <div class="level-timer-fill" style="width: ${(secondsUntilNextLevel / 30) * 100}%"></div>
                </div>
            </div>
            
            <div class="controls-panel">
                ${controls}
            </div>
        </div>
    `;

        // Player-specific control layouts (more compact)
        const p1Controls = `
        <div class="key-group">
            <div class="key">W</div>
            <div class="key-row">
                <div class="key">A</div><div class="key">S</div><div class="key">D</div>
            </div>
        </div>
        <div class="action-keys">
            <div class="key action">Q</div><div class="key action">E</div>
        </div>
    `;

        const p2Controls = `
        <div class="key-group">
            <div class="key">↑</div>
            <div class="key-row">
                <div class="key">←</div><div class="key">↓</div><div class="key">→</div>
            </div>
        </div>
        <div class="action-keys">
            <div class="key action">9</div><div class="key action">0</div>
        </div>
    `;

        // Update player UIs
        document.getElementById("textarea-player1").innerHTML = createPlayerUI(this.player1, p1Controls);
        document.getElementById("textarea-player2").innerHTML = createPlayerUI(this.player2, p2Controls);
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

        // Poll gamepads for controller input
        this.pollGamepads();

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



    /**
     * Initialize controller support
     * This sets up event listeners for controllers being connected/disconnected
     */
    initializeControllerSupport() {
        // Store a reference to connected controllers
        this.controllers = {};

        // Flags to prevent button spamming for toggle actions
        this.p1BumperPressed = false;
        this.p2BumperPressed = false;

        // Listen for gamepad connections
        window.addEventListener("gamepadconnected", (e) => {
            console.log(`Controller connected: ${e.gamepad.id}`);
            this.controllers[e.gamepad.index] = e.gamepad;
        });

        // Listen for gamepad disconnections
        window.addEventListener("gamepaddisconnected", (e) => {
            console.log(`Controller disconnected: ${e.gamepad.id}`);
            delete this.controllers[e.gamepad.index];
        });
    }

    /**
     * Poll for gamepad updates and process inputs
     * This should be called every frame in the update loop
     */
    pollGamepads() {
        // Get the latest gamepad state
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];

        // Process each gamepad
        for (let i = 0; i < gamepads.length; i++) {
            const gamepad = gamepads[i];

            // Skip if no gamepad or not connected
            if (!gamepad) continue;

            // Determine which player this controller should control
            // First controller (index 0) controls player 1, second controls player 2
            const player = (i === 0) ? this.player1 : (i === 1) ? this.player2 : null;

            // Skip if we don't have a player for this controller
            if (!player) continue;

            // Process the controller input for this player
            this.processControllerInput(gamepad, player, i);
        }
    }

    /**
     * Process inputs from a controller for a specific player
     * @param {Gamepad} gamepad - The gamepad object from the Gamepad API
     * @param {Object} player - Player object (player1 or player2)
     * @param {number} controllerIndex - Index of the controller (0 for player 1, 1 for player 2)
     */
    processControllerInput(gamepad, player, controllerIndex) {
        // Xbox controller mapping (standard mapping)
        // Left stick movement (axes 0 and 1)
        const horizontalAxis = gamepad.axes[0]; // -1 (left) to 1 (right)
        const verticalAxis = gamepad.axes[1];   // -1 (up) to 1 (down)

        // Deadzone to prevent drift (only register movements beyond this threshold)
        const deadzone = 0.25;

        // Process horizontal movement
        if (horizontalAxis < -deadzone) {
            player.pressingLeft = true;
            player.pressingRight = false;
        } else if (horizontalAxis > deadzone) {
            player.pressingRight = true;
            player.pressingLeft = false;
        } else {
            // Within deadzone - no horizontal movement
            player.pressingLeft = false;
            player.pressingRight = false;
        }

        // Process vertical movement
        if (verticalAxis < -deadzone) {
            player.pressingUp = true;
            player.pressingDown = false;
        } else if (verticalAxis > deadzone) {
            player.pressingDown = true;
            player.pressingUp = false;
        } else {
            // Within deadzone - no vertical movement
            player.pressingUp = false;
            player.pressingDown = false;
        }

        // Process buttons (Xbox controller button mapping)

        // A button (index 0) - Regular attack
        if (gamepad.buttons[0].pressed) {
            player.performAttack();
        }

        // B button (index 1) - Special attack
        if (gamepad.buttons[1].pressed) {
            player.performSpecialAttack();
        }

        // Right bumper (index 5) - Toggle rotation mode
        // Use a flag to prevent repeated toggling while the button is held down
        if (controllerIndex === 0) {  // Player 1's controller
            if (gamepad.buttons[5].pressed && !this.p1BumperPressed) {
                player.toggleRotationMode();
                this.p1BumperPressed = true;
            } else if (!gamepad.buttons[5].pressed) {
                this.p1BumperPressed = false;
            }
        } else {  // Player 2's controller
            if (gamepad.buttons[5].pressed && !this.p2BumperPressed) {
                player.toggleRotationMode();
                this.p2BumperPressed = true;
            } else if (!gamepad.buttons[5].pressed) {
                this.p2BumperPressed = false;
            }
        }

        // Start button (index 9) - Pause/Resume game
        if (gamepad.buttons[9].pressed) {
            this.togglePause();
        }
    }


}