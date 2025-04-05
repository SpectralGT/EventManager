// src/components/LogoutButton.tsx
'use client'; // Mark this as a Client Component

import { signOut } from 'next-auth/react';

// Optional: Define props if you want to customize the button later (e.g., text, styling classes)
interface LogoutButtonProps {
  className?: string; // Allow passing custom CSS classes
}

export default function LogoutButton({ className }: LogoutButtonProps) {

  // Function to handle the logout action
  const handleLogout = async () => {
    // Call the signOut function provided by NextAuth.js
    // It handles clearing the session/token cookie.
    await signOut({
      // Optional: Specify where to redirect the user after logout.
      // Defaults to the current page, which might not be ideal.
      // Redirecting to the home page or a specific public page is common.
      callbackUrl: '/', // Redirect to the homepage after logout
      // redirect: true // Default is true, redirects after signing out
    });
    // No need to manually push routes here, signOut handles the redirect based on callbackUrl
    console.log("User logged out.");
  };

  return (
    <button
      onClick={handleLogout}
      className={className || "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"} // Basic styling example (using Tailwind CSS classes)
    >
      Logout
    </button>
  );
}