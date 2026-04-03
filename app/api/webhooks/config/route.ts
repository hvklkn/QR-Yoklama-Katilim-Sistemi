import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createSuccessResponse, createErrorResponse, ERROR_CODES } from "@/lib/api/response";

// GET: Tüm webhook'ları listele
export async function GET() {
  try {
    const webhooks = await prisma.webhook.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(createSuccessResponse(webhooks));
  } catch (error) {
    console.error("Webhook list error:", error);
    return NextResponse.json(
      createErrorResponse(ERROR_CODES.INTERNAL_ERROR, "Webhook'lar listelenemedi"),
      { status: 500 }
    );
  }
}

// POST: Yeni webhook oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, url, events } = body;

    if (!name?.trim() || !url?.trim() || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        createErrorResponse(ERROR_CODES.INVALID_INPUT, "name, url ve events zorunlu"),
        { status: 400 }
      );
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Geçersiz protokol");
      }
    } catch {
      return NextResponse.json(
        createErrorResponse(ERROR_CODES.INVALID_INPUT, "Geçerli bir URL girin (http/https)"),
        { status: 400 }
      );
    }

    const webhook = await prisma.webhook.create({
      data: {
        name: name.trim(),
        url: parsedUrl.toString(),
        events,
        active: true,
      },
    });

    return NextResponse.json(createSuccessResponse(webhook), { status: 201 });
  } catch (error) {
    console.error("Webhook create error:", error);
    return NextResponse.json(
      createErrorResponse(ERROR_CODES.INTERNAL_ERROR, "Webhook oluşturulamadı"),
      { status: 500 }
    );
  }
}
