import { z } from "zod";

// Event Validators
export const createEventSchema = z.object({
  name: z.string().min(1, "Etkinlik adı gerekli").max(255),
  description: z.string().max(1000).optional(),
  startTime: z.string().datetime("Geçersiz başlangıç tarihi"),
  endTime: z.string().datetime("Geçersiz bitiş tarihi"),
  location: z.string().min(1, "Etkinlik lokasyonu gerekli").max(255),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  radius: z.number().min(5).max(1000).optional().default(50),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

// Participant Validators
export const createParticipantSchema = z.object({
  eventId: z.string().min(1, "Etkinlik ID gerekli"),
  firstName: z.string().min(1, "Ad gerekli").max(100),
  lastName: z.string().min(1, "Soyad gerekli").max(100),
  email: z.string().email("Geçersiz e-posta"),
  phone: z.string().max(20).optional(),
  isPreRegistered: z.boolean().optional().default(false),
});

export type CreateParticipantInput = z.infer<typeof createParticipantSchema>;

// Attendance Validators
export const createAttendanceSchema = z.object({
  eventId: z.string().min(1, "Etkinlik ID gerekli"),
  participantId: z.string().min(1, "Katılımcı ID gerekli"),
  qrToken: z.string().min(1, "QR token gerekli"),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  accuracyMeter: z.number().min(0).optional(),
});

export type CreateAttendanceInput = z.infer<typeof createAttendanceSchema>;

// Quick participant registration during scan
export const quickParticipantSchema = z.object({
  firstName: z.string().min(1, "Ad gerekli").max(100),
  lastName: z.string().min(1, "Soyad gerekli").max(100),
  email: z.string().email("Geçersiz e-posta"),
  phone: z.string().max(20).optional(),
});

export type QuickParticipantInput = z.infer<typeof quickParticipantSchema>;

// Location Validators
export const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().min(0).optional(),
});

export type LocationInput = z.infer<typeof locationSchema>;
