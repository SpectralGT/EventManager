// src/app/Operator/login/page.tsx
"use client"; // This component uses client-side interactivity
import { Button } from "@/components/ui/button";

export default function OperatorLoginPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Button className="py-10" asChild>
              <a href="/attendee/login">
            <h1 className="scroll-m-20 text-2xl font-extrabold text-black">
              Login as Attendee
            </h1>
              </a>
          </Button>
          <Button className="py-5 mt-10" variant="outline" asChild>
              <a href="/operator/login">
            <h1 className="scroll-m-20 text-1xl font-bold text-white">
              Login as Operator
            </h1>
              </a>
          </Button>
          <Button className="py-5" variant="outline" asChild>
              <a href="/admin/login">
            <h1 className="scroll-m-20 text-1xl font-bold text-white">
              Login as Admin
            </h1>
              </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
