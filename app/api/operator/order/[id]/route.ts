// pages/api/order/[id].ts
import prisma  from "@/lib/prisma"; // adjust to your prisma client path
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";


export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    try {
      const order = await prisma.order.findUnique({
        where:{id:id as string},
        select:{
            id: true,
            attendeeId: true,
            eventId: true,
            items: true,
            createdAt: true,
        }
      });
  
      return res.json(order);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch order' });
    }
  }


export async function PATCH(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "PATCH") {
    try {
      const { items } = req.body;

      // Optional: Validate `items` is an array
      if (!Array.isArray(items)) {
        return res.status(400).json({ error: "Invalid items array" });
      }

      await prisma.order.update({
        where: { id: id as string },
        data: { items:items },
      });

      return res.status(200);
    } catch (error) {
      console.error("Update failed:", error);
      return res.status(500).json({ error: "Failed to update order items" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
