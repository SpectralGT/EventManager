"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { Order, Item } from "@/lib/types";
import { Ticket } from "lucide-react";

interface Ticket {
  name: string;
  price: number;
  quantity: number;
  serveStartTime: string;
  serveEndTime: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  imgURL: string;
  startDate: string;
  endDate: string;
  tickets: Ticket[];
}

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetch(`/api/event/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data.tickets)) return <p className="p-6">Error loading tickets</p>;
        
        setEvent(data);

        const tickets = data.tickets;
        const newItems: Item[] = [];
        tickets?.forEach((e:Item) => {
          const newItem: Item = {
            name: e.name,
            quantity: 0,
            served: 0,
            price: e.price,
            serveStartTime: e.serveStartTime,
            serveEndTime: e.serveEndTime,
          };
          newItems.push(newItem);
          setItems(newItems);
        });

        console.log(items);
      });
  }, [id]);

  if (!event) return <p className="p-6">Loading...</p>;

  const handlePay = async () => {
    const attendeeId = "null";

    console.log(items);

    const res = await fetch(`/api/event/${event.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: items,
      }),
    });

    if (res.ok) {
      alert("Order placed successfully!");
      setDialogOpen(false);
    } else {
      alert("Order failed.");
    }
  };

  const changeItems = (name: string, quantity: number, increament: number) => {
    const newItems = items;
    newItems.forEach((e) => {
      if (e.name == name) {
        e.quantity = quantity + increament;
      }
    });

    let total = 0;
    newItems.forEach((e) => (total += e.quantity * e.price));

    setTotalPrice(total);
    setItems(newItems);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardContent className="p-4">
          <img src={event.imgURL} alt={event.title} className="w-full object-cover rounded-lg mb-4" />
          <h1 className="text-center text-4xl font-bold mb-2">{event.title}</h1>
          <div className="text-muted-foreground mb-4 mt-4 description" dangerouslySetInnerHTML={{ __html: `<div> ${event.description} </div>` }}></div>
          
          <p>
            <strong>Start:</strong> {new Date(event.startDate).toLocaleString()}
          </p>
          <p>
            <strong>End:</strong> {new Date(event.endDate).toLocaleString()}
          </p>

          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold">Select Tickets</h2>
            {items.map((item) => (
              // <div key={item.name} className="flex items-center gap-4">
              //   <Input type="number" min={0} defaultValue={0} className="w-24" onChange={(e) => changeItems(item.name, Number(e.target.value))} />

                <div key={item.name} className="flex w-full max-w-sm items-center space-x-2">
                <Label className="min-w-[100px] capitalize">
                  {item.name} - ₹{item.price}
                </Label>
                  <Button className="font-extrabold" onClick={(e) => changeItems(item.name, item.quantity, -1)}>-</Button>
                  <Input type="number" min={0} defaultValue={0} value={item.quantity} className="w-24" onChange={(e) => changeItems(item.name, Number(item.quantity), 0)} />
                  <Button className="font-extrabold" onClick={(e) => changeItems(item.name, item.quantity, 1)}>+</Button>
                </div>
              // </div>
            ))}
          </div>

          <div className="mt-6">
            <p className="font-extrabold">Total Price: ₹{totalPrice}</p>
            <Button disabled={totalPrice === 0} className="mt-2" onClick={() => setDialogOpen(true)}>
              Buy Tickets
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {items.map((item) => (item.quantity > 0 ? <p key={item.name}>{` ${item.name} ( ${item.price} ) X ${item.quantity}  = ₹${item.price * item.quantity}`}</p> : null))}
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
