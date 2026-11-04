import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const entries = await prisma.journalEntry.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(entries);
  } catch (error) {
    console.error("Erro ao buscar diário:", error);
    return NextResponse.json({ error: "Erro interno ao buscar diário" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { author, title, content, category } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Título e conteúdo são obrigatórios" }, { status: 400 });
    }

    const newEntry = await prisma.journalEntry.create({
      data: {
        author: author === "Sunshine" ? "Sunshine" : "Moon",
        title: title.trim(),
        content: content.trim(),
        category: category?.trim() || "O que vi você fazer",
      },
    });

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar diário:", error);
    return NextResponse.json({ error: "Erro interno ao salvar diário" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, author, title, content, category } = await req.json();

    if (!id || !title || !content) {
      return NextResponse.json({ error: "Dados incompletos para edição" }, { status: 400 });
    }

    const updatedEntry = await prisma.journalEntry.update({
      where: { id },
      data: {
        author: author === "Sunshine" ? "Sunshine" : "Moon",
        title: title.trim(),
        content: content.trim(),
        category: category?.trim() || "O que vi você fazer",
      },
    });

    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error("Erro ao editar diário:", error);
    return NextResponse.json({ error: "Erro interno ao editar diário" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

    await prisma.journalEntry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir diário:", error);
    return NextResponse.json({ error: "Erro interno ao excluir diário" }, { status: 500 });
  }
}