import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { email, password, firstName, lastName } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 409 });
        }

        const hashedPassword = await hash(password, 10);
        const fullName = (firstName && lastName) ? `${firstName} ${lastName}` : firstName || lastName || null;

        const newUser = await prisma.user.create({
            data: {
                email,
                name: fullName,
                passwordHash: hashedPassword,
                role: 'USER',
            },
        });

        // Remove password from response
        const { passwordHash, ...userWithoutPassword } = newUser;

        return NextResponse.json({ message: "User created", user: userWithoutPassword }, { status: 201 });
    } catch (error) {
        console.error("Registration Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
