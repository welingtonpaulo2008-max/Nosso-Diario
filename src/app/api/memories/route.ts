import { NextResponse } from "next/server";
import { isValidAdminRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const memories = await prisma.memory.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(memories);
  } catch (error) {
    console.error("Erro ao buscar memórias:", error);
    return NextResponse.json({ error: "Erro interno ao buscar memórias" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { author, title, date, description, mediaUrl, mediaType, password } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Título e descrição são obrigatórios" }, { status: 400 });
    }

    const shouldRequireAdmin = typeof password === "string" || (await isValidAdminRequest());
    if (shouldRequireAdmin && !(await isValidAdminRequest(password ?? null))) {
      return NextResponse.json({ error: "Senha de administrador incorreta." }, { status: 401 });
    }

    const newMemory = await prisma.memory.create({
      data: {
        author: author === "Sunshine" ? "Sunshine" : "Moon",
        title: title.trim(),
        date: date?.trim() || "Momento Especial",
        description: description.trim(),
        mediaUrl: mediaUrl || null,
        mediaType: mediaType === "video" ? "video" : "image",
      },
    });

    return NextResponse.json(newMemory, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar memória:", error);
    return NextResponse.json({ error: "Erro interno ao salvar memória" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, author, title, date, description, mediaUrl, mediaType, password } = body;

    if (!id || !title || !description) {
      return NextResponse.json({ error: "Dados incompletos para edição" }, { status: 400 });
    }

    const shouldRequireAdmin = typeof password === "string" || (await isValidAdminRequest());
    if (shouldRequireAdmin && !(await isValidAdminRequest(password ?? null))) {
      return NextResponse.json({ error: "Senha de administrador incorreta." }, { status: 401 });
    }

    const updatedMemory = await prisma.memory.update({
      where: { id },
      data: {
        author: author === "Sunshine" ? "Sunshine" : "Moon",
        title: title.trim(),
        date: date?.trim() || "Momento Especial",
        description: description.trim(),
        mediaUrl: mediaUrl || null,
        mediaType: mediaType === "video" ? "video" : "image",
      },
    });

    return NextResponse.json(updatedMemory);
  } catch (error) {
    console.error("Erro ao editar memória:", error);
    return NextResponse.json({ error: "Erro interno ao editar memória" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id, password } = await req.json();
    if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

    const shouldRequireAdmin = typeof password === "string" || (await isValidAdminRequest());
    if (shouldRequireAdmin && !(await isValidAdminRequest(password ?? null))) {
      return NextResponse.json({ error: "Senha de administrador incorreta." }, { status: 401 });
    }

    await prisma.memory.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir memória:", error);
    return NextResponse.json({ error: "Erro interno ao excluir memória" }, { status: 500 });
  }
}