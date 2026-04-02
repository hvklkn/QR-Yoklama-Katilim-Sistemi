import { NextRequest, NextResponse } from "next/server";
import {
  validateAdminCredentials,
  createAdminSession,
} from "@/lib/auth/admin";
import { createSuccessResponse, createErrorResponse, ERROR_CODES } from "@/lib/api/response";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Geçersiz e-posta formatı"),
  password: z.string().min(1, "Şifre gerekli"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse(
          ERROR_CODES.INVALID_INPUT,
          "Geçersiz giriş verileri",
          validation.error.errors
        ),
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Verify credentials
    if (!validateAdminCredentials(email, password)) {
      return NextResponse.json(
        createErrorResponse(
          ERROR_CODES.UNAUTHORIZED,
          "E-posta veya şifre yanlış"
        ),
        { status: 401 }
      );
    }

    // Create session
    const token = createAdminSession(email);

    // Set cookie
    const response = NextResponse.json(
      createSuccessResponse({
        email,
        message: "Başarıyla giriş yapıldı",
      })
    );

    // Set secure session cookie
    response.cookies.set({
      name: "admin_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      createErrorResponse(
        ERROR_CODES.INTERNAL_ERROR,
        "Giriş işlemi sırasında bir hata oluştu"
      ),
      { status: 500 }
    );
  }
}
