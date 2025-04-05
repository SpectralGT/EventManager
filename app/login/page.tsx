// src/app/Operator/login/page.tsx
"use client"; // This component uses client-side interactivity
import { Button } from "@/components/ui/button";

export default function OperatorLoginPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Button className="py-10">
            <h1 className="scroll-m-20 text-2xl font-extrabold text-black">
              <a href="/attendee/login">Login as Attendee</a>
            </h1>
          </Button>
          <Button className="py-5 mt-10" variant="outline">
            <h1 className="scroll-m-20 text-1xl font-bold text-white">
              <a href="/operator/login">Login as Operator</a>
            </h1>
          </Button>
          <Button className="py-5" variant="outline">
            <h1 className="scroll-m-20 text-1xl font-bold text-white">
              <a href="/admin/login">Login as Admin</a>
            </h1>
          </Button>
        </div>
      </div>
    </div>
  );
}
