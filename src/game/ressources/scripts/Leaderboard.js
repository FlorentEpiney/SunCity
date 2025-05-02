

export default function Leaderboard(){

    const path = 'http://localhost:3000/wall-of-fame';
    let wallOfFame;

    /*This function uses the localStorage to store the data into the wallOfFame.json
    * with 3 inputs: pseudo, score and if he wins the party or not.
     */
    const saveScore = function() {
        // Get data from localStorage
        const player1Name = localStorage.getItem('player1Name');
        const scorePlayer1 = localStorage.getItem('scorePlayer1');
        const player2Name = localStorage.getItem('player2Name');
        const scorePlayer2 = localStorage.getItem('scorePlayer2');
        const winner = localStorage.getItem('winner');

        // Get existing data
        fetch(path)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                wallOfFame = data;

                // Check if player1 already exists
                let playerExists = wallOfFame.some(player => player.pseudo === player1Name);

                if (playerExists) {
                    // Update existing player
                    if(winner === '1')
                        updatePlayerScore(player1Name, scorePlayer1, true);
                    else
                        updatePlayerScore(player1Name, scorePlayer1, false);
                } else {
                    // Add new player
                    if(winner === '1')
                        addNewPlayer(player1Name, scorePlayer1, true);
                    else
                        addNewPlayer(player1Name, scorePlayer1, false);
                }

                // Check if player2 already exists
                playerExists = wallOfFame.some(player => player.pseudo === player2Name);

                if (playerExists) {
                    // Update existing player
                    if(winner === '2')
                        updatePlayerScore(player2Name, scorePlayer2, true);
                    else
                        updatePlayerScore(player2Name, scorePlayer2, false);
                } else {
                    // Add new player
                    if(winner === '1')
                        addNewPlayer(player2Name, scorePlayer2, true);
                    else
                        addNewPlayer(player2Name, scorePlayer2, false);
                }
            })
            .catch(error => {
                console.error('Error loading the JSON file:', error);
            });
    };

    /*This function updates the score and the win if the pseudo already exists in the wallOfFame.json
     */
    const updatePlayerScore = function(pseudo, score, win) {

        wallOfFame = wallOfFame.map(player => {
            if (player.pseudo === pseudo) {
                // If the score is higher, update it
                if (win) {
                    if (score > player.score){
                        player.score = score;
                    }
                    player.nbVictories++;
                }
            }
            return player;
        });

        fetch('http://localhost:3000/update-wall-of-fame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(wallOfFame)
        })
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.error('Error sending data:', error));

    };

    /*This function adds a new player into the wallOfFame.json if he doesn't exist yet
     */
    const addNewPlayer = function(pseudo, score, win) {
        let nbVictories = 0;
        if(win) nbVictories = 1;

        // Add the new player
        wallOfFame.push({
            pseudo: pseudo,
            score: score,
            nbVictories: nbVictories
        });

        // Sort by descending score
        wallOfFame.sort((a, b) => b.score - a.score);

        fetch('http://localhost:3000/update-wall-of-fame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(wallOfFame)
        })
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.error('Error sending data:', error));

    };

    /*
    This method display a table on html with the wallOfFame data from the server
     */

    // Fetch wallOfFame data from the server and display it
    const displayWallOfFame = function() {
        console.log('Fetching wall of fame data from server...');
        fetch(path)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                wallOfFame = data;

                // Call the function to display the table
                createTable(wallOfFame);
            })
            .catch(error => {
                console.error('Error loading wall of fame data:', error);
            });
    };

    // Create a table to display the wallOfFame data
    const createTable = function(data) {
        const tableContainer = document.getElementById('wallOfFameTable'); // Where to display the table

        // Create the table and its header
        const table = document.createElement('table');
        table.setAttribute('border', '1');
        table.setAttribute('cellpadding', '10');
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = '<th>Rang</th><th>Pseudo</th><th>Score</th><th>Nb Victories</th>';
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create the table body
        const tbody = document.createElement('tbody');
        data.forEach(player => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${data.indexOf(player) + 1}</td>
                <td>${player.pseudo}</td>
                <td>${player.score}</td>
                <td>${player.nbVictories}</td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        // Append the table to the container
        tableContainer.innerHTML = ''; // Clear previous table if any
        tableContainer.appendChild(table);
    };

    return {
        saveScore,
        updatePlayerScore,
        addNewPlayer,
        displayWallOfFame,
        createTable
    };
}