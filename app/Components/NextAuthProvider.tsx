// src/app/providers/NextAuthProvider.tsx
'use client'; // This component must be a client component

import { SessionProvider } from 'next-auth/react';
import React from 'react';

interface Props {
    children: React.ReactNode;
    // session?: any; // Optional: If passing initial session props
}

// Wrapper component for the SessionProvider
export default function NextAuthProvider({ children }: Props) {
  // You can optionally pass the session object here if fetched server-side initially
  // return <SessionProvider session={session}>{children}</SessionProvider>;
  return <SessionProvider>{children}</SessionProvider>;
}