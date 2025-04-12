// app/events/page.tsx
'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface Event {
  id: string;
  title: string;
  description: string;
  imgURL: string;
  startDate: string;
  endDate: string;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch('/api/event') // assumes API route returns all events
      .then(res => res.json())
      .then(setEvents);

      // const img = "https://as1.ftcdn.net/jpg/04/55/67/40/1000_F_455674062_2e3SniIAGNFi8l9D9oVQJe235zH1Hx5w.jpg";
      // setEvents([{id:"1",imgURL:img,title:"Doorga Puja",description:"description",startDate:"2020-12-02",endDate:"2020-12-20"}]);
  }, []);




  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Events</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {events.map(event => (
          
          <>
          
          <Link
            href={`/event/${event.id}`}
            key={event.id}
            className="block hover:shadow-lg transition-shadow rounded-xl"
          >
            <Card className="h-full">
              <CardContent className="p-4">
                <img
                  src={event.imgURL}
                  alt={event.title}
                  className="w-full object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl font-semibold mb-1">{event.title}</h2>
                {/* <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {event.description}
                </p> */}
                <p className="text-sm text-muted-foreground">
                  <strong>Start:</strong>{' '}
                  {new Date(event.startDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>End:</strong>{' '}
                  {new Date(event.endDate).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </Link>

          
          

          </>


        ))}
      </div>
    </div>
  );
}
