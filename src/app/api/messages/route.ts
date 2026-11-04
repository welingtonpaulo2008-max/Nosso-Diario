import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return NextResponse.json({ error: "Erro interno ao buscar mensagens" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { sender, content } = await req.json();

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "Mensagem vazia não é permitida" }, { status: 400 });
    }

    const newMessage = await prisma.message.create({
      data: {
        sender: sender?.trim() || "Isadora",
        content: content.trim(),
      },
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar mensagem:", error);
    return NextResponse.json({ error: "Erro interno ao salvar mensagem" }, { status: 500 });
  }
}