"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import QRCode from "qrcode";
import { EventDTO } from "@/types";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<EventDTO | null>(null);
  const [qrCode, setQrCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [_refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    // Refresh QR token every 5 minutes (as per env config)
    const interval = setInterval(() => {
      refreshQRToken();
    }, 5 * 60 * 1000);

    setRefreshInterval(interval);
    return () => clearInterval(interval);
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/events/${eventId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Etkinlik yüklenemedi");
      }

      setEvent(data.data);
      generateQRCode(data.data.qrTokens[0]?.token);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Bir hata oluştu";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateQRCode = async (token: string) => {
    try {
      const qrUrl = `${process.env.NEXT_PUBLIC_API_URL}/scan?token=${token}&event=${eventId}`;
      const dataUrl = await QRCode.toDataURL(qrUrl, {
        width: 300,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrCode(dataUrl);
    } catch (err) {
      console.error("QR code generation error:", err);
    }
  };

  const refreshQRToken = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PATCH",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message);
      }

      // Generate new QR
      generateQRCode(data.data.qrToken.token);
      
      // Update event data
      if (event) {
        setEvent({
          ...event,
          qrTokens: [data.data.qrToken, ...(event.qrTokens || [])],
        } as EventDTO);
      }
    } catch (err) {
      console.error("QR token refresh error:", err);
    }
  };

  const handleManualRefresh = async () => {
    await refreshQRToken();
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Etkinlik yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Geri Dön
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Etkinlik bulunamadı</p>
      </div>
    );
  }

  const currentQRToken = event.qrTokens?.[0];
  const timeUntilExpiry = currentQRToken
    ? Math.max(
        0,
        Math.floor(
          (new Date(currentQRToken.expiresAt).getTime() - Date.now()) / 1000
        )
      )
    : 0;

  return (
    <>
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-primary-600 hover:text-primary-700 mb-4 font-medium"
        >
          ← Geri
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.name}</h1>
        <p className="text-gray-600">{event.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details Card */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Etkinlik Detayları</h2>
            <div className="space-y-3 text-sm">
              <p>
                <span className="font-medium text-gray-700">Lokasyon:</span>{" "}
                {event.location}
              </p>
              <p>
                <span className="font-medium text-gray-700">Başlangıç:</span>{" "}
                {new Date(event.startTime).toLocaleString("tr-TR")}
              </p>
              <p>
                <span className="font-medium text-gray-700">Bitiş:</span>{" "}
                {new Date(event.endTime).toLocaleString("tr-TR")}
              </p>
              {event.latitude && event.longitude && (
                <>
                  <p>
                    <span className="font-medium text-gray-700">Koordinatlar:</span>{" "}
                    {event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Geofence Yarıçapı:</span>{" "}
                    {event.radius}m
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-4 text-center">
              <p className="text-3xl font-bold text-primary-600">
                {(event as any).participantCount || 0}
              </p>
              <p className="text-gray-600 text-sm">Katılımcı</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-3xl font-bold text-success">
                {(event as any).attendanceCount || 0}
              </p>
              <p className="text-gray-600 text-sm">Yoklama</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`/admin/events/${event.id}/participants`}
              className="btn-secondary"
            >
              Katılımcıları Yönet
            </a>
            <a
              href={`/admin/events/${event.id}/attendance`}
              className="btn-secondary"
            >
              Yoklama Kayıtları
            </a>
          </div>
        </div>

        {/* QR Code Display */}
        <div className="card p-6 sticky top-4 h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Aktif QR Kodu</h2>

          {qrCode && (
            <div className="text-center mb-4">
              <img src={qrCode} alt="Event QR Code" className="w-full mx-auto" />
            </div>
          )}

          {currentQRToken && (
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 mb-2">Süresi dolana kadar:</p>
              <div className="inline-block bg-primary-100 text-primary-700 px-3 py-2 rounded font-bold">
                {Math.floor(timeUntilExpiry / 60)}:{String(timeUntilExpiry % 60).padStart(2, "0")}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Otomatik 5 dakika sonra yenilenir
              </p>
            </div>
          )}

          <button
            onClick={handleManualRefresh}
            className="w-full btn-secondary mb-2"
          >
            🔄 Şimdi Yenile
          </button>

          <button
            onClick={() => router.push(`/admin/events/${event.id}/participants`)}
            className="w-full btn-primary"
          >
            Katılımcı Ekle
          </button>
        </div>
      </div>
    </>
  );
}
