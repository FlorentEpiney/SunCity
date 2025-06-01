
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
    // Allow requests from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        // Return the current leaderboard data

        try {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(wallOfFameData);
        } catch (error) {
            console.error('Error in GET /wall-of-fame:', error);
            res.status(500).json({ error: 'Failed to retrieve leaderboard data' });
        }
    }

    else if (req.method === 'POST') {
        // Handle updates to the leaderboard

        try {
            const newData = req.body;

            // Basic validation (same as your original server)
            if (!Array.isArray(newData)) {
                return res.status(400).json({ error: 'Invalid data format' });
            }

            // Update our in-memory data
            wallOfFameData = newData;

            console.log('Leaderboard updated with new data:', newData);
            res.status(200).json({ message: 'Data successfully updated' });

        } catch (error) {
            console.error('Error in POST /wall-of-fame:', error);
            res.status(500).json({ error: 'Failed to update leaderboard data' });
        }
    }

    else {
        // Handle any other HTTP methods
        res.status(405).json({ error: 'Method not allowed' });
    }
}