import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
    session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
          generate_id: token.generate_id as string,
          supervisor: token.supervisor as string,
        };
      }
      // console.log('session session session session', session)
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token = { ...token, ...user };
      }
      // console.log('jwt jwt jwt jwt', token)
      return token;
    }
  },
  providers: [], // Add providers with an empty array for now
  secret: process.env.AUTH_SECRET
} satisfies NextAuthConfig;