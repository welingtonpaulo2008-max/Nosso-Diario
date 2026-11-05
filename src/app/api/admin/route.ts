import { NextResponse } from "next/server";
import { isAdminAuthenticated, isValidAdminPassword } from "@/lib/admin-auth";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  return NextResponse.json({ authenticated });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password } = body ?? {};

    if (!isValidAdminPassword(password)) {
      return NextResponse.json({ error: "Senha de administrador incorreta." }, { status: 401 });
    }

    const response = NextResponse.json({ authenticated: true });
    response.cookies.set("admin_session", "authenticated", {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set("admin_session", "", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });

  return response;
}
