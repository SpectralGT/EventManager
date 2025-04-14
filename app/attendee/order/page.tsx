"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"
import { Profile } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function Home() {
  const [profile, setProfile] = useState<Profile>();

  useEffect(() => {
    fetch("/api/attendee/profile") // assumes API route returns profile
      .then((res) => res.json())
      .then((data:Profile)=>{
        setProfile(data);
      });


    
  }, []);

  return (
    <div className="p-6">
      {/* <h1 className="text-2xl font-bold mb-4">Username : <span className="text-primary">{profile?.username}</span></h1> */}
      {/* <h1 className="text-2xl font-bold mb-4">Balance : <span className="text-primary">{profile?.balance}</span></h1> */}

      {/* <Separator /> */}

      <h1 className="text-2xl font-bold mb-4 mt-5 text-center">Orders</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {profile?.orders ? (
          profile?.orders.map((order) => (
            <Link href={`/attendee/order/${order.id}`} key={order.id} className="block hover:shadow-lg transition-shadow rounded-xl">
              <Card className="h-full">
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-1">{order.eventTitle}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    <strong>Ordered at : </strong> {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div>Loading ...</div>
        )}
      </div>
    </div>
  );
}
