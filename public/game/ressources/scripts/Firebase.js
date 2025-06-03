import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getDatabase, ref, get, set } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyBrhHGeLQx3cweqfAqnDZae_5x63G4etag",
    authDomain: "suncity-68e7c.firebaseapp.com",
    databaseURL: "https://suncity-68e7c-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "suncity-68e7c",
    storageBucket: "suncity-68e7c.firebasestorage.app",
    messagingSenderId: "718567711100",
    appId: "1:718567711100:web:d7457455f18f4039d1c4f9",
    measurementId: "G-QHD8L27GF7"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export async function updateWallOfFame(pseudo, score, victories) {
    try {
        const wallRef = ref(db, 'leaderboard');
        const snapshot = await get(wallRef);
        let wallOfFame = snapshot.exists() ? snapshot.val() : [];

        if (!Array.isArray(wallOfFame)) {
            wallOfFame = [];
        }

        const playerIndex = wallOfFame.findIndex(player => player.pseudo === pseudo);

        if (playerIndex !== -1) {
            if (score > wallOfFame[playerIndex].score) {
                wallOfFame[playerIndex].score = score;
            }
            if (victories > 0) {
                wallOfFame[playerIndex].nbVictories++;
            }
        } else {
            wallOfFame.push({
                pseudo,
                score,
                nbVictories: victories
            });
        }

        wallOfFame.sort((a, b) => b.score - a.score);
        wallOfFame = wallOfFame.slice(0, 10);

        await set(wallRef, wallOfFame);
        return true;
    } catch (error) {
        console.error("Erreur lors de la mise à jour du classement:", error);
        return false;
    }
}

export async function getWallOfFame() {
    try {
        const wallRef = ref(db, 'leaderboard');
        const snapshot = await get(wallRef);
        return snapshot.exists() ? snapshot.val() : [];
    } catch (error) {
        console.error("Erreur lors de la récupération du classement:", error);
        return [];
    }
}