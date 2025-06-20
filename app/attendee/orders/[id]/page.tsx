"use client";

import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Item, OrderByID } from "@/lib/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useQRCode } from "next-qrcode";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Order() {
  const { id } = useParams();

  const [order, setOrder] = useState<OrderByID | null>(null);
  const [total, setTotal] = useState<number>(0);

  const { SVG } = useQRCode();

  useEffect(() => {
    fetch(`/api/attendee/order/${id}`) // assumes API route returns order
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);

        if (data && data.memberItems) {
          let sum = 0;
          data.memberItems.forEach((item: Item) => {
            sum += item.quantity * item.price;
          });
          setTotal(sum);
        }
      });
  }, [id]);

  if (!order) return <p className="p-6">Loading ...</p>;

  return (
    <div className="p-6">
      <div className="bg-white">
        {/* <QRCode size={256} style={{ height: "auto", maxWidth: "100%", width: "100%" }} value={`${order.id}`} viewBox={`0 0 256 256`} /> */}
        {/* Canvas styles are in the global stylesheet */}
        <SVG
          text={`${order.id}`}
          options={{
            errorCorrectionLevel: "M",
            // margin: 4,
            // scale: 4,
            // width: 256,

            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
          }}
        />
      </div>

      <h1 className="text-2xl font-bold mt-10">
        Event : <span className="text-primary">{order.eventTitle}</span>
      </h1>
      <h1 className="text-2xl font-bold mb-4">
        Total : <span className="text-primary">{total.toString()}</span>
      </h1>

      <Separator />

      <h1 className="text-2xl font-bold mb-4 mt-5 text-center">Items</h1>
      <div className="flex flex-col gap-6">
        {order.memberItems ? (
          <Table>
            <TableHeader>
              <TableRow className="text-lg">
                <TableHead className="">Item</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Served</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {order.memberItems.map((item) => (
                <TableRow key={item.name}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    {item.served}
                    {" / "}
                    {item.quantity}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.price * item.quantity}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div> No Items </div>
        )}
      </div>

      {order.isGuestOrder && (
        <>
          <Separator />

          <h1 className="text-2xl font-bold mb-4 mt-5 text-center">
            Guest Booking
          </h1>

          <h1 className="text-2xl font-bold mb-4">
            Guest Name : <span className="text-primary">{order.guestName}</span>
          </h1>
          <h1 className="text-2xl font-bold mb-4">
            Guest Adult Count :{" "}
            <span className="text-primary">{order.guestAdultCount}</span>
          </h1>
          <h1 className="text-2xl font-bold mb-4">
            Guest Child Count :{" "}
            <span className="text-primary">{order.guestChildCount}</span>
          </h1>

          <h1 className="text-2xl font-bold mb-4 mt-5 text-center">
            Guest Items
          </h1>
          <div className="flex flex-col gap-6">
            {order.guestItems ? (
              <Table>
                <TableHeader>
                  <TableRow className="text-lg">
                    <TableHead className="">Item</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Served</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {order.guestItems.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        {item.served}
                        {" / "}
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.price * item.quantity}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div> No Items </div>
            )}
          </div>
        </>
      )}

      <Link href={`/attendee/orders/edit/${id}`}>
        <Button className="text-black mt-10">
          Edit Booking
        </Button>
      </Link>
    </div>
  );
}
