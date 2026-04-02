"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

interface ScanResponse {
  success: boolean;
  data?: {
    attendance: {
      id: string;
      status: string;
      participant: {
        firstName: string;
        lastName: string;
      };
    };
  };
  error?: {
    message: string;
  };
}

export default function ScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          scanQRCode();
        }
      } catch (_err) {
        setCameraError("Kamera açılamadı. Lütfen sayfa iznini kontrol edin.");
        console.error(_err);
      }
    };

    if (scanning) {
      startCamera();
    }

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [scanning]);

  const scanQRCode = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scanInterval = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setScanning(false);
          clearInterval(scanInterval);
          handleQRDetected(code.data);
        }
      }
    }, 100);

    return () => clearInterval(scanInterval);
  };

  const handleQRDetected = async (qrData: string) => {
    try {
      const url = new URL(qrData, window.location.origin);
      const token = url.searchParams.get("token");
      const eventId = url.searchParams.get("event");

      if (!token || !eventId) {
        setError("Geçersiz QR kodu formatı");
        setScanning(true);
        return;
      }

      setError(null);

      let latitude: number | undefined;
      let longitude: number | undefined;
      let accuracyMeter: number | undefined;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            accuracyMeter = position.coords.accuracy;
            submitAttendance(token, eventId, latitude, longitude, accuracyMeter);
          },
          (_err) => {
            console.warn("Konum alınamadı");
            submitAttendance(token, eventId);
          }
        );
      } else {
        submitAttendance(token, eventId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "QR işleme hatası");
      setScanning(true);
    }
  };

  const submitAttendance = async (
    token: string,
    eventId: string,
    latitude?: number,
    longitude?: number,
    accuracyMeter?: number
  ) => {
    try {
      const payload: any = {
        eventId,
        qrToken: token,
      };

      if (latitude !== undefined && longitude !== undefined) {
        payload.latitude = latitude;
        payload.longitude = longitude;
        payload.accuracyMeter = accuracyMeter;
      }

      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: ScanResponse = await response.json();

      if (data.success) {
        setSuccess(`✓ Hoş geldiniz, ${data.data?.attendance.participant.firstName}!`);
        setTimeout(() => {
          setScanning(true);
          setSuccess(null);
        }, 2000);
      } else {
        setError(`Hata: ${data.error?.message || "Tarama başarısız"}`);
        setTimeout(() => {
          setScanning(true);
          setError(null);
        }, 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sunucu hatası");
      setTimeout(() => {
        setScanning(true);
        setError(null);
      }, 3000);
    }
  };

  const handleRetry = () => {
    setError(null);
    setSuccess(null);
    setScanning(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex flex-col">
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 p-4">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">🔍 QR Tarama</h1>
          <button
            onClick={() => router.back()}
            className="text-white hover:bg-white/20 px-3 py-2 rounded transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-lg w-full mx-auto px-4 py-8 flex flex-col items-center justify-center">
        {cameraError ? (
          <div className="bg-red-100 border-2 border-red-500 rounded-lg p-6 text-center w-full">
            <h2 className="text-xl font-bold text-red-700 mb-2">Kamera Hatası</h2>
            <p className="text-red-600 mb-4">{cameraError}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Yenile
            </button>
          </div>
        ) : (
          <>
            <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden shadow-2xl mb-6">
              <video
                ref={videoRef}
                className={`w-full h-full object-cover ${!scanning ? "opacity-50" : ""}`}
              />
              <canvas ref={canvasRef} className="hidden" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`w-2/3 h-2/3 border-2 rounded-lg ${
                    success
                      ? "border-success-500 bg-success-500/10"
                      : error
                        ? "border-danger-500 bg-danger-500/10"
                        : "border-primary-300 bg-primary-300/5"
                  } transition-all duration-300`}
                />
                {scanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin">
                      <div className="w-16 h-16 border-2 border-primary-200 border-t-white rounded-full" />
                    </div>
                  </div>
                )}
              </div>

              {success && (
                <div className="absolute inset-0 flex items-center justify-center bg-success-600/80 backdrop-blur-sm">
                  <div className="text-center text-white">
                    <p className="text-4xl mb-2">✓</p>
                    <p className="text-lg font-semibold">{success}</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-danger-600/80 backdrop-blur-sm">
                  <div className="text-center text-white">
                    <p className="text-4xl mb-2">✕</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}
            </div>

            {scanning && !success && !error && (
              <div className="text-center space-y-3">
                <p className="text-white text-sm opacity-90">QR kodunu kamera içine getirin</p>
                <div className="flex justify-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <div
                    className="w-2 h-2 bg-white rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <div
                    className="w-2 h-2 bg-white rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              </div>
            )}

            {!scanning && (
              <button
                onClick={handleRetry}
                className="mt-6 px-6 py-3 bg-white text-primary-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                📱 Tekrar Tara
              </button>
            )}
          </>
        )}
      </div>

      <div className="bg-white/10 backdrop-blur-sm border-t border-white/20 p-4 text-center text-white text-sm opacity-75">
        <p>Lütfen yeterli ışıkta QR kodu tarayınız</p>
      </div>
    </div>
  );
}
