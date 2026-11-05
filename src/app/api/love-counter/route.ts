import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let counter = await prisma.loveCounter.findFirst();

    if (!counter) {
      counter = await prisma.loveCounter.create({
        data: { count: 0 },
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
    let counter = await prisma.loveCounter.findFirst();

    if (!counter) {
      counter = await prisma.loveCounter.create({
        data: { count: 1 },
      });
    } else {
      counter = await prisma.loveCounter.update({
        where: { id: counter.id },
        data: { count: { increment: 1 } },
      });
    }

    return NextResponse.json({ count: counter.count });
  } catch (error) {
    console.error("Erro ao incrementar contador:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}