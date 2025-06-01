// api/update-wall-of-fame.js
import handler from './wall-of-fame.js';

// This endpoint reuses the same logic but only handles POST requests
export default async function updateHandler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST method allowed on this endpoint' });
    }

    // Delegate to the main handler
    return handler(req, res);
}