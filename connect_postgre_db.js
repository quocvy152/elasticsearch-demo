const { Client } = require('pg');

const client = new Client({
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	host: process.env.POSTGRES_HOST,
	port: process.env.POSTGRES_LOCAL_PORT,
	database: process.env.POSTGRES_DATABASE,
});

(async () => {
    try {
        await client.connect();
        console.log('Connected to PostgreSQL database');
    } catch (error) {
        console.error('Error connecting to PostgreSQL database', error);
    }
})()

exports.POSTGRES_CONNECTION = client;