
import SecurityUtils from './SecurityUtils.js';

export default function Leaderboard(){

    // Smart API path detection - works locally and on Vercel automatically
    const getApiPath = () => {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:3000';
        }
        // On Vercel, we use our single API endpoint
        return '/api';
    };

    let wallOfFame;
    let nbVictoriesPlayer1;
    let nbVictoriesPlayer2;

    const saveScoreRateLimit = SecurityUtils.createRateLimiter(5, 60000);
    const loadLeaderboardRateLimit = SecurityUtils.createRateLimiter(20, 60000);

    /*
     * Save score function - now much simpler!
     * We make one call to get current data, modify it, then save it back
     */
    const saveScore = function() {
        if (!saveScoreRateLimit()) {
            console.warn('Rate limit exceeded for score saving');
            showSecurityError('Too many requests. Please wait before submitting again.');
            return;
        }

        // Get player information (same validation as before)
        const player1Name = SecurityUtils.getSecureLocalStorage(
            'player1Name',
            'Player1',
            SecurityUtils.validatePlayerName
        );

        const scorePlayer1 = SecurityUtils.validateNumericValue(
            SecurityUtils.getSecureLocalStorage('player1Score', window.player1?.score || 0),
            0, 1000000
        );

        const player2Name = SecurityUtils.getSecureLocalStorage(
            'player2Name',
            'Player2',
            SecurityUtils.validatePlayerName
        );

        const scorePlayer2 = SecurityUtils.validateNumericValue(
            SecurityUtils.getSecureLocalStorage('player2Score', window.player2?.score || 0),
            0, 1000000
        );

        // Get current leaderboard data
        fetch(`${getApiPath()}/wall-of-fame`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                wallOfFame = SecurityUtils.validateApiResponse(data) || [];

                if (!Array.isArray(wallOfFame)) {
                    wallOfFame = [];
                }

                // Process both players (same logic as your original code)
                processPlayerScore(player1Name, scorePlayer1, window.winner === 1);
                processPlayerScore(player2Name, scorePlayer2, window.winner === 2);

                // Sort the leaderboard
                sortWallOfFame();

                // Send the updated data back to our API
                return fetch(`${getApiPath()}/wall-of-fame`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify(wallOfFame)
                });
            })
            .then(response => response.json())
            .then(result => {
                console.log('Score saved successfully:', result);
            })
            .catch(error => {
                console.error('Error saving score:', error);
                showSecurityError('Failed to save score. Please try again.');
            });
    };

    /*
     * Helper function to process individual player scores
     * This combines the logic from your updatePlayerScore and addNewPlayer functions
     */
    function processPlayerScore(playerName, score, didWin) {
        const safeName = SecurityUtils.validatePlayerName(playerName);
        const safeScore = SecurityUtils.validateNumericValue(score, 0, 1000000);

        // Find existing player
        let existingPlayer = wallOfFame.find(player => {
            const playerPseudo = SecurityUtils.sanitizeInput(player.pseudo || '');
            return playerPseudo === safeName;
        });

        if (existingPlayer) {
            // Update existing player
            existingPlayer.score = SecurityUtils.validateNumericValue(existingPlayer.score, 0, 1000000);
            existingPlayer.nbVictories = SecurityUtils.validateNumericValue(existingPlayer.nbVictories, 0, 10000);

            if (didWin) {
                // Only update score if it's higher than current
                if (safeScore > existingPlayer.score) {
                    existingPlayer.score = safeScore;
                }
                existingPlayer.nbVictories += 1;
            }
        } else {
            // Add new player
            wallOfFame.push({
                pseudo: safeName,
                score: safeScore,
                nbVictories: didWin ? 1 : 0
            });
        }
    }

    /*
     * Display the leaderboard - now extremely simple!
     */
    const displayWallOfFame = function() {
        if (!loadLeaderboardRateLimit()) {
            console.warn('Rate limit exceeded for leaderboard loading');
            showSecurityError('Too many requests. Please wait before loading leaderboard again.');
            return;
        }

        console.log('Loading leaderboard...');

        fetch(`${getApiPath()}/wall-of-fame`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                // Validate and sanitize the data
                wallOfFame = SecurityUtils.validateApiResponse(data) || [];

                if (!Array.isArray(wallOfFame)) {
                    wallOfFame = [];
                }

                // Clean up the data
                wallOfFame = wallOfFame.map(player => ({
                    pseudo: SecurityUtils.validatePlayerName(player.pseudo || 'Unknown'),
                    score: SecurityUtils.validateNumericValue(player.score, 0, 1000000),
                    nbVictories: SecurityUtils.validateNumericValue(player.nbVictories, 0, 10000)
                })).filter(player => player.pseudo !== 'Unknown');

                // Sort and display
                sortWallOfFame();
                createTable(wallOfFame);
            })
            .catch(error => {
                console.error('Error loading leaderboard:', error);
                const tableContainer = document.getElementById('wallOfFameTable');
                if (tableContainer) {
                    tableContainer.textContent = 'Connection problem with the server. Unable to display leaderboard.';
                }
            });
    };

    // All the helper functions remain exactly the same as your original code
    const sortWallOfFame = function() {
        wallOfFame.sort((a, b) => {
            const aScore = SecurityUtils.validateNumericValue(a.score, 0, 1000000);
            const bScore = SecurityUtils.validateNumericValue(b.score, 0, 1000000);
            const aVictories = SecurityUtils.validateNumericValue(a.nbVictories, 0, 10000);
            const bVictories = SecurityUtils.validateNumericValue(b.nbVictories, 0, 10000);

            if (bScore !== aScore) {
                return bScore - aScore;
            }
            return bVictories - aVictories;
        });
    };

    const createTable = function(data) {
        const tableContainer = document.getElementById('wallOfFameTable');

        if (!tableContainer) {
            console.error('Table container not found');
            return;
        }

        const table = document.createElement('table');
        table.setAttribute('border', '1');
        table.setAttribute('cellpadding', '10');
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        const headers = ['Rank', 'Player', 'Score', 'Victories'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        data.forEach((player, index) => {
            const row = document.createElement('tr');

            const rankCell = document.createElement('td');
            rankCell.textContent = (index + 1).toString();

            const nameCell = document.createElement('td');
            nameCell.textContent = player.pseudo;

            const scoreCell = document.createElement('td');
            scoreCell.textContent = player.score.toString();

            const victoriesCell = document.createElement('td');
            victoriesCell.textContent = player.nbVictories.toString();

            row.appendChild(rankCell);
            row.appendChild(nameCell);
            row.appendChild(scoreCell);
            row.appendChild(victoriesCell);

            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        tableContainer.innerHTML = '';
        tableContainer.appendChild(table);
    };

    const showSecurityError = function(message) {
        const errorPopup = document.createElement('div');
        errorPopup.textContent = SecurityUtils.sanitizeInput(message);

        Object.assign(errorPopup.style, {
            position: 'fixed',
            top: '90%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#ff4444',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            zIndex: '1000',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
        });

        document.body.appendChild(errorPopup);

        setTimeout(() => {
            if (errorPopup && errorPopup.parentNode) {
                errorPopup.parentNode.removeChild(errorPopup);
            }
        }, 5000);
    };

    return {
        saveScore,
        displayWallOfFame,
        createTable,
        sortWallOfFame
    };
}