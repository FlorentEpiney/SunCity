// api/wall-of-fame.js
let wallOfFameData = [
    {
        "pseudo": "Walter",
        "score": 2053,
        "nbVictories": 3
    },
    {
        "pseudo": "Flep",
        "score": 1996,
        "nbVictories": 0
    },
    {
        "pseudo": "alfonso",
        "score": 569,
        "nbVictories": 1
    },
    {
        "pseudo": "Florent",
        "score": 569,
        "nbVictories": 0
    },
    {
        "pseudo": "Bob",
        "score": 402,
        "nbVictories": 3
    },
    {
        "pseudo": "Alice",
        "score": 270,
        "nbVictories": 1
    }
];

export default async function handler(req, res) {
    // Set CORS headers to allow requests from your domain
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');

    // Handle preflight requests (browsers send these before actual requests)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        try {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(wallOfFameData);
        } catch (error) {
            console.error('Error in GET /api/wall-of-fame:', error);
            res.status(500).json({ error: 'Failed to retrieve leaderboard data' });
        }
    }
    else if (req.method === 'POST') {
        try {
            const newData = req.body;

            // Validate the incoming data structure
            if (!Array.isArray(newData)) {
                return res.status(400).json({ error: 'Expected an array of player data' });
            }

            // Validate each player object has required fields
            const isValidData = newData.every(player =>
                player.pseudo &&
                typeof player.score === 'number' &&
                typeof player.nbVictories === 'number'
            );

            if (!isValidData) {
                return res.status(400).json({ error: 'Invalid player data format' });
            }

            // Update the leaderboard (note: this will reset when function restarts)
            wallOfFameData = newData;

            console.log('Leaderboard updated successfully');
            res.status(200).json({ message: 'Leaderboard updated successfully' });

        } catch (error) {
            console.error('Error in POST /api/wall-of-fame:', error);
            res.status(500).json({ error: 'Failed to update leaderboard' });
        }
    }
    else {
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}