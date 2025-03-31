import NextAuth, { DefaultSession } from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User as CustomUser } from '@/app/lib/definitions';
import bcrypt from 'bcryptjs';

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function getUser(email: string): Promise<CustomUser | undefined> {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
        deleted_at: null
      }
    });
    // console.log( 'getUser getUser getUser getUser', user)
    return user || undefined;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      role: string;
      name: string;
      generate_id: string;
      supervisor: string;
    } & DefaultSession['user'];
  }

  interface User {
    role: string;
    generate_id: string;
    supervisor: string;
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [Credentials({
    async authorize(credentials) {
      const parsedCredentials = z
        .object({ email: z.string().email(), password: z.string().min(6) })
        .safeParse(credentials);

      if (parsedCredentials.success) {
        const { email, password } = parsedCredentials.data;
        const user = await getUser(email);
        if (!user) return null;
        const passwordsMatch = await bcrypt.compare(password, user.password || '');

        if (passwordsMatch) {
          return {
            ...user,
            generate_id: user.generate_id || '', // Ensure generate_id is always a string
          };
        }
      }

      console.log('Invalid credentials');
      return null;
    },
  })],
});

