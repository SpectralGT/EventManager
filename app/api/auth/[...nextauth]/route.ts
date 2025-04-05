// src/app/api/auth/[...nextauth]/route.ts (or pages/api/...)
import NextAuth, { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// Instantiate Prisma Client
const prisma = new PrismaClient();

// Define a type for our roles for better type safety
type UserRole = 'admin' | 'attendee' | 'operator';

// --- Type Augmentation for NextAuth ---
// Extend the built-in types to include custom properties like id, role, username
declare module 'next-auth' {
  // @ts-ignore
  interface User extends NextAuthUser {
    // Add properties returned by the authorize callback
    id: string;
    role: UserRole;
    username: string;
  }
  interface Session {
    // Add properties available on the session object (client + server)
    user: User & { // Ensure user object in session includes custom props
      id: string;
      role: UserRole;
      username: string;
    };
  }
}

declare module 'next-auth/jwt' {
  // Add properties available on the JWT token itself
  interface JWT {
    id: string;
    role: UserRole;
    username: string;
  }
}
// --- End Type Augmentation ---


export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (optional)
      name: 'Credentials',
      // `credentials` is used to generate a form on the default sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // We define them here but will use our custom login pages.
      // Crucially, we add 'role' here, which will be submitted by our custom forms.
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'hidden' }, // Role submitted from the specific login form
      },
      // The main authorization logic
      async authorize(credentials): Promise<NextAuthUser | null> {
        // 1. Validate that username, password, and role were received
        if (!credentials?.username || !credentials.password || !credentials.role) {
          console.error('Auth Error: Missing username, password, or role');
          // Returning null signifies failure, leading to an error on the client
          return null;
        }

        // 2. Validate the received role
        const validRoles: UserRole[] = ['admin', 'attendee', 'operator'];
        if (!validRoles.includes(credentials.role as UserRole)) {
             console.error(`Auth Error: Invalid role provided: ${credentials.role}`);
             return null;
        }

        const { username, password, role } = credentials;
        const userRole = role as UserRole; // Type assertion after validation

        let user: any = null; // Initialize user variable

        try {
          console.log(`Authorization attempt for role: ${userRole}, username: ${username}`);

          // 3. Query the correct database table based on the provided role
          switch (userRole) {
            case 'admin':
              user = await prisma.admin.findUnique({ where: { username } });
              break;
            case 'attendee':
              user = await prisma.attendee.findUnique({ where: { username } });
              break;
            case 'operator':
              user = await prisma.operator.findUnique({ where: { username } });
              break;
          }

          // 4. Check if a user was found in the specified table
          if (!user) {
            console.log(`Auth Info: User not found for role: ${userRole}, username: ${username}`);
            return null; // User not found failure
          }

          // 5. Compare the provided password with the stored hash
          const isValidPassword = await bcrypt.compare(password, user.password);

          if (!isValidPassword) {
            console.log(`Auth Info: Invalid password for role: ${userRole}, username: ${username}`);
            return null; // Incorrect password failure
          }

          // 6. Login successful! Return the user object for NextAuth.
          //    This object populates the 'user' parameter in the 'jwt' callback.
          //    It MUST include the properties defined in the augmented 'User' type.
          console.log(`Authorization successful for role: ${userRole}, username: ${username}`);
          return {
            id: user.id,
            username: user.username,
            role: userRole, // ** Crucial: Add the role here! **
            // email: null // No email in this schema
          };

        } catch (error) {
          console.error("Authorization Error:", error);
          return null; // Return null on any unexpected error
        } finally {
          // Optional: Disconnect Prisma client in serverless environments
          await prisma.$disconnect();
        }
      },
    }),
  ],

  // Use JSON Web Tokens (JWT) for session management
  session: {
    strategy: 'jwt',
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  callbacks: {
    // Called whenever a JWT is created (e.g., during sign-in) or updated.
    // The 'user' object is only passed on initial sign-in.
    async jwt({ token, user }) {
      // If 'user' exists (passed from authorize on sign-in), persist needed data to the token.
      if (user) {
        token.id = user.id;
        token.role = user.role; // Persist the role from the user object
        token.username = user.username;
        // token.name = user.name; // Already included by default if available on user
      }
      // The token is then encrypted and stored in a cookie.
      return token;
    },

    // Called whenever a session is checked.
    // The 'token' object comes from the 'jwt' callback.
    async session({ session, token }) {
      // Add the custom properties from the token to the session object.
      // This makes 'id', 'role', 'username' available client-side via useSession() or getServerSession().
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.username = token.username as string;
        // session.user.name = token.name; // Already included by default if available on token
      }
      return session;
    },
  },

  // Configure custom pages if needed (optional if redirects handled elsewhere)
  pages: {
    signIn: '/login', // A generic fallback login path (middleware will likely handle specific redirects)
    // signOut: '/auth/signout',
    error: '/auth/error', // Error page used for handling authentication errors
    // verifyRequest: '/auth/verify-request', // (used for email sign in)
    // newUser: '/auth/new-user' // New users will be created by the admin
  },

  // A random string used to hash tokens, sign cookies and generate cryptographic keys.
  // Required when not using a database adapter for sessions.
  secret: process.env.NEXTAUTH_SECRET,
};

// Initialize NextAuth.js with the options
const handler = NextAuth(authOptions);

// Export handlers for GET and POST requests (required for App Router)
export { handler as GET, handler as POST };