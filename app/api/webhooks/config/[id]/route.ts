import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createSuccessResponse, createErrorResponse, ERROR_CODES } from "@/lib/api/response";

// PATCH: toggle active veya güncelle
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.webhook.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        createErrorResponse(ERROR_CODES.NOT_FOUND, "Webhook bulunamadı"),
        { status: 404 }
      );
    }

    const updated = await prisma.webhook.update({
      where: { id },
      data: {
        ...(typeof body.active === "boolean" && { active: body.active }),
        ...(body.name?.trim() && { name: body.name.trim() }),
        ...(body.url?.trim() && { url: body.url.trim() }),
        ...(Array.isArray(body.events) && { events: body.events }),
      },
    });

    return NextResponse.json(createSuccessResponse(updated));
  } catch (error) {
    console.error("Webhook update error:", error);
    return NextResponse.json(
      createErrorResponse(ERROR_CODES.INTERNAL_ERROR, "Webhook güncellenemedi"),
      { status: 500 }
    );
  }
}

// DELETE: webhook sil
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.webhook.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        createErrorResponse(ERROR_CODES.NOT_FOUND, "Webhook bulunamadı"),
        { status: 404 }
      );
    }

    await prisma.webhook.delete({ where: { id } });
    return NextResponse.json(createSuccessResponse({ deleted: true }));
  } catch (error) {
    console.error("Webhook delete error:", error);
    return NextResponse.json(
      createErrorResponse(ERROR_CODES.INTERNAL_ERROR, "Webhook silinemedi"),
      { status: 500 }
    );
  }
}
