"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { OrderByID } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { totalmem } from "os";
import { useEffect, useState } from "react";

export default function Order() {
  const { id } = useParams();

  const [order, setOrder] = useState<OrderByID | null>(null);
  const [total, setTotal] = useState<Number>(0);

  useEffect(() => {
    fetch(`/api/attendee/order/${id}`) // assumes API route returns profile
      .then((res) => res.json())
      .then((data) => {

        setOrder(data);

        if(data && data.items){
          let sum = 0;
          data.items.forEach((item:any)=>{sum+= item.quantity*item.price})
          setTotal(sum);
        }
      });
  }, []);

  if (!order) return <p className="p-6">Loading ...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Event : <span className="text-primary">{order.eventTitle}</span>
      </h1>
      <h1 className="text-2xl font-bold mb-4">
        Total : <span className="text-primary">{total.toString()}</span>
      </h1>

      <Separator />

      <h1 className="text-2xl font-bold mb-4 mt-5 text-center">Items</h1>
      <div className="flex flex-col gap-6">
        {order.items ? (
          <Table>
            <TableHeader>
              <TableRow className="text-lg">
                <TableHead className="">Item</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.name}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="text-right" >{item.price * item.quantity}</TableCell>
                </TableRow>

                // <Card className="h-full">
                //   <CardContent className="p-4">
                //     <h2 className="text-xl font-semibold mb-1">{item.name}</h2>
                //     <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                //       <strong>QTY : </strong> {item.quantity}
                //     </p>

                //     <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                //       <strong>QTY : </strong> {item.}
                //     </p>
                //   </CardContent>
                // </Card>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div> No Items </div>
        )}
      </div>
    </div>
  );
}
