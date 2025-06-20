// pages/api/order/[id].ts
import prisma from "@/lib/prisma"; // adjust to your prisma client path
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest,{ params }: { params: Promise<{ id: string }>}) {
  
  try {
    const id = (await params).id;
    const order = await prisma.order.findUnique({
      where: { id: id as string },
      select: {
        id: true,
        attendeeId: true,
        eventId: true,
        memberItems: true,
        guestItems: true,
        createdAt: true,
      },
    });


    return NextResponse.json(order);
  } catch{
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest,{ params }: { params: Promise<{ id: string }>}) {
  if (req.method === "PATCH") {
    try {
      const param = await params;
      const id = param.id;
      const body = await req.json();
      const memberItems = body.memberItems;
      const guestItems = body.guestItems;

      if (!Array.isArray(memberItems)) return NextResponse.json({ error: "No items in Ordeer Patch" }, { status: 500 });

      const newOrder = await prisma.order.update({
        where: { id: id as string },
        data: { memberItems: memberItems, guestItems:guestItems },
      });

      return NextResponse.json(newOrder);
    } catch {
      return NextResponse.json({ error: "Failed to Update Order Items" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Method no allowed" }, { status: 405 });
}
