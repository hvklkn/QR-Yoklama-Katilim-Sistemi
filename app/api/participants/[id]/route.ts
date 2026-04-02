import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createSuccessResponse, createErrorResponse, ERROR_CODES } from "@/lib/api/response";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const participant = await prisma.participant.findUnique({
      where: { id },
      include: {
        event: true,
        attendances: {
          orderBy: {
            scanTime: "desc",
          },
        },
      },
    });

    if (!participant) {
      return NextResponse.json(
        createErrorResponse(
          ERROR_CODES.PARTICIPANT_NOT_FOUND,
          "Katılımcı bulunamadı"
        ),
        { status: 404 }
      );
    }

    return NextResponse.json(createSuccessResponse(participant));
  } catch (error) {
    console.error("Get participant error:", error);
    return NextResponse.json(
      createErrorResponse(
        ERROR_CODES.INTERNAL_ERROR,
        "Katılımcı alınamadı"
      ),
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
    const participant = await prisma.participant.findUnique({
      where: { id },
    });

    if (!participant) {
      return NextResponse.json(
        createErrorResponse(
          ERROR_CODES.PARTICIPANT_NOT_FOUND,
          "Katılımcı bulunamadı"
        ),
        { status: 404 }
      );
    }

    await prisma.participant.delete({
      where: { id },
    });

    return NextResponse.json(
      createSuccessResponse({
        id,
        message: "Katılımcı başarıyla silindi",
      })
    );
  } catch (error) {
    console.error("Delete participant error:", error);
    return NextResponse.json(
      createErrorResponse(
        ERROR_CODES.INTERNAL_ERROR,
        "Katılımcı silinemedi"
      ),
      { status: 500 }
    );
  }
}
