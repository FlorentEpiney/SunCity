// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());


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
    const newData = req.body;

    const filePath = path.join(__dirname, 'src', 'game','gameData', 'wallOfFame.json');
    if (!fs.existsSync(filePath)) {
        console.error("File does not exist:", filePath);
    }

    fs.writeFile(filePath, JSON.stringify(newData, null, 2), (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).send('Failed to write data');
        }
        res.send('Data successfully written');
    });
});

app.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});
