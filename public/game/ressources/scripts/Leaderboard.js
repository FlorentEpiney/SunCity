import { getWallOfFame, updateWallOfFame } from './Firebase.js';
import SecurityUtils from './SecurityUtils.js';

export default function Leaderboard() {
    let wallOfFame;
    const saveScoreRateLimit = SecurityUtils.createRateLimiter(5, 60000);
    const loadLeaderboardRateLimit = SecurityUtils.createRateLimiter(20, 60000);

    const saveScore = async function() {
        if (!saveScoreRateLimit()) {
            console.warn('Rate limit exceeded for score saving');
            showSecurityError('Too many request. Please wait before to submit a new one.');
            return;
        }

        try {
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

            // Update of the players' scores
            if (window.winner === 1) {
                await updateWallOfFame(player1Name, scorePlayer1, 1);
                await updateWallOfFame(player2Name, scorePlayer2, 0);
            } else if (window.winner === 2) {
                await updateWallOfFame(player1Name, scorePlayer1, 0);
                await updateWallOfFame(player2Name, scorePlayer2, 1);
            }

            console.log('Score saved with success');
            displayWallOfFame();
        } catch (error) {
            console.error('Error by saving the score: ', error);
            showSecurityError('Score save failed. Please retry.');
        }
    };

    const displayWallOfFame = async function() {
        if (!loadLeaderboardRateLimit()) {
            console.warn('Rate limit exceeded for leaderboard loading');
            showSecurityError('Too many request. Please wait before to submit a new one.');
            return;
        }

        try {
            wallOfFame = await getWallOfFame();

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
        } catch (error) {
            console.error('Error by loading the leaderboard:', error);
            const tableContainer = document.getElementById('wallOfFameTable');
            if (tableContainer) {
                tableContainer.textContent = 'Connection problem with the server. Unable to display leaderboard.';
            }
        }
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

            const cells = [
                (index + 1).toString(),
                player.pseudo,
                player.score.toString(),
                player.nbVictories.toString()
            ];

            cells.forEach(text => {
                const td = document.createElement('td');
                td.textContent = text;
                row.appendChild(td);
            });

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