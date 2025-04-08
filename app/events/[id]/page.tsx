'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface Event {
  id: string;
  title: string;
  description: string;
  imgURL: string;
  startDate: string;
  endDate: string;
  tickets: {
    [type: string]: {
      price: number;
    };
  };
}

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/event/${params.id}`)
      .then(res => res.json())
      .then((data) => {
        setEvent(data);
        const initialQuantities: Record<string, number> = {};
        Object.keys(data.tickets).forEach(type => {
          initialQuantities[type] = 0;
        });
        setQuantities(initialQuantities);
      });
  }, [params.id]);

  if (!event) return <p className="p-6">Loading...</p>;

  const totalPrice = Object.entries(quantities).reduce(
    (sum, [type, qty]) => sum + qty * event.tickets[type].price,
    0
  );

  const handlePay = async () => {
    const res = await fetch('/api/order', {
      method: 'POST',
      body: JSON.stringify({
        eventId: event.id,
        items: quantities, // send selected ticket quantities
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      alert('Order placed successfully!');
      setDialogOpen(false);
    } else {
      alert('Order failed.');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardContent className="p-4">
          <img
            src={event.imgURL}
            alt={event.title}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
          <p className="text-muted-foreground mb-4">{event.description}</p>
          <p><strong>Start:</strong> {new Date(event.startDate).toLocaleString()}</p>
          <p><strong>End:</strong> {new Date(event.endDate).toLocaleString()}</p>

          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold">Select Tickets</h2>
            {Object.entries(event.tickets).map(([type, { price }]) => (
              <div key={type} className="flex items-center gap-4">
                <Label className="min-w-[80px] capitalize">{type} – ₹{price}</Label>
                <Input
                  type="number"
                  min={0}
                  value={quantities[type]}
                  className="w-24"
                  onChange={(e) =>
                    setQuantities({ ...quantities, [type]: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            ))}
          </div>

          <div className="mt-6">
            <p className="font-medium">Total Price: ₹{totalPrice}</p>
            <Button
              disabled={totalPrice === 0}
              className="mt-2"
              onClick={() => setDialogOpen(true)}
            >
              Buy Tickets
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirm Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {Object.entries(quantities).map(([type, qty]) =>
              qty > 0 ? (
                <p key={type}>
                  {qty} × {type} = ₹{qty * event.tickets[type].price}
                </p>
              ) : null
            )}
            <p className="font-semibold mt-2">Total: ₹{totalPrice}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePay}>Confirm & Pay</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
