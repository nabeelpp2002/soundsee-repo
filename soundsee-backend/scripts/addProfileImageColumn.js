const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const addProfileImageColumn = async () => {
    try {
        const query = `
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500);
    `;
        await pool.query(query);
        console.log('Successfully added profile_image column to users table');
    } catch (error) {
        console.error('Error adding profile_image column:', error);
    } finally {
        pool.end();
    }
};

addProfileImageColumn();
