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
    if (!eventId || !qrToken) {
      return NextResponse.json(
        createErrorResponse(
          ERROR_CODES.INVALID_INPUT,
          "Etkinlik ID ve QR token gerekli"
        ),
        { status: 400 }
      );
    }

    // participantId if provided must be valid
    if (!participantId) {
      return NextResponse.json(
        createErrorResponse(
          ERROR_CODES.INVALID_INPUT,
          "Katılımcı ID gerekli"
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

    // Validate location - Required if event has location coordinates set
    if (event.latitude && event.longitude) {
      // If event has location, location data is required
      if (!latitude || !longitude) {
        await recordFailedAttendance(
          eventId,
          participantId,
          qrToken,
          "location_failed",
          "Konum bilgisi alınamadı. Lütfen cihazın konum servisini açın ve baştan deneyin.",
          latitude,
          longitude,
          accuracyMeter
        );

        return NextResponse.json(
          createErrorResponse(
            ERROR_CODES.LOCATION_UNAVAILABLE,
            "Konum bilgisi alınamadı. Bu etkinlik için konum doğrulaması gereklidir."
          ),
          { status: 400 }
        );
      }

      // Verify location is within geofence
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
        const distance = Math.round(locationResult.distance);
        const errorMsg = `Konumunuz etkinlikten ${distance}m uzağında. Minimum mesafe: ${event.radius}m`;

        await recordFailedAttendance(
          eventId,
          participantId,
          qrToken,
          "location_failed",
          errorMsg,
          latitude,
          longitude,
          accuracyMeter
        );

        return NextResponse.json(
          createErrorResponse(
            ERROR_CODES.LOCATION_OUT_OF_RANGE,
            errorMsg
          ),
          { status: 403 }
        );
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

    // Record successful attendance
    const attendance = await prisma.attendance.create({
      data: {
        eventId,
        participantId,
        qrTokenId: qrRecord.id,
        latitude,
        longitude,
        accuracyMeter,
        status: AttendanceStatus.SUCCESS,
      },
    });

    // Trigger webhooks for successful attendance (fire-and-forget)
    triggerWebhooks(event, participant, attendance).catch((err) =>
      console.error("Webhook trigger error:", err)
    );

    return NextResponse.json(
      createSuccessResponse({
        attendance,
        message: "Yoklama başarıyla kaydedildi",
      }),
      { status: 201 }
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

async function triggerWebhooks(
  event: { id: string; name: string },
  participant: { id: string; firstName: string; lastName: string; email: string },
  attendance: { id: string; latitude?: number | null; longitude?: number | null; scanTime?: Date | null; status: string }
) {
  // DB'den aktif ve attendance_created olayını dinleyen webhook'ları getir
  const webhooks = await prisma.webhook.findMany({
    where: {
      active: true,
      events: { has: "attendance_created" },
    },
  });

  if (webhooks.length === 0) return;

  const payload = {
    attendanceId: attendance.id,
    eventId: event.id,
    eventName: event.name,
    participantId: participant.id,
    participantName: `${participant.firstName} ${participant.lastName}`,
    participantEmail: participant.email,
    scanTime: attendance.scanTime ?? new Date(),
    status: attendance.status,
    location:
      attendance.latitude != null && attendance.longitude != null
        ? { latitude: attendance.latitude, longitude: attendance.longitude }
        : null,
  };

  await Promise.all(
    webhooks.map(async (wh) => {
      let status = "success";
      let responseData: unknown = null;

      // Log kaydı oluştur
      const log = await prisma.webhookLog.create({
        data: {
          webhookId: wh.id,
          eventType: "attendance_created",
          payload,
          sentTo: wh.url,
          status: "pending",
        },
      });

      try {
        const res = await fetch(wh.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "attendance_created",
            timestamp: new Date().toISOString(),
            data: payload,
          }),
          signal: AbortSignal.timeout(10000),
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

      await prisma.webhookLog.update({
        where: { id: log.id },
        data: { status, response: responseData as object },
      });
    })
  );
}
