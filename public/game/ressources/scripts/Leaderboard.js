import SecurityUtils from './SecurityUtils.js';

export default function Leaderboard(){

    const path = 'http://localhost:3000/wall-of-fame';
    let wallOfFame;
    let nbVictoriesPlayer1;
    let nbVictoriesPlayer2;

    const saveScoreRateLimit = SecurityUtils.createRateLimiter(5, 60000); // 5 calls per minute
    const loadLeaderboardRateLimit = SecurityUtils.createRateLimiter(20, 60000); // 20 calls per minute


    /*This function uses the localStorage to store the data into the wallOfFame.json
    * with 3 inputs: pseudo, score and if he wins the party or not.
     */
    const saveScore = function() {
        // Get data from localStorage
        if (!saveScoreRateLimit()) {
            console.warn('Rate limit exceeded for score saving');
            showSecurityError('Too many requests. Please wait before submitting again.');
            return;
        }
        // Using SecurityUtils to safely retrieve and validate the data
        const player1Name = SecurityUtils.getSecureLocalStorage(
            'player1Name',
            'Player1',
            SecurityUtils.validatePlayerName  // This ensures the name is safe
        );

        // Validate the score to prevent manipulation - scores should be reasonable numbers
        const scorePlayer1 = SecurityUtils.validateNumericValue(
            SecurityUtils.getSecureLocalStorage('player1Score', player1?.score || 0),
            0, 1000000  // Min 0, max 1 million points
        );

        const player2Name = SecurityUtils.getSecureLocalStorage(
            'player2Name',
            'Player2',
            SecurityUtils.validatePlayerName
        );

        const scorePlayer2 = SecurityUtils.validateNumericValue(
            SecurityUtils.getSecureLocalStorage('player2Score', player2?.score || 0),
            0, 1000000
        );


        // Get existing data
        fetch(path)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                // Validate the API response data to prevent injection through server compromise
                wallOfFame = SecurityUtils.validateApiResponse(data) || [];

                // Make sure wallOfFame is an array (defensive programming)
                if (!Array.isArray(wallOfFame)) {
                    wallOfFame = [];
                }

                // Find existing victories
                wallOfFame.map(player => {
                    // Sanitize the pseudo before comparison to prevent injection
                    const safePseudo = SecurityUtils.sanitizeInput(player.pseudo || '');
                    if (safePseudo === player1Name) {
                        nbVictoriesPlayer1 = SecurityUtils.validateNumericValue(player.nbVictories, 0, 10000);
                    }
                    if (safePseudo === player2Name) {
                        nbVictoriesPlayer2 = SecurityUtils.validateNumericValue(player.nbVictories, 0, 10000);
                    }
                })

                // Check if player1 already exists
                let playerExists = wallOfFame.some(player => {
                    const safePseudo = SecurityUtils.sanitizeInput(player.pseudo || '');
                    return safePseudo === player1Name;
                });

                if (playerExists) {
                    // Update existing player
                    if(winner === 1)
                        updatePlayerScore(player1Name, scorePlayer1, true, nbVictoriesPlayer1);
                    else
                        updatePlayerScore(player1Name, scorePlayer1, false, nbVictoriesPlayer1);
                } else {
                    // Add new player
                    if(winner === 1)
                        addNewPlayer(player1Name, scorePlayer1, true);
                    else
                        addNewPlayer(player1Name, scorePlayer1, false);
                }

                /// Check if player2 already exists
                playerExists = wallOfFame.some(player => {
                    const safePseudo = SecurityUtils.sanitizeInput(player.pseudo || '');
                    return safePseudo === player2Name;
                });

                if (playerExists) {
                    // Update existing player
                    if(winner === 2)
                        updatePlayerScore(player2Name, scorePlayer2, true, nbVictoriesPlayer2);
                    else
                        updatePlayerScore(player2Name, scorePlayer2, false, nbVictoriesPlayer2);
                } else {
                    // Add new player
                    if(winner === 2)
                        addNewPlayer(player2Name, scorePlayer2, true);
                    else
                        addNewPlayer(player2Name, scorePlayer2, false);
                }
            })
            .catch(error => {
                console.error('Error loading the JSON file:', error);
                // Show error message
                showSecurityError('Connection problem with the server. Score not saved.');
            });
    };

    /*This function updates the score and the win if the pseudo already exists in the wallOfFame.json
     */
    const updatePlayerScore = function(pseudo, score, win, nbVictories) {

        const safePseudo = SecurityUtils.validatePlayerName(pseudo);
        const safeScore = SecurityUtils.validateNumericValue(score, 0, 1000000);
        const safeNbVictories = SecurityUtils.validateNumericValue(nbVictories, 0, 10000);

        wallOfFame = wallOfFame.map(player => {
            const playerPseudo = SecurityUtils.sanitizeInput(player.pseudo || '');

            if (playerPseudo === safePseudo) {
                // Validate existing player data before updating
                player.score = SecurityUtils.validateNumericValue(player.score, 0, 1000000);
                player.nbVictories = SecurityUtils.validateNumericValue(player.nbVictories, 0, 10000);

                // If the score is higher, update it
                if (win) {
                    if (score > player.score){
                        player.score = score;
                    }
                    player.nbVictories = nbVictories + 1;
                }
            }
            return player;
        });

        // Sort the wallOfFame after updating
        sortWallOfFame();

        fetch('http://localhost:3000/update-wall-of-fame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(wallOfFame.map(player => ({
                pseudo: SecurityUtils.sanitizeInput(player.pseudo || ''),
                score: SecurityUtils.validateNumericValue(player.score, 0, 1000000),
                nbVictories: SecurityUtils.validateNumericValue(player.nbVictories, 0, 10000)
            })))
        })
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => {
                console.error('Error sending data:', error);
                showSecurityError('Failed to update leaderboard. Please try again.');
            });
    };

    /*This function adds a new player into the wallOfFame.json if he doesn't exist yet
     */
    const addNewPlayer = function(pseudo, score, win) {
        let nbVictories = 0;
        if(win) nbVictories = 1;

        // Add the new player
        wallOfFame.push({
            pseudo: safePseudo,
            score: safeScore,
            nbVictories: SecurityUtils.validateNumericValue(nbVictories, 0, 10000)
        });

        // Sort the wallOfFame
        sortWallOfFame();

        fetch('http://localhost:3000/update-wall-of-fame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            // Validate all data before sending
            body: JSON.stringify(wallOfFame.map(player => ({
                pseudo: SecurityUtils.sanitizeInput(player.pseudo || ''),
                score: SecurityUtils.validateNumericValue(player.score, 0, 1000000),
                nbVictories: SecurityUtils.validateNumericValue(player.nbVictories, 0, 10000)
            })))
        })
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => {
                console.error('Error sending data:', error);
                showSecurityError('Failed to add player to leaderboard.');
            });
    };

    /*
     * Sort the wallOfFame by score (descending) and then by number of victories (descending)
     */
    const sortWallOfFame = function() {
        // Add validation to sorting to handle corrupted data
        wallOfFame.sort((a, b) => {
            // Validate data before sorting to prevent errors from bad data
            const aScore = SecurityUtils.validateNumericValue(a.score, 0, 1000000);
            const bScore = SecurityUtils.validateNumericValue(b.score, 0, 1000000);
            const aVictories = SecurityUtils.validateNumericValue(a.nbVictories, 0, 10000);
            const bVictories = SecurityUtils.validateNumericValue(b.nbVictories, 0, 10000);

            // First sort by score (descending)
            if (bScore !== aScore) {
                return bScore - aScore;
            }
            // If scores are equal, sort by number of victories (descending)
            return bVictories - aVictories;
        });
    };

    /*
    This method display a table on html with the wallOfFame data from the server
     */

    // Fetch wallOfFame data from the server and display it
    const displayWallOfFame = function() {
        // Add rate limiting check
        if (!loadLeaderboardRateLimit()) {
            console.warn('Rate limit exceeded for leaderboard loading');
            showSecurityError('Too many requests. Please wait before loading leaderboard again.');
            return;
        }

        console.log('Fetching wall of fame data from server...');
        fetch(path)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                // Validate and sanitize the received data
                wallOfFame = SecurityUtils.validateApiResponse(data) || [];

                // Ensure it's an array and sanitize each entry
                if (!Array.isArray(wallOfFame)) {
                    wallOfFame = [];
                }

                // Sanitize all entries to prevent injection attacks through server data
                wallOfFame = wallOfFame.map(player => ({
                    pseudo: SecurityUtils.validatePlayerName(player.pseudo || 'Unknown'),
                    score: SecurityUtils.validateNumericValue(player.score, 0, 1000000),
                    nbVictories: SecurityUtils.validateNumericValue(player.nbVictories, 0, 10000)
                })).filter(player => player.pseudo !== 'Unknown'); // Remove invalid entries

                // Sort the wall of fame before displaying - keeping original function call
                sortWallOfFame();

                // Call the function to display the table - keeping original function call
                createTable(wallOfFame);
            })
            .catch(error => {
                console.error('Error loading wall of fame data:', error);
                // Display error message safely - replacing vulnerable innerHTML
                const tableContainer = document.getElementById('wallOfFameTable');
                if (tableContainer) {
                    // Use textContent instead of innerHTML to prevent XSS
                    tableContainer.textContent = 'Connection problem with the server. Impossible to display the leaderboard.';
                }
            });
    };

    // Create a table to display the wallOfFame data
    const createTable = function(data) {
        const tableContainer = document.getElementById('wallOfFameTable'); // Where to display the table

        if (!tableContainer) {
            console.error('Table container not found');
            return;
        }

        // Create the table and its header
        const table = document.createElement('table');
        table.setAttribute('border', '1');
        table.setAttribute('cellpadding', '10');
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        const headers = ['Rang', 'Pseudo', 'Score', 'Nb Victories'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;  // Safe text insertion
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create the table body
        const tbody = document.createElement('tbody');
        data.forEach((player, index) => {
            const row = document.createElement('tr');

            // Create cells using DOM methods instead of innerHTML to prevent XSS
            const rankCell = document.createElement('td');
            rankCell.textContent = (index + 1).toString();  // Safe text insertion

            const nameCell = document.createElement('td');
            nameCell.textContent = player.pseudo;  // Safe text insertion - prevents XSS

            const scoreCell = document.createElement('td');
            scoreCell.textContent = player.score.toString();  // Safe text insertion

            const victoriesCell = document.createElement('td');
            victoriesCell.textContent = player.nbVictories.toString();  // Safe text insertion

            // Append cells to row
            row.appendChild(rankCell);
            row.appendChild(nameCell);
            row.appendChild(scoreCell);
            row.appendChild(victoriesCell);

            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        // Append the table to the container
        tableContainer.innerHTML = ''; // Clear previous table if any
        tableContainer.appendChild(table);
    };

    // Helper function to show security errors safely
    const showSecurityError = function(message) {
        // Create a secure error popup that auto-removes
        const errorPopup = document.createElement('div');
        errorPopup.id = 'errorPopup';
        errorPopup.textContent = SecurityUtils.sanitizeInput(message); // Safe text insertion

        // Style the popup
        Object.assign(errorPopup.style, {
            position: 'fixed',
            top: '90%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'red',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            zIndex: '1000',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
        });

        document.body.appendChild(errorPopup);

        // Remove the popup after 5 seconds
        setTimeout(() => {
            if (errorPopup && errorPopup.parentNode) {
                errorPopup.parentNode.removeChild(errorPopup);
            }
        }, 5000);
    };

    return {
        saveScore,
        updatePlayerScore,
        addNewPlayer,
        displayWallOfFame,
        createTable,
        sortWallOfFame
    };
}