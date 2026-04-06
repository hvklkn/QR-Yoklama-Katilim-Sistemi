import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  createSuccessResponse,
  createErrorResponse,
  ERROR_CODES,
} from "@/lib/api/response";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const eventId = searchParams.get("eventId");
    const participantId = searchParams.get("participantId");
    const format = searchParams.get("format"); // csv, json

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

    // Build filter
    const where: any = { eventId };
    if (participantId) {
      where.participantId = participantId;
    }

    // Get attendance records
    const attendances = await prisma.attendance.findMany({
      where,
      include: {
        participant: true,
      },
      orderBy: {
        scanTime: "desc",
      },
    });

    // Export as CSV if requested
    if (format === "csv") {
      const csv = generateCSV(attendances);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition":
            'attachment; filename="attendance-' +
            eventId +
            '-' +
            new Date().toISOString().split("T")[0] +
            '.csv"',
        },
      });
    }

    // Return as JSON
    return NextResponse.json(
      createSuccessResponse({
        event,
        attendances,
        count: attendances.length,
      })
    );
  } catch (error) {
    console.error("Get attendance error:", error);
    return NextResponse.json(
      createErrorResponse(ERROR_CODES.INTERNAL_ERROR, "Yoklama alınamadı"),
      { status: 500 }
    );
  }
}

function generateCSV(
  attendances: any[]
): string {
  // Headers
  const headers = [
    "Katılımcı Adı",
    "E-posta",
    "Telefon",
    "Tarama Tarihi/Saati",
    "Durum",
    "Hata Mesajı",
    "Konum",
    "Doğruluk (m)",
  ];

  // Data rows
  const rows = attendances.map((a) => [
    `${a.participant.firstName} ${a.participant.lastName}`,
    a.participant.email,
    a.participant.phone || "",
    new Date(a.scanTime).toLocaleString("tr-TR"),
    getStatusLabel(a.status),
    a.errorMessage || "",
    a.latitude && a.longitude
      ? `${a.latitude.toFixed(4)}, ${a.longitude.toFixed(4)}`
      : "",
    a.accuracyMeter || "",
  ]);

  // Combine headers and rows
  const csv = [
    headers.map((h) => `"${h}"`).join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return csv;
}

function getStatusLabel(status: string): string {
  const labels: { [key: string]: string } = {
    success: "Başarılı",
    invalid_qr: "Geçersiz QR",
    expired_qr: "QR Süresi Dolmuş",
    location_failed: "Konum Başarısız",
    unauthorized: "Yetkisiz",
    manual_present: "Manuel Var",
  };
  return labels[status] || status;
}

// PATCH: Manuel Var/Yok işaretleme (Admin)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, participantId, present } = body;

    if (!eventId || !participantId || typeof present !== "boolean") {
      return NextResponse.json(
        createErrorResponse(ERROR_CODES.INVALID_INPUT, "eventId, participantId ve present alanları gerekli"),
        { status: 400 }
      );
    }

    if (present) {
      // Başarılı yoklama kaydı var mı kontrol et
      const existing = await prisma.attendance.findFirst({
        where: {
          eventId,
          participantId,
          status: { in: ["success", "manual_present"] },
        },
      });

      if (existing) {
        return NextResponse.json(
          createSuccessResponse({ alreadyPresent: true, message: "Katılımcı zaten var işaretli" })
        );
      }

      // Manuel yoklama kaydı oluştur
      const attendance = await prisma.attendance.create({
        data: {
          eventId,
          participantId,
          status: "manual_present",
        },
      });

      return NextResponse.json(createSuccessResponse({ attendance }), { status: 201 });
    } else {
      // Manuel veya başarılı yoklama kaydını sil
      await prisma.attendance.deleteMany({
        where: {
          eventId,
          participantId,
          status: { in: ["manual_present", "success"] },
        },
      });

      return NextResponse.json(createSuccessResponse({ message: "Yoklama kaydı silindi" }));
    }
  } catch (error) {
    console.error("Manual attendance toggle error:", error);
    return NextResponse.json(
      createErrorResponse(ERROR_CODES.INTERNAL_ERROR, "İşlem gerçekleştirilemedi"),
      { status: 500 }
    );
  }
}
