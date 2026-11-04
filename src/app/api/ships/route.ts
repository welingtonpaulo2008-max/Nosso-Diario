import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const ships = await prisma.ship.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(ships);
  } catch (error) {
    console.error("Erro ao buscar ships:", error);
    return NextResponse.json({ error: "Erro interno ao buscar ships" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { author, shipName, universe, trope, whyWeMatch, quote, imageUrl } = await req.json();

    if (!shipName || !whyWeMatch) {
      return NextResponse.json(
        { error: "Nome do ship e justificativa são obrigatórios" },
        { status: 400 }
      );
    }

    const newShip = await prisma.ship.create({
      data: {
        author: author === "Sunshine" ? "Sunshine" : "Moon",
        shipName: shipName.trim(),
        universe: universe?.trim() || null,
        trope: trope?.trim() || "Nossa Sintonia",
        whyWeMatch: whyWeMatch.trim(),
        quote: quote?.trim() || null,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json(newShip, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar ship:", error);
    return NextResponse.json({ error: "Erro interno ao salvar ship" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, author, shipName, universe, trope, whyWeMatch, quote, imageUrl } = await req.json();

    if (!id || !shipName || !whyWeMatch) {
      return NextResponse.json(
        { error: "Dados incompletos para edição" },
        { status: 400 }
      );
    }

    const updatedShip = await prisma.ship.update({
      where: { id },
      data: {
        author: author === "Sunshine" ? "Sunshine" : "Moon",
        shipName: shipName.trim(),
        universe: universe?.trim() || null,
        trope: trope?.trim() || "Nossa Sintonia",
        whyWeMatch: whyWeMatch.trim(),
        quote: quote?.trim() || null,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json(updatedShip);
  } catch (error) {
    console.error("Erro ao editar ship:", error);
    return NextResponse.json({ error: "Erro interno ao editar ship" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
    }

    await prisma.ship.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir ship:", error);
    return NextResponse.json({ error: "Erro interno ao excluir ship" }, { status: 500 });
  }
}