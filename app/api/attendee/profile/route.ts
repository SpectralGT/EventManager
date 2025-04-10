import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NextRequestWithAuth } from "next-auth/middleware";

import { AttendeeOrder, Item, Order, Profile } from "@/lib/types";
import { getToken } from "next-auth/jwt";
import { Prisma } from "@prisma/client";

async function getNewOrders(
  orders: {
    id: string;
    attendeeId: string;
    eventId: string;
    items: Prisma.JsonValue;
    createdAt: Date;
  }[]
) {


  const newOrders: AttendeeOrder[] = [];
  await Promise.all(
    orders.map(async (order) => {
      const eventTitle = await prisma.event.findUnique({
        where: { id: order.eventId },
        select: { title: true },
      });

      const newOrder:AttendeeOrder = {
        id: order.id,
        attendeeId: order.attendeeId,
        eventId: order.eventId,
        eventTitle: eventTitle ? eventTitle.title : "Not Found",
        // @ts-ignore
        items: order.items,
        createdAt: order.createdAt.toISOString(),
      };

      newOrders.push(newOrder);
    })
  );

  return newOrders;
}

export async function GET(req: NextRequest) {
  try {
    // const token = req.nextauth.token;
    const token = await getToken({ req });
    const attendeeId = token ? token.id : "null";

    const attendeeDetails = await prisma.attendee.findUnique({
      where: { id: attendeeId },
      select: { username: true, balance: true },
    });

    console.log("UPDATING 1 : >>>");

    const orders = await prisma.order.findMany({
      where: { attendeeId: attendeeId },
      select: {
        id: true,
        attendeeId: true,
        eventId: true,
        items: true,
        createdAt: true,
      },
    });

    console.log("UPDATING 2: >>>");

    const newOrders = await getNewOrders(orders);

    let profile: Profile = {
      id: attendeeId,
      username: attendeeDetails!.username,
      balance: Number(attendeeDetails!.balance),
      orders: newOrders,
    };

    profile.orders = newOrders;

    console.log("PROFILE : >>>");
    // console.log(profile.orders);
    return NextResponse.json(profile);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}
