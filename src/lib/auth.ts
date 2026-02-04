import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user) return null;

                // Use passwordHash as defined in schema
                const isValid = await compare(credentials.password, user.passwordHash);

                if (!isValid) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name || user.email,
                    role: user.role
                };
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                // @ts-ignore
                session.user.id = token.id as string;
                // @ts-ignore
                session.user.role = token.role as string;
                // Always use the latest name from the token (which is fetched fresh)
                session.user.name = token.name as string;
            }
            return session;
        },
        async jwt({ token, user, trigger }) {
            if (user) {
                token.id = user.id;
                // @ts-ignore
                token.role = user.role;
                token.name = user.name;
            }

            // On every request or update trigger, re-fetch user data from DB
            if (token.id) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.id as string },
                    select: { name: true, email: true }
                });
                if (dbUser) {
                    token.name = dbUser.name || dbUser.email;
                }
            }

            return token;
        }
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
};
