import { NextRequest, NextResponse } from 'next/server';
import  prisma  from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: eventId } = params;
  const body = await req.json();

  const { attendeeId, items } = body;

  if (!attendeeId || !items) {
    return NextResponse.json({ error: 'Missing attendeeId or items' }, { status: 400 });
  }

  try {
    // Optional: Validate event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Save order
    const newOrder = await prisma.order.create({
      data: {
        attendeeId,
        eventId,
        items, // raw JSON object
      },
    });

    return NextResponse.json(newOrder);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
