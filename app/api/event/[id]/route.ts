import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NextRequestWithAuth } from "next-auth/middleware";

import { Item, Order } from "@/lib/types";
import { getToken } from "next-auth/jwt";



export async function GET(req: NextRequest,{ params }: { params: Promise<{ id: string }>}) {
  const id = (await params).id;

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
  } catch {
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}

export async function POST(req: NextRequestWithAuth, { params }: { params: Promise<{ id: string }>}) {
  try {
    const param = await params;
    const body = await req.json();

    // const token = req.nextauth.token;
    const token = await getToken({ req });
    const attendeeId = token ? token.id : "null";

    const items: Item[] = body.items;

    items.forEach((e) => (e.served = 0));

    let total = 0;

    items.forEach(item=>{
      total+=item.quantity*item.price;
    })


    if (!items) {
      return NextResponse.json({ error: "Missing items" }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: param.id },
    });

    if (!event) {
      console.log('event');
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const attendee = await prisma.attendee.findUnique({
      where: { id: attendeeId },
    });

    if (!attendee) {
      console.log('event2');

      return NextResponse.json({ error: 'Attendee not found' }, { status: 404 });
    }

    const id = param.id;

    const newOrder: Order = {
      attendeeId: attendeeId,
      eventId: id,
      items: items,
    };

    console.log(newOrder);

    // Save order
    await prisma.order.create({
      data: {
    attendeeId:attendeeId,
    eventId:id,
    // @ts-expect-error : items can be anythin
    items:items
      }
    });


    await prisma.attendee.update({
      where:{id:attendeeId},
      data:{
        balance:{
          decrement:total,
        }
      }
    })

    return NextResponse.json(newOrder);
  } catch{
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
