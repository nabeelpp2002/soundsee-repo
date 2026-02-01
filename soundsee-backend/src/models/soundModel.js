const db = require('../config/db');

const createSoundLog = async (userId, soundLabel, confidence, timestamp) => {
    const query = `
    INSERT INTO sound_logs (user_id, sound_label, confidence, timestamp)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
    const values = [userId, soundLabel, confidence, timestamp];
    const result = await db.query(query, values);
    return result.rows[0];
};

const getSoundHistory = async (userId) => {
    const query = 'SELECT * FROM sound_logs WHERE user_id = $1 ORDER BY timestamp DESC';
    const result = await db.query(query, [userId]);
    return result.rows;
};

module.exports = {
    createSoundLog,
    getSoundHistory,
};
