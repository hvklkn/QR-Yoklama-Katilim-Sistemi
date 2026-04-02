/**
 * Geolocation Permission Management
 * Handles checking and requesting location permissions
 */

export async function checkLocationPermission(): Promise<boolean> {
  if (!navigator.geolocation) {
    return false;
  }

  // Check if permission API is available
  if (!navigator.permissions || !navigator.permissions.query) {
    return true; // Assume available if can't check
  }

  try {
    const result = await navigator.permissions.query({ name: "geolocation" });
    return result.state === "granted" || result.state === "prompt";
  } catch (error) {
    console.warn("Could not check location permission:", error);
    return true; // Assume available if error
  }
}

/**
 * Prompts user for location, with timeout
 */
export async function getLocationWithTimeout(
  timeoutMs: number = 5000
): Promise<{ latitude: number; longitude: number; accuracy: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      resolve(null);
    }, timeoutMs);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      () => {
        clearTimeout(timeoutId);
        resolve(null);
      },
      {
        timeout: timeoutMs,
        enableHighAccuracy: false, // Basic accuracy is sufficient
        maximumAge: 0,
      }
    );
  });
}

/**
 * Gets user-friendly error message for geolocation errors
 */
export function getLocationErrorMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "Konum iznini reddettiniz. Ayarlar > Gizlilik > Konum'dan izin verin.";
    case error.POSITION_UNAVAILABLE:
      return "Konum bilgisi şu anda kullanılamıyor. Daha sonra deneyin.";
    case error.TIMEOUT:
      return "Konum alınamadı: İşlem zaman aşımına uğradı.";
    default:
      return "Konum alınamadı. Lütfen cihazınızın konum servisini kontrol edin.";
  }
}
