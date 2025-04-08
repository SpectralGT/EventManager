// app/api/event/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(req: Request, { params }: Params) {
  const { id } = params;

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      select: {
        id: true,
        imgURL: true,
        title: true,
        description: true,
        startDate: true,
        endDate: true,
        // ❌ don't include `tickets` or `Order`
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
