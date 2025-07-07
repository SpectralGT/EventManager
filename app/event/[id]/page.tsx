"use client";

import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Item } from "@/lib/types";
// import { Ticket } from "lucide-react";

import { useSession } from "next-auth/react";
import { Checkbox } from "@/components/ui/checkbox";
import { set } from "date-fns";
// import Link from "next/link";

interface Day {
  description: String;
  items: Ticket[];
}

interface Ticket {
  name: string;
  singleMemberPrice: number;
  familyMemberPrice: number;
  kidsMemberPrice: number;
  singleGuestPrice: number;
  familyGuestPrice: number;
  kidsGuestPrice: number;
}

interface Event {
  id: string;
  title: string;
  description: string;
  imgURL: string;
  startDate: string;
  endDate: string;
  days: Day[];
}

export default function EventDetailPage() {
  //getting Id from URL
  const { id } = useParams();

  //setting States
  const [event, setEvent] = useState<Event | null>(null);
  const [isFamily, setIsFamily] = useState<boolean>(false);
  const [items, setItems] = useState<Item[]>([]);
  const [isGuestOrder, setIsGuestOrder] = useState<boolean>(false);
  const [guestName, setGuestName] = useState<string>("");
  const [guestIsFamily, setGuestIsFamily] = useState<boolean>(false);
  const [guestAdultCount, setGuestAdultCount] = useState<number>(0);
  const [guestChildCount, setGuestChildCount] = useState<number>(0);
  const [guestItems, setGuestItems] = useState<Item[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalGuestPrice, setTotalGuestPrice] = useState(0);

  //getting query of Status from URL
  const { status } = useSession();

  useEffect(() => {
    //Getting event data by id
    fetch(`/api/event/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data.days))
          return <p className="p-6">Error loading items</p>;
        setEvent(data);

        //Setting Items state for Order Object
        const days = data.days;
        console.log(data);

        const newItems: Item[] = [];
        days.forEach((day: Day, index: number) => {
          day.items?.forEach((e: Ticket) => {
            const newItem: Item = {
              name: `Day ${index + 1}: ${e.name} (Single)`,
              quantity: 0,
              served: 0,
              price: e.singleMemberPrice,
            };
            newItems.push(newItem);
            setItems(newItems);
          });
        });

        const newGuestItems: Item[] = [];
        days.forEach((day: Day, index: number) => {
          day.items?.forEach((e: Ticket) => {
            const newItem: Item = {
              name: `Day ${index + 1}: ${e.name} (Single)`,
              quantity: 0,
              served: 0,
              price: e.singleMemberPrice,
            };
            newGuestItems.push(newItem);
            setGuestItems(newGuestItems);
          });
        });

        //Getting Local Storage Items after Redirecting
        const savedItems = localStorage.getItem("selectedItems");
        if (savedItems) {
          try {
            const savedItemsJSON = JSON.parse(savedItems);
            if (savedItemsJSON && savedItemsJSON.eventID == id) {
              let total = 0;
              savedItemsJSON.items.forEach(
                // @ts-expect-error : item will be of type  Item
                (e) => (total += e.quantity * e.price)
              );

              let guestTotal = 0;
              savedItemsJSON.items.forEach(
                // @ts-expect-error : item will be of type  Item
                (e) => (guestTotal += e.quantity * e.price)
              );

              setTotalPrice(total);
              setTotalGuestPrice(guestTotal);

              setItems(savedItemsJSON.memberItems);
              setIsGuestOrder(savedItemsJSON.isGuestOrder);
              setGuestName(savedItemsJSON.guestName);
              setGuestIsFamily(savedItemsJSON.guestIsFamily);
              setGuestAdultCount(savedItemsJSON.guestAdultCount);
              setGuestChildCount(savedItemsJSON.guestChildCount);
              setGuestItems(savedItemsJSON.guestItems);
              setDialogOpen(true);
            }
          } catch (e) {
            console.error("No saved items", e);
          }
        }
      });
  }, [id]);

  if (!event) return <p className="p-6">Loading...</p>;

  //Handle pay when user is loged in and clicks on Confirm Button
  const handlePay = async () => {
    if (!guestIsFamily) setGuestChildCount(0);
    if (!isGuestOrder) {
      setGuestName("");
      setGuestIsFamily(false);
      setGuestAdultCount(0);
      setGuestChildCount(0);
      setGuestItems([]);
    }
    console.log({
      memberItems: items,
      isGuestOrder: isGuestOrder,
      guestName: guestName,
      guestIsFamily: guestIsFamily,
      guestAdultCount: guestAdultCount,
      guestChildCount: guestChildCount,
      guestItems: guestItems,
    });

    const res = await fetch(`/api/event/${event.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        memberItems: items,
        isGuestOrder: isGuestOrder,
        guestName: guestName,
        guestIsFamily: guestIsFamily,
        guestAdultCount: guestAdultCount,
        guestChildCount: guestChildCount,
        guestItems: guestItems,
      }),
    });

    if (res.ok) {
      alert("Order placed successfully!");
      setDialogOpen(false);
    } else {
      alert("Order failed.");
    }
  };

  //Handle pay function when user is not logged in
  const handleUnloggedPay = async () => {
    localStorage.removeItem("selectedItems");
    localStorage.setItem(
      "selectedItems",
      JSON.stringify({
        eventID: event.id,
        memberItems: items,
        guestName: guestName,
        guestIsFamily: guestIsFamily,
        guestAdultCount: guestAdultCount,
        guestChildCount: guestChildCount,
        guestItems: guestItems,
      })
    );
    redirect(`/attendee/login?redirect=${id}`);
  };

  //Updating the Items State when the user selects items
  const changeItems = (name: string, quantity: number, increament: number) => {
    const newItems = items;
    newItems.forEach((e) => {
      if (e.name == name && e.quantity + increament >= 0) {
        e.quantity = quantity + increament;
      }
    });

    let total = 0;
    newItems.forEach((e) => (total += e.quantity * e.price));

    setTotalPrice(total);
    setItems(newItems);
  };

  const changeGuestItems = (
    name: string,
    quantity: number,
    increament: number
  ) => {
    const newItems = guestItems;
    newItems.forEach((e) => {
      if (e.name == name && e.quantity + increament >= 0) {
        e.quantity = quantity + increament;
      }
    });

    let guestTotal = 0;
    newItems.forEach((e) => (guestTotal += e.quantity * e.price));

    setTotalGuestPrice(guestTotal);
    setGuestItems(newItems);
  };

  const changeIsFamily = (isFamily: boolean) => {
    setIsFamily(isFamily);
    if (isFamily) {
      const newItems: Item[] = [];
      event.days.forEach((day: Day, index: number) => {
        day.items?.forEach((e: Ticket) => {
          const newItem: Item = {
            name: `Day ${index + 1}: ${e.name} (Family)`,
            quantity: 0,
            served: 0,
            price: e.familyMemberPrice,
          };

          const newItemKids: Item = {
            name: `Day ${index + 1}: ${e.name} (Kids)`,
            quantity: 0,
            served: 0,
            price: e.kidsMemberPrice,
          };

          newItems.push(newItem);
          newItems.push(newItemKids);
        });
      });
      setItems(newItems);
    } else {
      const newItems: Item[] = [];
      event.days.forEach((day: Day, index: number) => {
        day.items?.forEach((e: Ticket) => {
          const newItem: Item = {
            name: `Day ${index + 1}: ${e.name} (Single)`,
            quantity: 0,
            served: 0,
            price: e.singleMemberPrice,
          };

          newItems.push(newItem);
        });
      });
      setItems(newItems);
    }
  };

  const changeGuestIsFamily = (isFamily: boolean) => {
    setGuestIsFamily(isFamily);
    if (isFamily) {
      const newGuestItems: Item[] = [];
      event.days.forEach((day: Day, index: number) => {
        day.items?.forEach((e: Ticket) => {
          const newItem: Item = {
            name: `Day ${index + 1}: ${e.name} (Family)`,
            quantity: 0,
            served: 0,
            price: e.familyGuestPrice,
          };

          const newItemKids: Item = {
            name: `Day ${index + 1}: ${e.name} (Kids)`,
            quantity: 0,
            served: 0,
            price: e.kidsGuestPrice,
          };

          newGuestItems.push(newItem);
          newGuestItems.push(newItemKids);
        });
      });
      setGuestItems(newGuestItems);
    } else {
      const newGuestItems: Item[] = [];
      event.days.forEach((day: Day, index: number) => {
        day.items?.forEach((e: Ticket) => {
          const newItem: Item = {
            name: `Day ${index + 1}: ${e.name} (Single)`,
            quantity: 0,
            served: 0,
            price: e.singleGuestPrice,
          };

          newGuestItems.push(newItem);
        });
      });
      setGuestItems(newGuestItems);
    }
  };

  return (
    <div className="p-6 mx-auto">
      <Card>
        <CardContent className="p-4">
          {/* <img
						src={event.imgURL}
						alt={event.title}
						className="w-full object-cover rounded-lg mb-4"
					/> */}

          <Tabs defaultValue="info" className="">
            <TabsList>
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="booking">Booking</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
              <h1 className="text-center text-4xl font-bold mb-2">
                {event.title}
              </h1>
              <div
                className="text-muted-foreground mb-4 mt-4 description"
                dangerouslySetInnerHTML={{
                  __html: `<div> ${event.description} </div>`,
                }}
              ></div>

              <p>
                <strong>Start:</strong>{" "}
                {new Date(event.startDate).toLocaleString()}
              </p>
              <p>
                <strong>End:</strong> {new Date(event.endDate).toLocaleString()}
              </p>

              {event.days.map((day) => (
                <>
                <Separator className="mt-10"/>
                  <h2 className="text-xl mt-5 font-semibold">
                    {day.description}
                  </h2>

                  <Table>
                    <TableHeader>
                      <TableHead>Item</TableHead>
                      <TableHead>Member Price (Single)</TableHead>
                      <TableHead>Member Price (Family)</TableHead>
                      <TableHead>Member Price (Kids)</TableHead>
                      <TableHead>Guest Price (Single)</TableHead>
                      <TableHead>Guest Price (Family)</TableHead>
                      <TableHead>Guest Price (Kids)</TableHead>
                    </TableHeader>

                    <TableBody>
                        {day.items.map(item=>(
                          <TableRow>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.singleMemberPrice}</TableCell>
                            <TableCell>{item.familyMemberPrice}</TableCell>
                            <TableCell>{item.kidsMemberPrice}</TableCell>
                            <TableCell>{item.singleGuestPrice}</TableCell>
                            <TableCell>{item.familyGuestPrice}</TableCell>
                            <TableCell>{item.kidsGuestPrice}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </>
              ))}
            </TabsContent>
            <TabsContent value="booking">
              <div className="mt-6 space-y-4">
                <Tabs defaultValue="memberBooking" className="">
                  <TabsList>
                    <TabsTrigger value="memberBooking">Member</TabsTrigger>
                    {isGuestOrder && (
                      <TabsTrigger value="guestBooking">Guest</TabsTrigger>
                    )}
                  </TabsList>
                  <TabsContent value="memberBooking">
                    <div className="mt-6 space-y-4">
                      <h2 className="text-xl font-semibold">Member Booking</h2>

                      <div className="flex items-center gap-3">
                        <Checkbox
                          onCheckedChange={(checked: boolean) => {
                            changeIsFamily(checked);
                          }}
                        ></Checkbox>
                        <Label>Is Family</Label>
                      </div>

                      <div className="flex items-center gap-3">
                        <Checkbox
                          onCheckedChange={(checked: boolean) => {
                            setIsGuestOrder(checked);
                          }}
                        ></Checkbox>
                        <Label>Guest Booking</Label>
                      </div>

                      <Separator />

                      {items.map((item, index) => (
                        // <div key={item.name} className="flex items-center gap-4">
                        //   <Input type="number" min={0} defaultValue={0} className="w-24" onChange={(e) => changeItems(item.name, Number(e.target.value))} />
                        <>
                          <div
                            key={item.name}
                            className="flex w-full justify-between space-x-2"
                          >
                            <Label className="min-w-[100px] capitalize">
                              {item.name} - AED {item.price}
                            </Label>

                            <div className="flex items-center1 space-x-2">
                              <Button
                                className="font-extrabold"
                                onClick={() =>
                                  changeItems(item.name, item.quantity, -1)
                                }
                              >
                                -
                              </Button>
                              <Input
                                type="number"
                                min={0}
                                // defaultValue={0}
                                className="w-24"
                                value={item.quantity}
                                onChange={() =>
                                  changeItems(item.name, item.quantity, 0)
                                }
                              />
                              <Button
                                className="font-extrabold"
                                onClick={() =>
                                  changeItems(item.name, item.quantity, 1)
                                }
                              >
                                +
                              </Button>
                            </div>
                          </div>
                          {isFamily &&
                            !(
                              (index + 1) %
                              (event.days[0].items.length * 2)
                            ) && <Separator></Separator>}
                          {!isFamily &&
                            !((index + 1) % event.days[0].items.length) && (
                              <Separator></Separator>
                            )}
                        </>
                        // </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="guestBooking">
                    <div className="mt-6 space-y-4">
                      <h2 className="text-xl font-semibold">Guest Booking</h2>

                      <Label htmlFor="email">Guest Name</Label>
                      <Input
                        type="text"
                        value={String(guestName)}
                        onChange={(e) => setGuestName(e.target.value)}
                      ></Input>

                      <div className="flex items-center gap-3">
                        <Checkbox
                          onCheckedChange={(checked: boolean) => {
                            changeGuestIsFamily(checked);
                          }}
                        ></Checkbox>
                        <Label>Is Guest Family</Label>
                      </div>

                      <Label htmlFor="email">Adult Count</Label>
                      <Input
                        type="number"
                        min={0}
                        // defaultValue={0}
                        className="w-24"
                        value={guestAdultCount}
                        onChange={(e) =>
                          setGuestAdultCount(Number(e.target.value))
                        }
                      />

                      {guestIsFamily && (
                        <>
                          <Label htmlFor="email">Child Count</Label>
                          <Input
                            type="number"
                            min={0}
                            // defaultValue={0}
                            className="w-24"
                            value={guestChildCount}
                            onChange={(e) =>
                              setGuestChildCount(Number(e.target.value))
                            }
                          />
                        </>
                      )}

                      {guestItems.map((item, index) => (
                        // <div key={item.name} className="flex items-center gap-4">
                        //   <Input type="number" min={0} defaultValue={0} className="w-24" onChange={(e) => changeItems(item.name, Number(e.target.value))} />
                        <>
                          <div
                            key={item.name}
                            className="flex w-full justify-between space-x-2"
                          >
                            <Label className="min-w-[100px] capitalize">
                              {item.name} - AED {item.price}
                            </Label>

                            <div className="flex items-center1 space-x-2">
                              <Button
                                className="font-extrabold"
                                onClick={() =>
                                  changeGuestItems(item.name, item.quantity, -1)
                                }
                              >
                                -
                              </Button>
                              <Input
                                type="number"
                                min={0}
                                // defaultValue={0}
                                className="w-24"
                                value={item.quantity}
                                onChange={() =>
                                  changeGuestItems(item.name, item.quantity, 0)
                                }
                              />
                              <Button
                                className="font-extrabold"
                                onClick={() =>
                                  changeGuestItems(item.name, item.quantity, 1)
                                }
                              >
                                +
                              </Button>
                            </div>
                          </div>
                          {/* </div> */}

                          {guestIsFamily &&
                            !(
                              (index + 1) %
                              (event.days[0].items.length * 2)
                            ) && <Separator></Separator>}
                          {!guestIsFamily &&
                            !((index + 1) % event.days[0].items.length) && (
                              <Separator></Separator>
                            )}
                        </>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="mt-6">
                <p className="font-extrabold">Total Price: AED {totalPrice}</p>
                <Button
                  disabled={totalPrice === 0}
                  className="mt-2"
                  onClick={() => setDialogOpen(true)}
                >
                  Buy items
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {items.map((item) =>
              item.quantity > 0 ? (
                <p key={item.name}>{` ${item.name} ( ${item.price} ) X ${
                  item.quantity
                }  = ₹${item.price * item.quantity}`}</p>
              ) : null
            )}
            { isGuestOrder &&<p className="font-semibold mt-2">Guest Item</p>}
            {guestItems.map((item) =>
              item.quantity > 0 ? (
                <p key={item.name}>{` ${item.name} ( ${item.price} ) X ${
                  item.quantity
                }  = ₹${item.price * item.quantity}`}</p>
              ) : null
            )}
            <p className="font-semibold mt-2">
              Total - Member : AED {totalPrice}
            </p>
            <p className="font-semibold mt-2">
              Total - Guest : AED {totalGuestPrice}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>

            {status === "authenticated" ? (
              <Button onClick={handlePay}>Confirm</Button>
            ) : (
              <Button onClick={handleUnloggedPay}>Login and Confirm</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
