
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Determine env file path
const envPath = path.join(__dirname, '..', '.env');

try {
    const envContent = fs.readFileSync(envPath, 'utf8');

    let databaseUrl = '';
    const lines = envContent.split(/\r?\n/); // Handle both LF and CRLF

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('DATABASE_URL=')) {
            // Handle "DATABASE_URL=value" or DATABASE_URL="value"
            const parts = trimmedLine.split('=');
            // Rejoin parts in case value contains '=' (e.g. in password)
            let value = parts.slice(1).join('=').trim();

            // Remove surrounding quotes if present
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            } else if (value.startsWith("'") && value.endsWith("'")) {
                value = value.slice(1, -1);
            }

            databaseUrl = value;
            break;
        }
    }

    if (!databaseUrl) {
        console.error('DATABASE_URL not found in .env');
        process.exit(1);
    }

    // Replace port 6543 with 5432 for direct connection
    const directUrl = databaseUrl.replace(':6543', ':5432').replace('?pgbouncer=true', '');

    console.log('Running db push with DIRECT_URL (port 5432)...');

    // Prepare environment variables - merge current process.env with our new DATABASE_URL
    const newEnv = { ...process.env, DATABASE_URL: directUrl };

    try {
        // Using db push to avoid reset prompt if history is drifted, and to be safer about data loss warnings (it will fail if dataloss is detected without flag)
        execSync('npx prisma db push', {
            stdio: 'inherit',
            env: newEnv
        });
        console.log('Schema push successful!');
    } catch (err) {
        // execSync throws if command fails
        console.error('Schema push failed (execSync error).');
        process.exit(1);
    }

} catch (err) {
    console.error('Failed to read .env or execute schema push:', err);
    process.exit(1);
}
