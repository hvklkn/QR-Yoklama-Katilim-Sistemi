import { NextRequest, NextResponse } from "next/server";
import { createSuccessResponse } from "@/lib/api/response";

export async function POST(_request: NextRequest) {
  const response = NextResponse.json(
    createSuccessResponse({
      message: "Başarıyla çıkış yapıldı",
    })
  );

  // Clear session cookie
  response.cookies.set({
    name: "admin_session",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
