import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createSuccessResponse, createErrorResponse, ERROR_CODES } from "@/lib/api/response";
import { createEventSchema } from "@/lib/validators";
import { generateQRToken, calculateTokenExpiry } from "@/lib/qr/token";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        _count: {
          select: {
            participants: true,
            attendances: true,
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
    });

    return NextResponse.json(
      createSuccessResponse(
        events.map((event) => ({
          ...event,
          participantCount: event._count.participants,
          attendanceCount: event._count.attendances,
          _count: undefined,
        }))
      )
    );
  } catch (error) {
    console.error("Get events error:", error);
    return NextResponse.json(
      createErrorResponse(ERROR_CODES.INTERNAL_ERROR, "Etkinlikler alınamadı"),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = createEventSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse(
          ERROR_CODES.INVALID_INPUT,
          "Geçersiz etkinlik verileri",
          validation.error.errors
        ),
        { status: 400 }
      );
    }

    const { name, description, startTime, endTime, location, latitude, longitude, radius } =
      validation.data;

    // Validate date range
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (end <= start) {
      return NextResponse.json(
        createErrorResponse(
          ERROR_CODES.INVALID_INPUT,
          "Bitiş tarihi başlangıç tarihinden sonra olmalıdır"
        ),
        { status: 400 }
      );
    }

    // Create event with initial QR token
    const initialToken = generateQRToken();
    const tokenExpiry = calculateTokenExpiry();

    const event = await prisma.event.create({
      data: {
        name,
        description,
        startTime: start,
        endTime: end,
        location,
        latitude,
        longitude,
        radius,
        createdBy: "admin", // Will be replaced with actual admin email later
        qrTokens: {
          create: {
            token: initialToken,
            expiresAt: tokenExpiry,
          },
        },
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
        ...event,
        currentQRToken: event.qrTokens[0],
        participantCount: event._count.participants,
        attendanceCount: event._count.attendances,
        _count: undefined,
        qrTokens: undefined,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json(
      createErrorResponse(ERROR_CODES.INTERNAL_ERROR, "Etkinlik oluşturulamadı"),
      { status: 500 }
    );
  }
}
