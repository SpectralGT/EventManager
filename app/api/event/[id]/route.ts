import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NextRequestWithAuth } from "next-auth/middleware";

import { Item, Order } from "@/lib/types";
import { getToken } from "next-auth/jwt";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
        items: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequestWithAuth,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const param = await params;
    const body = await req.json();

    // const token = req.nextauth.token;
    const token = await getToken({ req });
    const attendeeId = token ? token.id : "null";

    let memberItems: Item[] = body.memberItems;
    let isGuestOrder: boolean = body.isGuestOrder;
    let guestName: string = body.guestName;
    let guestIsFamily: boolean = body.guestIsFamily;
    let guestAdultCount: number = body.guestAdultCount;
    let guestChildCount: number = body.guestChildCount;
    let guestItems: Item[] = body.guestItems;


    if(!guestIsFamily){guestChildCount = 0};
    if(!isGuestOrder){guestName='';guestIsFamily=false;guestAdultCount=0;guestChildCount=0;guestItems=[]};

    memberItems.forEach((e) => (e.served = 0));
    guestItems.forEach((e) => (e.served = 0));
    let total = 0;

    memberItems.forEach((item) => {
      total += item.quantity * item.price;
    });

    if (!memberItems) {
      return NextResponse.json({ error: "Missing items" }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: param.id },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const attendee = await prisma.attendee.findUnique({
      where: { id: attendeeId },
    });

    if (!attendee) {
      return NextResponse.json(
        { error: "Attendee not found" },
        { status: 404 }
      );
    }

    const id = param.id;

    const newOrder: Order = {
      attendeeId: attendeeId,
      eventId: id,
      memberItems: memberItems,
      isGuestOrder: isGuestOrder,
      guestName: guestName,
      guestIsFamily: guestIsFamily,
      guestAdultCount: guestAdultCount,
      guestChildCount: guestChildCount,
      guestItems: guestItems,
    };

    console.log(newOrder);

    // Save order
    await prisma.order.create({
      data: {
        attendeeId: attendeeId,
        eventId: id,
        // @ts-expect-error : items can be anythin
        memberItems: memberItems,
        isGuestOrder: isGuestOrder,
        guestName: guestName,
        guestIsFamily: guestIsFamily,
        guestAdultCount: guestAdultCount,
        guestChildCount: guestChildCount,
        // @ts-expect-error : items can be anythin
        guestItems: guestItems,
      },
    });

    await prisma.attendee.update({
      where: { id: attendeeId },
      data: {
        balance: {
          decrement: total,
        },
      },
    });

    return NextResponse.json(newOrder);
  } catch(error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
