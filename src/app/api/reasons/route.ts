import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let reasons = await prisma.reason.findMany({
      orderBy: { createdAt: "asc" },
    });

    // Se estiver vazio, insere os motivos iniciais fofos
    if (reasons.length === 0) {
      await prisma.reason.createMany({
        data: [
          {
            author: "Moon",
            title: "O Seu Sorriso",
            description: "Aquele jeito como seu rosto se ilumina e os seus olhos brilham quando você dá uma risada sincera comigo.",
          },
          {
            author: "Moon",
            title: "O Seu Cuidado",
            description: "A preocupação doce, as mensagens de carinho e a forma como você faz eu me sentir o cara mais especial desse mundo.",
          },
          {
            author: "Sunshine",
            title: "Suas Manias Fofas",
            description: "Aquele jeitinho que só você tem de falar, de fazer bico ou de implicar comigo que me desmonta por completo.",
          },
          {
            author: "Moon",
            title: "O Seu Abraço",
            description: "O melhor lugar do universo. É onde tudo fica em paz e onde eu tenho certeza de que estou no lugar certo.",
          },
        ],
      });

      reasons = await prisma.reason.findMany({
        orderBy: { createdAt: "asc" },
      });
    }

    return NextResponse.json(reasons);
  } catch (error) {
    console.error("Erro ao buscar motivos:", error);
    return NextResponse.json({ error: "Erro interno ao buscar motivos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { author, title, description } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ error: "Título e descrição são obrigatórios" }, { status: 400 });
    }

    const newReason = await prisma.reason.create({
      data: {
        author: author === "Sunshine" ? "Sunshine" : "Moon",
        title: title.trim(),
        description: description.trim(),
      },
    });

    return NextResponse.json(newReason, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar motivo:", error);
    return NextResponse.json({ error: "Erro interno ao salvar motivo" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

    await prisma.reason.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir motivo:", error);
    return NextResponse.json({ error: "Erro interno ao excluir motivo" }, { status: 500 });
  }
}