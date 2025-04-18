import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { OrderByID } from "@/lib/types";
import { getToken } from "next-auth/jwt";

// Getting Order by Id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }>}) {
  try {
    //Getting id param from the URL
    const id = (await params).id;

    
    const token = await getToken({ req });
    const attendeeId = token ? token.id : "null";

    // getting order from database using prisma
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

    // if order is not found
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const eventTitle = await prisma.event.findUnique({
      where: { id: order.eventId },
      select: { title: true },
    });

    //creating a new order object with the addition of Event title
    const newOrder: OrderByID = {
      id: order.id,
      attendeeId: order.attendeeId,
      eventId: order.eventId,
      eventTitle: eventTitle ? eventTitle.title : "null",
      createdAt: order.createdAt.toDateString(),
      // @ts-expect-error : items can be anything
      items: order.items,
    };

    // returning the new Order object
    return NextResponse.json(newOrder);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}
