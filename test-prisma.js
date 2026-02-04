
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Testing Prisma Client...');
        const user = await prisma.user.findFirst();
        console.log('User found:', user ? user.email : 'None');

        // Check if we can update name
        if (user) {
            console.log('Attempting to update name for:', user.email);
            // This line will fail at runtime if 'name' is not in the client types
            await prisma.user.update({
                where: { email: user.email },
                data: { name: 'Test Name' }
            });
            console.log('Update successful!');
        }
    } catch (e) {
        console.error('Test Failed:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
