import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createSuccessResponse, createErrorResponse, ERROR_CODES } from "@/lib/api/response";
import { createParticipantSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json(
        createErrorResponse(
          ERROR_CODES.INVALID_INPUT,
          "Etkinlik ID gerekli"
        ),
        { status: 400 }
      );
    }

    // Verify event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        createErrorResponse(ERROR_CODES.EVENT_NOT_FOUND, "Etkinlik bulunamadı"),
        { status: 404 }
      );
    }

    const participants = await prisma.participant.findMany({
      where: { eventId },
      include: {
        _count: {
          select: {
            attendances: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      createSuccessResponse(
        participants.map((p: any) => ({
          ...p,
          attendanceCount: p._count.attendances,
          _count: undefined,
        }))
      )
    );
  } catch (error) {
    console.error("Get participants error:", error);
    return NextResponse.json(
      createErrorResponse(
        ERROR_CODES.INTERNAL_ERROR,
        "Katılımcılar alınamadı"
      ),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = createParticipantSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse(
          ERROR_CODES.INVALID_INPUT,
          "Geçersiz katılımcı verileri",
          validation.error.errors
        ),
        { status: 400 }
      );
    }

    const { eventId, firstName, lastName, email, phone, isPreRegistered } =
      validation.data;

    // Verify event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        createErrorResponse(ERROR_CODES.EVENT_NOT_FOUND, "Etkinlik bulunamadı"),
        { status: 404 }
      );
    }

    // Check if participant already exists (unique constraint)
    const existing = await prisma.participant.findUnique({
      where: {
        eventId_email: { eventId, email },
      },
    });

    if (existing) {
      return NextResponse.json(
        createErrorResponse(
          ERROR_CODES.CONFLICT,
          "Bu e-posta adresi bu etkinlikte zaten kayıtlı"
        ),
        { status: 409 }
      );
    }

    // Create participant
    const participant = await prisma.participant.create({
      data: {
        eventId,
        firstName,
        lastName,
        email,
        phone,
        isPreRegistered: isPreRegistered ?? false,
      },
    });

    return NextResponse.json(
      createSuccessResponse(participant),
      { status: 201 }
    );
  } catch (error) {
    console.error("Create participant error:", error);
    return NextResponse.json(
      createErrorResponse(
        ERROR_CODES.INTERNAL_ERROR,
        "Katılımcı eklenemedi"
      ),
      { status: 500 }
    );
  }
}
