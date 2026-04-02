import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createSuccessResponse, createErrorResponse, ERROR_CODES } from "@/lib/api/response";
import { generateQRToken, calculateTokenExpiry } from "@/lib/qr/token";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        qrTokens: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
        _count: {
          select: {
            participants: true,
            attendances: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        createErrorResponse(ERROR_CODES.EVENT_NOT_FOUND, "Etkinlik bulunamadı"),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createSuccessResponse({
        ...event,
        participantCount: event._count.participants,
        attendanceCount: event._count.attendances,
        _count: undefined,
      })
    );
  } catch (error) {
    console.error("Get event error:", error);
    return NextResponse.json(
      createErrorResponse(ERROR_CODES.INTERNAL_ERROR, "Etkinlik alınamadı"),
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, location, latitude, longitude, radius } = body;

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json(
        createErrorResponse(ERROR_CODES.EVENT_NOT_FOUND, "Etkinlik bulunamadı"),
        { status: 404 }
      );
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        name: name ?? event.name,
        description: description ?? event.description,
        location: location ?? event.location,
        latitude: latitude ?? event.latitude,
        longitude: longitude ?? event.longitude,
        radius: radius ?? event.radius,
      },
      include: {
        qrTokens: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            participants: true,
            attendances: true,
          },
        },
      },
    });

    return NextResponse.json(
      createSuccessResponse({
        ...updated,
        participantCount: updated._count.participants,
        attendanceCount: updated._count.attendances,
        _count: undefined,
      })
    );
  } catch (error) {
    console.error("Update event error:", error);
    return NextResponse.json(
      createErrorResponse(ERROR_CODES.INTERNAL_ERROR, "Etkinlik güncellenemedi"),
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json(
        createErrorResponse(ERROR_CODES.EVENT_NOT_FOUND, "Etkinlik bulunamadı"),
        { status: 404 }
      );
    }

    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json(
      createSuccessResponse({
        id,
        message: "Etkinlik başarıyla silindi",
      })
    );
  } catch (error) {
    console.error("Delete event error:", error);
    return NextResponse.json(
      createErrorResponse(ERROR_CODES.INTERNAL_ERROR, "Etkinlik silinemedi"),
      { status: 500 }
    );
  }
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json(
        createErrorResponse(ERROR_CODES.EVENT_NOT_FOUND, "Etkinlik bulunamadı"),
        { status: 404 }
      );
    }

    // Generate new token
    const newToken = generateQRToken();
    const newExpiry = calculateTokenExpiry();

    // Mark old tokens as invalid
    await prisma.qRToken.updateMany({
      where: { eventId: id, isValid: true },
      data: { isValid: false },
    });

    // Create new token
    const qrToken = await prisma.qRToken.create({
      data: {
        eventId: id,
        token: newToken,
        expiresAt: newExpiry,
        isValid: true,
      },
    });

    return NextResponse.json(
      createSuccessResponse({
        qrToken,
        message: "QR token yenilendi",
      })
    );
  } catch (error) {
    console.error("Refresh QR token error:", error);
    return NextResponse.json(
      createErrorResponse(ERROR_CODES.INTERNAL_ERROR, "QR token yenilenemedi"),
      { status: 500 }
    );
  }
}
