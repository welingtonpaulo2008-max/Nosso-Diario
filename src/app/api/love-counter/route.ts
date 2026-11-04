import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let counter = await prisma.loveCounter.findUnique({
      where: { id: 1 },
    });

    if (!counter) {
      counter = await prisma.loveCounter.create({
        data: { id: 1, count: 0 },
      });
    }

    return NextResponse.json({ count: counter.count });
  } catch (error) {
    console.error("Erro ao carregar contador:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const counter = await prisma.loveCounter.upsert({
      where: { id: 1 },
      update: { count: { increment: 1 } },
      create: { id: 1, count: 1 },
    });

    return NextResponse.json({ count: counter.count });
  } catch (error) {
    console.error("Erro ao incrementar contador:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}