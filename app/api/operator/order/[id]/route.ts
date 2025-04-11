// pages/api/order/[id].ts
import prisma from "@/lib/prisma"; // adjust to your prisma client path
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import { Item } from "@/lib/types";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id: id as string },
      select: {
        id: true,
        attendeeId: true,
        eventId: true,
        items: true,
        createdAt: true,
      },
    });

    console.log("GOT ORDER");

    return NextResponse.json(order);
  } catch (error) {
    console.log("ORDER NOT FOUND");
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (req.method === "PATCH") {
    try {
      const param = await params;
      const id = param.id;
      const body = await req.json();
      const items = body.items;

      if (!Array.isArray(items)) return NextResponse.json({ error: "No items in Ordeer Patch" }, { status: 500 });

      const newOrder = await prisma.order.update({
        where: { id: id as string },
        data: { items: items },
      });

      return NextResponse.json(newOrder);
    } catch (error) {
      console.error("Update failed:", error);
      return NextResponse.json({ error: "Failed to Update Order Items" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Method no allowed" }, { status: 405 });
}
