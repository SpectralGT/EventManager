// src/app/admin/login/page.tsx
'use client'; // This component uses client-side interactivity

import { useState, FormEvent, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation'; // Use 'next/navigation' for App Router

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams(); // To read query params like ?error=

  // Check for errors passed in URL query params (e.g., from NextAuth redirect)
  useEffect(() => {
    const callbackError = searchParams.get('error');
    if (callbackError) {
      if (callbackError === 'CredentialsSignin') {
        setError('Invalid username or password for Admin.');
      } else {
        setError('An unexpected login error occurred.');
      }
    }
  }, [searchParams]);

  // Handle form submission
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault(); // Prevent default form submission
    setError(null); // Clear previous errors

    // Attempt to sign in using the 'credentials' provider
    const result = await signIn('credentials', {
      // Prevent NextAuth from automatically redirecting, so we can handle errors/success manually
      redirect: false,
      // Pass the credentials to the 'authorize' function in NextAuth config
      username: username,
      password: password,
      role: 'operator', // <-- ** CRITICAL: Specify the role for this login page **
    });

    // Check the result of the sign-in attempt
    if (result?.error) {
      // Handle errors (e.g., wrong credentials returned null from authorize)
      console.error('Admin Login Error:', result.error);
       if (result.error === 'CredentialsSignin' || result.error === 'Callback') { // Callback can sometimes indicate credential errors too
           setError('Invalid username or password for Admin.');
       } else {
           setError('Login failed. Please try again.');
       }
    } else if (result?.ok) {
      // Login successful! Redirect to the admin-specific dashboard or desired page
      console.log('Admin login successful, redirecting...');
      // Redirect to the intended page or a default dashboard
      const callbackUrl = searchParams.get('callbackUrl') || '/admin/task';
      router.push(callbackUrl);
      router.refresh(); // Refresh server components potentially affected by login state
    } else {
      // Handle other potential issues (though result?.ok should cover success)
       setError('An unexpected error occurred during login.');
    }
  };

  return (
    <div>
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username" // Help password managers
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password" // Help password managers
          />
        </div>
        {/* Display errors to the user */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}