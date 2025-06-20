"use client";

import { useEffect, useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams } from "next/navigation";
import { AttendeeOrder, Item } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default function OrderServePage() {

  //Getting the Order Id from URL
  const { id } = useParams();

  //Setting States
  const [order, setOrder] = useState<AttendeeOrder>();
  const [items, setItems] = useState<Item[]>([]);
  const [guestItems, setGuestItems] = useState<Item[]>([]);
  const [newItems, setNewItems] = useState<Item[]>([]);
  const [newGuestItems, setNewGuestItems] = useState<Item[]>([]);

  // A ref to hold arrays of refs per item
  const checkboxRefs = useRef<Array<Array<HTMLButtonElement | null>>>([]);
  const guestCheckboxRefs = useRef<Array<Array<HTMLButtonElement | null>>>([]);

  useEffect(() => {

    //Getting Order Details and Setting States
    fetch(`/api/operator/order/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data.memberItems)) return <p className="p-6">Error loading items</p>;

        setItems(data.memberItems);
        setNewItems(data.memberItems);
        setOrder(data);
        setGuestItems(data.guestItems);
        setNewGuestItems(data.guestItems);
        checkboxRefs.current = data.memberItems.map((item: Item) => Array(item.quantity).fill(null));
        guestCheckboxRefs.current = data.guestItems.map((item: Item) => Array(item.quantity).fill(null));
      });
  }, [id]);


  //Requesting to Update the Order
  const postItems = async () => {
    const res = await fetch(`/api/operator/order/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        memberItems: newItems,
        guestItems: newGuestItems,
      }),
    });

    if (res.ok) {
      alert("Order updated successfully!");
      redirect(`/operator/scanner`);
    } else {
      alert("Order failed.");
    }
  };

  //Updating the serve count for a Item in Order
  const updateServedCount = async (itemIndex: number) => {
    const checkboxes = checkboxRefs.current[itemIndex];
    const checkedCount = checkboxes.filter((cb) => cb?.getAttribute("data-state") === "checked").length;
    setNewItems((prev) => prev.map((item, i) => (i === itemIndex ? { ...item, served: checkedCount } : item)));
  };

//Updating the serve count for a Item in Order
  const updateGuestServedCount = async (itemIndex: number) => {
    const guestCheckboxes = guestCheckboxRefs.current[itemIndex];
    const checkedCount = guestCheckboxes.filter((cb) => cb?.getAttribute("data-state") === "checked").length;
    setNewGuestItems((prev) => prev.map((item, i) => (i === itemIndex ? { ...item, served: checkedCount } : item)));
  };

  if (!order) return <p className="p-6">Loading ...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Mark Served Items</h2>

      {/* <h1 className="text-2xl font-bold mb-4">
        Event : <span className="text-primary">{order.eventTitle}</span>
      </h1>

      <Separator /> */}

      <div className="space-y-6">
        {items.map((item, itemIndex) => (
          <div key={itemIndex}>
            <p className="mb-2 font-medium">{item.name}</p>
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: item.served }).map((_, checkboxIndex) => (
                <Checkbox
                  key={checkboxIndex}
                  defaultChecked={true}
                  disabled={checkboxIndex < item.served}
                  ref={(el) => {
                    if (!checkboxRefs.current[itemIndex]) {
                      checkboxRefs.current[itemIndex] = [];
                    }
                    checkboxRefs.current[itemIndex][checkboxIndex] = el;
                  }}
                  // onCheckedChange={() => updateServedCount(itemIndex)}
                  className="h-5 w-5"
                />
              ))}

              {Array.from({ length: item.quantity - item.served }).map((_, checkboxIndex) => (
                <Checkbox
                  key={checkboxIndex}
                  defaultChecked={false}
                  ref={(el) => {
                    if (!checkboxRefs.current[itemIndex]) {
                      checkboxRefs.current[itemIndex] = [];
                    }
                    checkboxRefs.current[itemIndex][checkboxIndex + item.served] = el;
                  }}
                  onCheckedChange={() => updateServedCount(itemIndex)}
                  className="h-5 w-5"
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Served: {item.served} / {item.quantity}
            </p>
          </div>
        ))}
      </div>


<h2 className="text-2xl font-semibold mb-6">Guest Items</h2>

      {/* <h1 className="text-2xl font-bold mb-4">
        Event : <span className="text-primary">{order.eventTitle}</span>
      </h1>

      <Separator /> */}

      <div className="space-y-6">
        {guestItems.map((item, itemIndex) => (
          <div key={itemIndex}>
            <p className="mb-2 font-medium">{item.name}</p>
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: item.served }).map((_, checkboxIndex) => (
                <Checkbox
                  key={checkboxIndex}
                  defaultChecked={true}
                  disabled={checkboxIndex < item.served}
                  ref={(el) => {
                    if (!guestCheckboxRefs.current[itemIndex]) {
                      guestCheckboxRefs.current[itemIndex] = [];
                    }
                    guestCheckboxRefs.current[itemIndex][checkboxIndex] = el;
                  }}
                  // onCheckedChange={() => updateServedCount(itemIndex)}
                  className="h-5 w-5"
                />
              ))}

              {Array.from({ length: item.quantity - item.served }).map((_, checkboxIndex) => (
                <Checkbox
                  key={checkboxIndex}
                  defaultChecked={false}
                  ref={(el) => {
                    if (!guestCheckboxRefs.current[itemIndex]) {
                      guestCheckboxRefs.current[itemIndex] = [];
                    }
                    guestCheckboxRefs.current[itemIndex][checkboxIndex + item.served] = el;
                  }}
                  onCheckedChange={() => updateGuestServedCount(itemIndex)}
                  className="h-5 w-5"
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Served: {item.served} / {item.quantity}
            </p>
          </div>
        ))}
      </div>


      <Button className="text-black mt-10" onClick={postItems}>
        Save
      </Button>
    </div>
  );
}
