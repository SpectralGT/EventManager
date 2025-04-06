// -- Example for Next App router --
// /app/api/[resource]/route.ts <= catch all resource requests

import { defaultHandler } from "ra-data-simple-prisma";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";



const handler = async (req: Request) => {
  const body = await req.json();
  const prismaClient = new PrismaClient();
  const result = await defaultHandler(body, prismaClient);
  return NextResponse.json(result);
};

export { handler as GET, handler as POST };