import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { OrderByID, Item, Order } from "@/lib/types";
import { getToken } from "next-auth/jwt";

import { NextRequestWithAuth } from "next-auth/middleware";
import { JsonValue } from "@prisma/client/runtime/library";

// Getting Order by Id
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
        createdAt: true,
        memberItems: true,
        isGuestOrder: true,
        guestName: true,
        guestIsFamily: true,
        guestAdultCount: true,
        guestChildCount: true,
        guestItems: true,
      },
    });

    // if order is not found
    if (!order)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });

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
      memberItems: order.memberItems,
      isGuestOrder: order.isGuestOrder,
      guestName: order.guestName,
      guestIsFamily: order.guestIsFamily,
      guestAdultCount: order.guestAdultCount,
      guestChildCount: order.guestChildCount,
      // @ts-expect-error : items can be anything
      guestItems: order.guestItems,
    };

    // returning the new Order object
    return NextResponse.json(newOrder);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequestWithAuth,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const param = await params;
    const body = await req.json();
    const id = param.id;

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

    const oldOrder = await prisma.order.findUnique({
      where: { id: id },
      select: { memberItems: true },
    });

    if (!oldOrder) {
      return NextResponse.json({ error: "No old Order" }, { status: 400 });
    }

    const oldItems = oldOrder.memberItems as unknown as Item[];

    let oldTotal = 0;

    oldItems.forEach((item) => {
      oldTotal += item.quantity * item.price;
    });

    if (!guestIsFamily) {
      guestChildCount = 0;
    }
    if (!isGuestOrder) {
      guestName = "";
      guestIsFamily = false;
      guestAdultCount = 0;
      guestChildCount = 0;
      guestItems = [];
    }

    memberItems.forEach((e) => (e.served = 0));
    guestItems.forEach((e) => (e.served = 0));
    let total = 0;

    memberItems.forEach((item) => {
      total += item.quantity * item.price;
    });

    if (!memberItems) {
      return NextResponse.json({ error: "Missing items" }, { status: 400 });
    }

    const attendee = await prisma.attendee.findUnique({
      where: { id: attendeeId },
    });

    if (!attendee) {
      console.log("attendee erorr");
      return NextResponse.json(
        { error: "Attendee not found" },
        { status: 404 }
      );
    }

    // Save order
    await prisma.order.update({
      where: {
        id: id,
      },
      data: {
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

    console.log(oldTotal);
    console.log(total);

    await prisma.attendee.update({
      where: { id: attendeeId },
      data: {
        balance: {
          increment: oldTotal,
        },
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

    return NextResponse.json({ message: "updated" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
