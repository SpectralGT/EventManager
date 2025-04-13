// src/app/api/auth/[...nextauth]/route.ts (or pages/api/...)
import NextAuth from 'next-auth';
// import bcrypt from 'bcrypt';
import { authOptions } from '@/lib/auth';

// Initialize NextAuth.js with the options
const handler = NextAuth(authOptions);

// Export handlers for GET and POST requests (required for App Router)
export { handler as GET, handler as POST };