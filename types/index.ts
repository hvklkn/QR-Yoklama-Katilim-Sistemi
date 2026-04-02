// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

// Event types
export interface EventDTO {
  id: string;
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  location: string;
  latitude?: number;
  longitude?: number;
  radius: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  qrTokens?: QRTokenDTO[];
  participantCount?: number;
  attendanceCount?: number;
}

export interface CreateEventRequest {
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  location: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
}

// Participant types
export interface ParticipantDTO {
  id: string;
  eventId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isPreRegistered: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateParticipantRequest {
  eventId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isPreRegistered?: boolean;
}

// QR Token types
export interface QRTokenDTO {
  id: string;
  eventId: string;
  token: string;
  expiresAt: string;
  isValid: boolean;
  createdAt: string;
}

// Attendance types
export enum AttendanceStatus {
  SUCCESS = "success",
  INVALID_QR = "invalid_qr",
  EXPIRED_QR = "expired_qr",
  LOCATION_FAILED = "location_failed",
  UNAUTHORIZED = "unauthorized",
}

export interface AttendanceDTO {
  id: string;
  eventId: string;
  participantId: string;
  qrTokenId?: string;
  latitude?: number;
  longitude?: number;
  accuracyMeter?: number;
  scanTime: string;
  status: AttendanceStatus;
  errorMessage?: string;
}

export interface CreateAttendanceRequest {
  eventId: string;
  participantId: string;
  qrToken: string;
  latitude?: number;
  longitude?: number;
  accuracyMeter?: number;
}

// Webhook types
export interface WebhookLogDTO {
  id: string;
  eventType: string;
  payload: any;
  sentTo?: string;
  status: "pending" | "success" | "failed";
  response?: any;
  createdAt: string;
}

// Location types
export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface LocationValidationResult {
  isWithinGeofence: boolean;
  distance: number;
  error?: string;
}
