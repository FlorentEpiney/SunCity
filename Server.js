const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'dist')));

// Routes existantes
app.get('/wall-of-fame', (req, res) => {
    const filePath = path.join(__dirname, 'src', 'game', 'gameData', 'wallOfFame.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Failed to read wallOfFame.json:', err);
            return res.status(500).send('Error reading file');
        }

        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    });
});

app.post('/update-wall-of-fame', (req, res) => {
    const filePath = path.join(__dirname, 'src', 'game', 'gameData', 'wallOfFame.json');

    fs.writeFile(filePath, JSON.stringify(req.body, null, 2), (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).send('Failed to write data');
        }
        res.send('Data successfully written');
    });
});

// Route par défaut pour React
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});