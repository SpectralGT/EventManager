import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { OrderByID } from "@/lib/types";
import { getToken } from "next-auth/jwt";

// async function getNewOrders(
//   orders: {
//     id: string;
//     attendeeId: string;
//     eventId: string;
//     items: Prisma.JsonValue;
//     createdAt: Date;
//   }[]
// ) {

//   const newOrders: AttendeeOrder[] = [];
//   await Promise.all(
//     orders.map(async (order) => {
//       const eventTitle = await prisma.event.findUnique({
//         where: { id: order.eventId },
//         select: { title: true },
//       });

//       const newOrder:AttendeeOrder = {
//         id: order.id,
//         attendeeId: order.attendeeId,
//         eventId: order.eventId,
//         eventTitle: eventTitle ? eventTitle.title : "Not Found",
//         // @ts-ignore
//         items: order.items,
//         createdAt: order.createdAt.toISOString(),
//       };

//       newOrders.push(newOrder);
//     })
//   );

//   return newOrders;
// }


export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }>}) {
  try {
    const id = (await params).id;

    console.log();
    // const token = req.nextauth.token;
    const token = await getToken({ req });
    const attendeeId = token ? token.id : "null";

    const order = await prisma.order.findUnique({
      where: { id: id, attendeeId: attendeeId },
      select: {
        id: true,
        attendeeId: true,
        eventId: true,
        items: true,
        createdAt: true,
      },
    });

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const eventTitle = await prisma.event.findUnique({
      where: { id: order.eventId },
      select: { title: true },
    });

    const newOrder: OrderByID = {
      id: order.id,
      attendeeId: order.attendeeId,
      eventId: order.eventId,
      eventTitle: eventTitle ? eventTitle.title : "null",
      createdAt: order.createdAt.toDateString(),
      // @ts-expect-error : items can be anything
      items: order.items,
    };

    return NextResponse.json(newOrder);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}
