import { ApiResponse } from "@/types";

export function createSuccessResponse<T>(
  data: T,
  message?: string
): ApiResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

export function createErrorResponse(
  code: string,
  message: string,
  details?: any
): ApiResponse<null> {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  };
}

export class ApiError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 400,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const ERROR_CODES = {
  INVALID_INPUT: "INVALID_INPUT",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  CONFLICT: "CONFLICT",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  INVALID_QR: "INVALID_QR",
  EXPIRED_QR: "EXPIRED_QR",
  LOCATION_VERIFICATION_FAILED: "LOCATION_VERIFICATION_FAILED",
  GEOFENCE_VIOLATION: "GEOFENCE_VIOLATION",
  EVENT_NOT_FOUND: "EVENT_NOT_FOUND",
  PARTICIPANT_NOT_FOUND: "PARTICIPANT_NOT_FOUND",
};
