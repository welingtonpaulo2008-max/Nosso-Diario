import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [latest, totalBomDia, totalBoaNoite] = await Promise.all([
      prisma.greeting.findFirst({
        orderBy: { createdAt: "desc" },
      }),
      prisma.greeting.count({ where: { type: "bom_dia" } }),
      prisma.greeting.count({ where: { type: "boa_noite" } }),
    ]);

    return NextResponse.json({
      latest,
      counts: {
        bomDia: totalBomDia,
        boaNoite: totalBoaNoite,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar cumprimentos:", error);
    return NextResponse.json({ error: "Erro interno ao buscar cumprimentos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { type, sender } = await req.json();

    if (!type || !["bom_dia", "boa_noite"].includes(type)) {
      return NextResponse.json({ error: "Tipo de cumprimento inválido" }, { status: 400 });
    }

    const greeting = await prisma.greeting.create({
      data: {
        type,
        sender: sender === "Sunshine" ? "Sunshine" : "Moon",
      },
    });

    return NextResponse.json(greeting, { status: 201 });
  } catch (error) {
    console.error("Erro ao registrar cumprimento:", error);
    return NextResponse.json({ error: "Erro interno ao registrar cumprimento" }, { status: 500 });
  }
}
