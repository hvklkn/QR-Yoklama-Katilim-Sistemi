"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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
  const [countdown, setCountdown] = useState<number>(0);
  const expiresAtRef = useRef<number>(0);

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    // Refresh QR token every 5 minutes
    const interval = setInterval(() => {
      refreshQRToken();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [eventId]);

  // Countdown timer - runs every second independently
  useEffect(() => {
    const timer = setInterval(() => {
      if (expiresAtRef.current > 0) {
        const remaining = Math.max(
          0,
          Math.floor((expiresAtRef.current - Date.now()) / 1000)
        );
        setCountdown(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
      // Set expiry for countdown
      if (data.data.qrTokens?.[0]?.expiresAt) {
        expiresAtRef.current = new Date(data.data.qrTokens[0].expiresAt).getTime();
        setCountdown(Math.max(0, Math.floor((expiresAtRef.current - Date.now()) / 1000)));
      }
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
      const qrUrl = `${window.location.origin}/scan?token=${token}&event=${eventId}`;
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
      
      // Update expiry for countdown
      if (data.data.qrToken?.expiresAt) {
        expiresAtRef.current = new Date(data.data.qrToken.expiresAt).getTime();
        setCountdown(Math.max(0, Math.floor((expiresAtRef.current - Date.now()) / 1000)));
      }

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
          onClick={() => router.push('/admin/events')}
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

  return (
    <>
    <div className="container-max py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 fade-in">
        <div>
          <Link href="/admin/events" className="text-primary-600 hover:text-primary-700 mb-2 font-medium transition-all duration-200 flex items-center gap-1">
            ← Admin Paneline Dön
          </Link>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-2">
            🔲 {event.name}
          </h1>
          {event.description && (
            <p className="text-gray-600 font-medium max-w-3xl">{event.description}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details Card */}
          <div className="card-elevated p-6 border-l-4 border-primary-600">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              📋 Etkinlik Detayları
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">📍 Lokasyon:</span>
                <span className="text-gray-900">{event.location}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">🕐 Başlangıç:</span>
                <span className="text-gray-900">{new Date(event.startTime).toLocaleString("tr-TR")}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">⏹️ Bitiş:</span>
                <span className="text-gray-900">{new Date(event.endTime).toLocaleString("tr-TR")}</span>
              </div>
              {event.latitude && event.longitude && (
                <>
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="font-medium text-gray-700">🧭 Koordinatlar:</span>
                    <span className="text-gray-900 font-mono">{event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="font-medium text-gray-700">📐 Geofence:</span>
                    <span className="text-gray-900">{event.radius}m</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card-elevated p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-600 hover:shadow-xl transition-all duration-300">
              <p className="text-4xl font-bold text-blue-600">
                {(event as any).participantCount || 0}
              </p>
              <p className="text-gray-700 text-sm font-medium mt-2">👥 Katılımcı</p>
            </div>
            <div className="card-elevated p-6 text-center bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-600 hover:shadow-xl transition-all duration-300">
              <p className="text-4xl font-bold text-green-600">
                {(event as any).attendanceCount || 0}
              </p>
              <p className="text-gray-700 text-sm font-medium mt-2">✓ Yoklama</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`/admin/events/${event.id}/participants`}
              className="btn-primary flex-1 text-center"
            >
              👥 Katılımcıları Yönet
            </a>
            <a
              href={`/admin/events/${event.id}/attendance`}
              className="btn-outline flex-1 text-center"
            >
              📊 Yoklama Kayıtları
            </a>
          </div>
        </div>

        {/* QR Code Display */}
        <div className="card-elevated p-8 sticky top-4 h-fit bg-gradient-to-b from-white to-primary-50 border-t-4 border-primary-600">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            🔲 Aktif QR Kodu
          </h2>

          {qrCode && (
            <div className="text-center mb-6 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <img src={qrCode} alt="Event QR Code" className="w-full mx-auto" />
            </div>
          )}

          {currentQRToken && (
            <div className="text-center mb-6 bg-white p-4 rounded-lg border-2 border-primary-300">
              <p className="text-sm text-gray-600 mb-2 font-medium">⏱️ Süresi dolana kadar:</p>
              <div className="inline-block bg-gradient-to-r from-primary-100 to-primary-200 text-primary-700 px-4 py-3 rounded-lg font-bold text-xl tracking-wider border border-primary-300">
                {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, "0")}
              </div>
              <p className="text-xs text-gray-500 mt-3 bg-gray-50 p-2 rounded">
                🔄 Otomatik 5 dakika sonra yenilenir
              </p>
            </div>
          )}

          <button
            onClick={handleManualRefresh}
            className="w-full btn-warning mb-3"
          >
            🔄 Şimdi Yenile
          </button>

          <button
            onClick={() => router.push(`/admin/events/${event.id}/participants`)}
            className="w-full btn-success"
          >
            ➕ Katılımcı Ekle
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
