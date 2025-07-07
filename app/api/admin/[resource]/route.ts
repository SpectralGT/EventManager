'use server'

import { defaultHandler } from "ra-data-simple-prisma";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const handler = async (req: Request) => {
  const body = await req.json();
  const result = await defaultHandler(body, prisma);
  return NextResponse.json(result);
};

export { handler as GET, handler as POST };