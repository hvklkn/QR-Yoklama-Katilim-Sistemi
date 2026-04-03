import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createSuccessResponse, createErrorResponse, ERROR_CODES } from "@/lib/api/response";

// Webhook tetikle (attendance oluştuğunda çağrılır)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { webhookUrl, eventType, payload } = body;

    if (!webhookUrl || !eventType || !payload) {
      return NextResponse.json(
        createErrorResponse(ERROR_CODES.INVALID_INPUT, "webhookUrl, eventType ve payload zorunlu"),
        { status: 400 }
      );
    }

    // URL doğrula
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(webhookUrl);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Geçersiz protokol");
      }
    } catch {
      return NextResponse.json(
        createErrorResponse(ERROR_CODES.INVALID_INPUT, "Geçersiz webhook URL"),
        { status: 400 }
      );
    }

    // Log kaydı oluştur
    const log = await prisma.webhookLog.create({
      data: {
        eventType,
        payload,
        sentTo: webhookUrl,
        status: "pending",
      },
    });

    // Webhook gönder
    let status = "success";
    let responseData: unknown = null;
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: eventType,
          timestamp: new Date().toISOString(),
          data: payload,
        }),
        signal: AbortSignal.timeout(10000), // 10s timeout
      });

      if (!res.ok) status = "failed";
      try {
        responseData = await res.json();
      } catch {
        responseData = { statusCode: res.status };
      }
    } catch (err) {
      status = "failed";
      responseData = { error: err instanceof Error ? err.message : "Bağlantı hatası" };
    }

    // Log güncelle
    await prisma.webhookLog.update({
      where: { id: log.id },
      data: { status, response: responseData as object },
    });

    return NextResponse.json(
      createSuccessResponse({ logId: log.id, status, response: responseData })
    );
  } catch (error) {
    console.error("Webhook trigger error:", error);
    return NextResponse.json(
      createErrorResponse(ERROR_CODES.INTERNAL_ERROR, "Webhook gönderilemedi"),
      { status: 500 }
    );
  }
}

// Webhook loglarını getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

    const logs = await prisma.webhookLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json(createSuccessResponse(logs));
  } catch (error) {
    console.error("Webhook logs error:", error);
    return NextResponse.json(
      createErrorResponse(ERROR_CODES.INTERNAL_ERROR, "Loglar alınamadı"),
      { status: 500 }
    );
  }
}
