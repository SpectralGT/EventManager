import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { AttendeeOrder, Profile } from "@/lib/types";
import { getToken } from "next-auth/jwt";
import { Prisma } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

async function getNewOrders(
  orders: {
    id: string;
    attendeeId: string;
    eventId: string;
    memberItems: JsonValue;
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

      const newOrder: AttendeeOrder = {
        id: order.id,
        attendeeId: order.attendeeId,
        eventId: order.eventId,
        eventTitle: eventTitle ? eventTitle.title : "Not Found",
        // @ts-expect-error : items can be anything
        items: order.items,
        createdAt: order.createdAt.toISOString(),
      };

      newOrders.push(newOrder);
    })
  );

  return newOrders;
}


//Getting Profile data
export async function GET(req: NextRequest) {
  try {

    // const token = req.nextauth.token;
    const token = await getToken({ req });
    const attendeeId = token ? token.id : "null";

    //Getting Username and Balance of a Attendee by Id
    const attendeeDetails = await prisma.attendee.findUnique({
      where: { id: attendeeId },
      select: { username: true, balance: true },
    });


    //Getting the orders of that Attendee
    const orders = await prisma.order.findMany({
      where: { attendeeId: attendeeId },
      select: {
        id: true,
        attendeeId: true,
        eventId: true,
        memberItems: true,
        createdAt: true,
      },
    });

    //Getting the new Orders object that was the addition of Event Title
    const newOrders = await getNewOrders(orders);

    //Create a Profile Object
    const profile: Profile = {
      id: attendeeId,
      username: attendeeDetails!.username,
      balance: Number(attendeeDetails!.balance),
      orders: newOrders,
    };

    //Setting the orders property again
    profile.orders = newOrders;


    //Returning the Profile
    return NextResponse.json(profile);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}
