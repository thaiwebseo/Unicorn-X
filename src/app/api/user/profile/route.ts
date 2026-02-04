import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hash, compare } from 'bcryptjs';

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { firstname, lastname, oldPassword, newPassword } = body;

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        // Prepare update data
        const updateData: any = {};

        // Update Name
        if (firstname || lastname) {
            const fullName = `${firstname || ''} ${lastname || ''}`.trim();
            if (fullName) {
                updateData.name = fullName;
            }
        }

        // Update Password
        if (newPassword) {
            if (!oldPassword) {
                return new NextResponse('Old password is required to set new password', { status: 400 });
            }

            const isValid = await compare(oldPassword, user.passwordHash);
            if (!isValid) {
                return new NextResponse('Incorrect old password', { status: 400 });
            }

            const hashedPassword = await hash(newPassword, 12);
            updateData.passwordHash = hashedPassword;
        }

        if (Object.keys(updateData).length > 0) {
            await prisma.user.update({
                where: { email: session.user.email },
                data: updateData
            });
        }

        return NextResponse.json({ message: 'Profile updated successfully' });

    } catch (error) {
        console.error('[PROFILE_UPDATE_ERROR]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
