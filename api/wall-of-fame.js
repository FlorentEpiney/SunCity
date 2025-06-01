// api/wall-of-fame.js
// This is our serverless function that handles both GET and POST requests

// Our simple in-memory data store (remember, this resets periodically)
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
        "pseudo": "Alfonso",
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

// This is the main function that Vercel calls when someone requests this endpoint
export default async function handler(req, res) {
    console.log(`Received ${req.method} request to /api/wall-of-fame`);

    // Set up CORS headers so browsers allow requests from your game
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');

    // Handle preflight requests (browsers send these automatically)
    if (req.method === 'OPTIONS') {
        console.log('Handling OPTIONS preflight request');
        res.status(200).end();
        return;
    }

    try {
        if (req.method === 'GET') {
            console.log('Handling GET request - returning leaderboard data');
            res.status(200).json(wallOfFameData);

        } else if (req.method === 'POST') {
            console.log('Handling POST request - updating leaderboard data');
            const newData = req.body;

            // Basic validation
            if (!Array.isArray(newData)) {
                console.error('Invalid data format received:', typeof newData);
                return res.status(400).json({ error: 'Expected an array of player data' });
            }

            // Update our data
            wallOfFameData = newData;
            console.log('Leaderboard updated successfully with', newData.length, 'players');

            res.status(200).json({
                message: 'Leaderboard updated successfully',
                playerCount: newData.length
            });

        } else {
            console.log(`Unsupported method: ${req.method}`);
            res.status(405).json({ error: `Method ${req.method} not allowed` });
        }

    } catch (error) {
        console.error('Error in wall-of-fame API:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}