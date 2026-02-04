// Script to clean up bots with old status values
const { PrismaClient } = require('@prisma/client');

async function cleanupOldBots() {
    // Use raw query since Prisma client has new enum
    const { Client } = require('pg');

    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        console.log('Connected to database');

        // Delete bots with old status values
        const result = await client.query(`
            DELETE FROM bots 
            WHERE status::text IN ('ACTIVATING', 'EXPIRED')
            RETURNING id, name, status
        `);

        console.log('Deleted bots:', result.rows);
        console.log(`Total deleted: ${result.rowCount} bots`);

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await client.end();
    }
}

cleanupOldBots();
