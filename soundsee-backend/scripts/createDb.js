const { Client } = require('pg');
require('dotenv').config();

const createDatabase = async () => {
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: 'postgres', // Connect to default 'postgres' db to create new db
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });

    try {
        await client.connect();

        const dbName = process.env.DB_NAME;
        // Check if database exists
        const checkQuery = `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`;
        const checkRes = await client.query(checkQuery);

        if (checkRes.rowCount === 0) {
            console.log(`Creating database ${dbName}...`);
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Database ${dbName} created successfully.`);
        } else {
            console.log(`Database ${dbName} already exists.`);
        }
    } catch (err) {
        console.error('Error checking/creating database:', err);
    } finally {
        await client.end();
    }
};

createDatabase();
