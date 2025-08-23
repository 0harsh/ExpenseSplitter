import { NextResponse } from "next/server";
import { authCookieOptions } from "@/app/lib/auth";

export async function POST() {
  const { name: cookieName, options } = authCookieOptions();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookieName, "", { ...options, maxAge: 0 });
  return res;
}


