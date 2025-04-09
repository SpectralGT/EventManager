import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NextRequestWithAuth } from "next-auth/middleware";

import { AttendeeOrder, Item, Order, Profile } from "@/lib/types";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  

  const param = await params;
  // const token = req.nextauth.token;
  const token = await getToken({ req });
  const attendeeId = token ? token.id : "null";

  const attendeeDetails = await prisma.attendee.findUnique({
    where: { id: attendeeId },
    select:{username:true,balance:true}
  });

  const orders = await prisma.order.findMany({
    where:{attendeeId:attendeeId},
    select:{
        id:true,
        attendeeId:true,
        eventId:true,
        items:true,
        createdAt:true        
    }
    
  })

const newOrders:AttendeeOrder[] = [];

orders.forEach(async order =>{

    const eventTitle = await prisma.event.findUnique({
        where:{id:order.id},
        select:{title:true}
    })

    const newOrder:AttendeeOrder = {
        id : order.id,
        attendeeId : order.attendeeId,
        eventId : order.eventId,
        eventTitle : eventTitle!.title,
        //@ts-ignore
        items:order.items,
        createdAt:order.createdAt.toISOString()
    }
    newOrders.push(newOrder);    
})

  const profile:Profile = {
    id : attendeeId,
    username : attendeeDetails!.username,
    balance : Number(attendeeDetails!.balance),
    orders : newOrders
  }
  try {

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}
