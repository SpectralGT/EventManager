// src/app/Attendee/login/page.tsx
'use client'; // This component uses client-side interactivity

import { useState, FormEvent, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation'; // Use 'next/navigation' for App Router
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";

export default function AttendeeLoginPage() {
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
        setError('Invalid username or password for Attendee.');
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
      role: 'attendee', // <-- ** CRITICAL: Specify the role for this login page **
    });

    // Check the result of the sign-in attempt
    if (result?.error) {
      // Handle errors (e.g., wrong credentials returned null from authorize)
      console.error('Attendee Login Error:', result.error);
       if (result.error === 'CredentialsSignin' || result.error === 'Callback') { // Callback can sometimes indicate credential errors too
           setError('Invalid username or password for Attendee.');
       } else {
           setError('Login failed. Please try again.');
       }
    } else if (result?.ok) {
      // Login successful! Redirect to the Attendee-specific dashboard or desired page
      console.log('Attendee login successful, redirecting...');
      // Redirect to the intended page or a default dashboard
      const callbackUrl = searchParams.get('callbackUrl') || '/attendee/profile';
      router.push(callbackUrl);
      router.refresh(); // Refresh server components potentially affected by login state
    } else {
      // Handle other potential issues (though result?.ok should cover success)
       setError('An unexpected error occurred during login.');
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Attendee Login</CardTitle>
              {/* Display errors to the user */}
              {error && <p style={{ color: "red" }}>{error}</p>}
            </CardHeader>
            <CardContent>
              <form>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username:</Label>
                    <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password:</Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password" // Help password managers
                    />
                  </div>
                  <Button type="submit" onClick={handleSubmit} className="w-full">
                    Login
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}