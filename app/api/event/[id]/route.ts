import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NextRequestWithAuth } from "next-auth/middleware";

import { Item,Order } from "@/lib/types";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        imgURL: true,
        startDate: true,
        endDate: true,
        tickets: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}

export async function POST(req: NextRequestWithAuth, { params }: { params: { id: string } }) {
  
  const body = await req.json();

  const token = req.nextauth.token;
  const attendeeId = token ? token.id : "null";

  try {
    const items : Item[] = body.items;

    items.forEach(e => e.served = 0);

    if (!items) {
      return NextResponse.json({ error: "Missing items" }, { status: 400 });
    }


    // const event = await prisma.event.findUnique({
    //   where: { id: eventId },
    // });

    // if (!event) {
    //   return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    // }

    const newOrder : Order = {
      attendeeId : attendeeId,
      eventId : params.id,
      items : items
    }

    const id = params.id;
    // Save order
    // await prisma.order.create({
    //   data : {
    //   attendeeId : attendeeId,
    //   eventId: id,
    //   items : items
    //   },
    // });

    console.log(items);

    return NextResponse.json(newOrder);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
