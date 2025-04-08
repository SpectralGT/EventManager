// app/api/event/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { startDate: 'asc' },
      
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

    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
