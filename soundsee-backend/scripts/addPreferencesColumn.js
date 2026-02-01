const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const addPreferencesColumn = async () => {
    try {
        const query = `
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';
    `;
        await pool.query(query);
        console.log('Successfully added preferences column to users table');
    } catch (error) {
        console.error('Error adding preferences column:', error);
    } finally {
        pool.end();
    }
};

addPreferencesColumn();
