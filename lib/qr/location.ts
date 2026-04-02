import { LocationCoordinates, LocationValidationResult } from "@/types";

const EARTH_RADIUS = 6371000; // meters

/**
 * Calculates distance between two points using Haversine formula
 * Returns distance in meters
 */
export function calculateDistance(
  coord1: LocationCoordinates,
  coord2: LocationCoordinates
): number {
  const lat1 = (coord1.latitude * Math.PI) / 180;
  const lat2 = (coord2.latitude * Math.PI) / 180;
  const deltaLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const deltaLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS * c;
}

/**
 * Validates if location is within geofence
 */
export function validateLocationGeofence(
  eventLocation: LocationCoordinates,
  scanLocation: LocationCoordinates,
  radiusMeters: number
): LocationValidationResult {
  if (!eventLocation.latitude || !eventLocation.longitude) {
    return {
      isWithinGeofence: false,
      distance: 0,
      error: "Event location not set",
    };
  }

  if (!scanLocation.latitude || !scanLocation.longitude) {
    return {
      isWithinGeofence: false,
      distance: 0,
      error: "Scan location not available",
    };
  }

  const distance = calculateDistance(eventLocation, scanLocation);
  const isWithinGeofence = distance <= radiusMeters;

  return {
    isWithinGeofence,
    distance,
  };
}

/**
 * Formats location for display
 */
export function formatLocation(
  latitude: number | null | undefined,
  longitude: number | null | undefined
): string {
  if (!latitude || !longitude) {
    return "Bilgi yok";
  }
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}
