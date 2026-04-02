import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  createSuccessResponse,
  createErrorResponse,
  ERROR_CODES,
} from "@/lib/api/response";
import { isTokenExpired, isValidTokenFormat } from "@/lib/qr/token";
import { validateLocationGeofence } from "@/lib/qr/location";
import { AttendanceStatus } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      eventId,
      participantId,
      qrToken,
      latitude,
      longitude,
      accuracyMeter,
    } = body;

    // Validate required fields
    if (!eventId || !participantId || !qrToken) {
      return NextResponse.json(
        createErrorResponse(
          ERROR_CODES.INVALID_INPUT,
          "Etkinlik ID, katılımcı ID ve QR token gerekli"
        ),
        { status: 400 }
      );
    }

    // Validate token format
    if (!isValidTokenFormat(qrToken)) {
      return NextResponse.json(
        createErrorResponse(
          ERROR_CODES.INVALID_QR,
          "Geçersiz QR kod formatı"
        ),
        { status: 400 }
      );
    }

    // Get event
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      // Record failed attendance
      await recordFailedAttendance(
        eventId,
        participantId,
        qrToken,
        "event_not_found",
        "Etkinlik bulunamadı",
        latitude,
        longitude,
        accuracyMeter
      );

      return NextResponse.json(
        createErrorResponse(
          ERROR_CODES.EVENT_NOT_FOUND,
          "Etkinlik bulunamadı"
        ),
        { status: 404 }
      );
    }

    // Verify QR token exists and is valid
    const qrRecord = await prisma.qRToken.findUnique({
      where: { token: qrToken },
    });

    if (!qrRecord) {
      await recordFailedAttendance(
        eventId,
        participantId,
        qrToken,
        "invalid_qr",
        "QR kod bulunamadı",
        latitude,
        longitude,
        accuracyMeter
      );

      return NextResponse.json(
        createErrorResponse(ERROR_CODES.INVALID_QR, "Geçersiz QR kod"),
        { status: 400 }
      );
    }

    // Check if token is from correct event
    if (qrRecord.eventId !== eventId) {
      await recordFailedAttendance(
        eventId,
        participantId,
        qrToken,
        "invalid_qr",
        "QR kod bu etkinliğe ait değil",
        latitude,
        longitude,
        accuracyMeter
      );

      return NextResponse.json(
        createErrorResponse(
          ERROR_CODES.UNAUTHORIZED,
          "QR kod bu etkinliğe ait değil"
        ),
        { status: 403 }
      );
    }

    // Check if token is valid
    if (!qrRecord.isValid) {
      await recordFailedAttendance(
        eventId,
        participantId,
        qrToken,
        "expired_qr",
        "QR kod süresi dolmuş",
        latitude,
        longitude,
        accuracyMeter
      );

      return NextResponse.json(
        createErrorResponse(ERROR_CODES.EXPIRED_QR, "QR kod süresi dolmuş"),
        { status: 400 }
      );
    }

    // Check if token is expired
    if (isTokenExpired(qrRecord.expiresAt)) {
      await recordFailedAttendance(
        eventId,
        participantId,
        qrToken,
        "expired_qr",
        "QR kod süresi dolmuş",
        latitude,
        longitude,
        accuracyMeter
      );

      return NextResponse.json(
        createErrorResponse(ERROR_CODES.EXPIRED_QR, "QR kod süresi dolmuş"),
        { status: 400 }
      );
    }

    // Verify participant exists
    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
    });

    if (!participant) {
      await recordFailedAttendance(
        eventId,
        participantId,
        qrToken,
        "unauthorized",
        "Katılımcı bulunamadı",
        latitude,
        longitude,
        accuracyMeter
      );

      return NextResponse.json(
        createErrorResponse(
          ERROR_CODES.PARTICIPANT_NOT_FOUND,
          "Katılımcı bulunamadı"
        ),
        { status: 404 }
      );
    }

    // Verify participant belongs to event
    if (participant.eventId !== eventId) {
      await recordFailedAttendance(
        eventId,
        participantId,
        qrToken,
        "unauthorized",
        "Katılımcı bu etkinliğe ait değil",
        latitude,
        longitude,
        accuracyMeter
      );

      return NextResponse.json(
        createErrorResponse(
          ERROR_CODES.UNAUTHORIZED,
          "Katılımcı bu etkinliğe ait değil"
        ),
        { status: 403 }
      );
    }

    // Validate location if coordinates are provided
    let locationValid = true;
    let locationError: string | undefined;

    if (event.latitude && event.longitude && latitude && longitude) {
      const locationResult = validateLocationGeofence(
        {
          latitude: event.latitude,
          longitude: event.longitude,
        },
        {
          latitude,
          longitude,
        },
        event.radius
      );

      if (!locationResult.isWithinGeofence) {
        locationValid = false;
        locationError = `Konumunuz etkinlikten ${Math.round(locationResult.distance)}m uzağında`;
      }
    }

    // Check for duplicate attendance
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        eventId,
        participantId,
      },
    });

    if (existingAttendance) {
      // Record as note but allow (for demo purposes)
      // In production, might want to prevent duplicates
    }

    // Record attendance
    let status: AttendanceStatus = AttendanceStatus.SUCCESS;
    let errorMessage: string | undefined;

    if (!locationValid) {
      status = AttendanceStatus.LOCATION_FAILED;
      errorMessage = locationError;
    }

    const attendance = await prisma.attendance.create({
      data: {
        eventId,
        participantId,
        qrTokenId: qrRecord.id,
        latitude,
        longitude,
        accuracyMeter,
        status,
        errorMessage,
      },
    });

    // Trigger webhook if successful
    if (status === AttendanceStatus.SUCCESS) {
      triggerWebhook(eventId, participantId, attendance.id);
    }

    return NextResponse.json(
      createSuccessResponse({
        attendance,
        locationValid,
        message:
          status === AttendanceStatus.SUCCESS
            ? "Yoklama başarıyla kaydedildi"
            : `Yoklama kaydedildi: ${errorMessage}`,
      }),
      { status: status === AttendanceStatus.SUCCESS ? 201 : 202 }
    );
  } catch (error) {
    console.error("Create attendance error:", error);
    return NextResponse.json(
      createErrorResponse(
        ERROR_CODES.INTERNAL_ERROR,
        "Yoklama kaydedilemiyor"
      ),
      { status: 500 }
    );
  }
}

async function recordFailedAttendance(
  eventId: string,
  participantId: string,
  _qrToken: string,
  status: string,
  errorMessage: string,
  latitude?: number,
  longitude?: number,
  accuracyMeter?: number
) {
  try {
    await prisma.attendance.create({
      data: {
        eventId,
        participantId,
        latitude,
        longitude,
        accuracyMeter,
        status,
        errorMessage,
      },
    });
  } catch (err) {
    console.error("Failed to record error attendance:", err);
  }
}

function triggerWebhook(eventId: string, participantId: string, attendanceId: string) {
  // Trigger webhook in background
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) return;

  fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "attendance_created",
      eventId,
      participantId,
      attendanceId,
      timestamp: new Date().toISOString(),
    }),
  }).catch((err) => console.error("Webhook error:", err));
}
