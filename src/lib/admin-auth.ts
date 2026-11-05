import { cookies } from "next/headers";

export function isValidAdminPassword(password: unknown) {
  if (typeof password !== "string") {
    return false;
  }

  const configuredPassword = process.env.ADMIN_PASSWORD;
  return Boolean(configuredPassword) && password === configuredPassword;
}

export async function isValidAdminRequest(password?: string | null) {
  if (await isAdminAuthenticated()) {
    return true;
  }

  return isValidAdminPassword(password ?? null);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === "authenticated";
}
