"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

interface Event {
  id: string;
  name: string;
}

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

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
    message?: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export default function ScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  // Event & Participant Selection
  const [events, setEvents] = useState<Event[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>("");
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);

  // Scanning states
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<{
    status: "checking" | "success" | "error" | "unavailable";
    message?: string;
  } | null>(null);

  // Unregistered participant form
  const [showUnregisteredForm, setShowUnregisteredForm] = useState(false);
  const [unregisteredForm, setUnregisteredForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    qrToken: "",
    eventId: "",
  });
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Load events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Load participants when event is selected
  useEffect(() => {
    if (selectedEventId) {
      fetchParticipants(selectedEventId);
    }
  }, [selectedEventId]);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      const data = await response.json();
      if (data.success) {
        setEvents(data.data);
      }
    } catch (err) {
      console.error("Events yüklenemedi:", err);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const fetchParticipants = async (eventId: string) => {
    try {
      setIsLoadingParticipants(true);
      const response = await fetch(`/api/participants?eventId=${eventId}`);
      const data = await response.json();
      if (data.success) {
        setParticipants(data.data);
        setSelectedParticipantId(""); // Reset participant selection
      }
    } catch (err) {
      console.error("Katılımcılar yüklenemedi:", err);
    } finally {
      setIsLoadingParticipants(false);
    }
  };

  const startScanning = async () => {
    if (!selectedEventId) {
      setError("Lütfen etkinlik seçin");
      return;
    }

    setScanning(true);
    setCameraError(null);
    
    try {
      // iOS/Safari compatible constraints
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        // iOS specific setup
        (videoRef.current as any)["webkit-playsinline"] = true;
        (videoRef.current as any).playsInline = true;
        
        videoRef.current.srcObject = stream;
        videoRef.current.play().then(() => {
          console.log("Video started successfully");
          scanQRCode();
        }).catch((err) => {
          console.error("Video play failed:", err);
          setCameraError("Video oynatılamadı. Lütfen tarayıcı izinlerini kontrol edin.");
          setScanning(false);
        });
      }
    } catch (_err) {
      const errorMsg = (_err as any)?.name === "NotAllowedError"
        ? "Kamera iznini reddettiniz. Ayarlar > Gizlilik > Kamera'dan izin verin."
        : (_err as any)?.name === "NotFoundError"
          ? "Cihazda kamera bulunamadı."
          : "Kamera açılamadı. HTTPS üzerinden erişmeyi deneyin veya sayfayı yenileyin.";
      setCameraError(errorMsg);
      setScanning(false);
      console.error("Camera error:", _err);
    }
  };

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

      if (!token || !eventId || !selectedEventId) {
        setError("Geçersiz QR kodu formatı");
        setScanning(false);
        return;
      }

      setError(null);
      setLocationStatus({ status: "checking", message: "Konum bilgisi alınıyor..." });

      // Eğer katılımcı seçilmişse → Direkt tarama yap
      if (selectedParticipantId) {
        let latitude: number | undefined;
        let longitude: number | undefined;
        let accuracyMeter: number | undefined;

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              latitude = position.coords.latitude;
              longitude = position.coords.longitude;
              accuracyMeter = position.coords.accuracy;
              setLocationStatus({ status: "success", message: `✓ Konum alındı (±${Math.round(accuracyMeter)}m)` });
              setTimeout(() => {
                submitAttendance(token, eventId, selectedParticipantId, latitude, longitude, accuracyMeter);
              }, 500);
            },
            (_err) => {
              console.warn("Konum alınamadı:", _err);
              setLocationStatus({ status: "unavailable", message: "Konum bilgisi alınamadı" });
              setError("📍 Lütfen cihazınızın konum servisini açın");
              setScanning(false);
            },
            {
              timeout: 5000,
              enableHighAccuracy: false, // Basic accuracy is sufficient
            }
          );
        } else {
          setLocationStatus({ status: "unavailable", message: "Konum hizmeti kullanılamıyor" });
          setError("📍 Cihazınız konum hizmetlerini desteklemiyor");
          setScanning(false);
        }
      } else {
        // Katılımcı seçilmemişse → Kayıtlı olmayan katılımcı formu aç
        setLocationStatus(null);
        setUnregisteredForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          qrToken: token,
          eventId: selectedEventId,
        });
        setShowUnregisteredForm(true);
        setScanning(false);
      }
    } catch (err) {
      setLocationStatus(null);
      setError(err instanceof Error ? err.message : "QR işleme hatası");
      setScanning(false);
    }
  };

  const submitAttendance = async (
    token: string,
    eventId: string,
    participantId: string,
    latitude?: number,
    longitude?: number,
    accuracyMeter?: number
  ) => {
    try {
      const payload: any = {
        eventId,
        participantId,
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
        setLocationStatus(null);
        setSuccess(`✓ Hoş geldiniz, ${data.data?.attendance.participant.firstName}!`);
        setTimeout(() => {
          setScanning(false);
          setSuccess(null);
          setSelectedParticipantId(""); // Reset for next participant
        }, 2000);
      } else {
        // Handle specific location errors
        const errorCode = data.error?.code;
        const errorMessage = data.error?.message || "Tarama başarısız";

        if (errorCode === "LOCATION_UNAVAILABLE") {
          setLocationStatus({
            status: "unavailable",
            message: errorMessage,
          });
          setError("📍 " + errorMessage);
        } else if (errorCode === "LOCATION_OUT_OF_RANGE") {
          setLocationStatus({
            status: "error",
            message: errorMessage,
          });
          setError("📍 " + errorMessage);
        } else {
          setError(`Hata: ${errorMessage}`);
        }

        setTimeout(() => {
          setScanning(false);
          setError(null);
          setLocationStatus(null);
        }, 3000);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sunucu hatası";
      setError("❌ " + message);
      setTimeout(() => {
        setScanning(false);
        setError(null);
        setLocationStatus(null);
      }, 3000);
    }
  };

  const handleRetry = () => {
    setError(null);
    setSuccess(null);
    setScanning(false);
  };

  const handleUnregisteredFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!unregisteredForm.firstName || !unregisteredForm.lastName || !unregisteredForm.email) {
      setError("Ad, Soyad ve E-posta alanları zorunludur");
      return;
    }

    setIsSubmittingForm(true);
    setError(null);
    setLocationStatus({ status: "checking", message: "Konum bilgisi alınıyor..." });

    try {
      // Yeni katılımcı oluştur
      const createResponse = await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: unregisteredForm.eventId,
          firstName: unregisteredForm.firstName,
          lastName: unregisteredForm.lastName,
          email: unregisteredForm.email,
          phone: unregisteredForm.phone || undefined,
        }),
      });

      const createData = await createResponse.json();

      if (!createResponse.ok) {
        throw new Error(createData.error?.message || "Katılımcı oluşturulamadı");
      }

      const newParticipantId = createData.data.id;

      // Konum al ve tarama yap
      let latitude: number | undefined;
      let longitude: number | undefined;
      let accuracyMeter: number | undefined;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            accuracyMeter = position.coords.accuracy;
            setLocationStatus({ status: "success", message: `✓ Konum alındı (±${Math.round(accuracyMeter)}m)` });
            setTimeout(() => {
              submitAttendance(
                unregisteredForm.qrToken,
                unregisteredForm.eventId,
                newParticipantId,
                latitude,
                longitude,
                accuracyMeter
              );
            }, 500);
          },
          (_err) => {
            console.warn("Konum alınamadı:", _err);
            setLocationStatus({ status: "unavailable", message: "Konum alınamadı" });
            setError("📍 Lütfen cihazınızın konum servisini açın ve baştan deneyin.");
            setShowUnregisteredForm(false);
            setIsSubmittingForm(false);
          },
          {
            timeout: 5000,
            enableHighAccuracy: false,
          }
        );
      } else {
        setLocationStatus({ status: "unavailable", message: "Konum hizmeti kullanılamıyor" });
        setError("📍 Cihazınız konum hizmetlerini desteklemiyor");
        setShowUnregisteredForm(false);
        setIsSubmittingForm(false);
      }

      setShowUnregisteredForm(false);
      setUnregisteredForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        qrToken: "",
        eventId: "",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "İşlem başarısız";
      setError(message);
      setLocationStatus(null);
      setIsSubmittingForm(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-gray-800 flex flex-col"
    >
      <div className="relative z-10 flex flex-col h-screen">
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
            {/* Event & Participant Selection */}
            {!scanning ? (
              <div className="w-full max-w-sm mx-auto space-y-8">
                {/* Info Card */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-white text-sm space-y-3">
                  <p className="text-center">
                    Etkinlik seçin, QR kodunu tarayın. Katılımcısı varsa seçin, yoksa form doldur.
                  </p>
                  <div className="pt-3 border-t border-white/20 text-xs text-white/80">
                    <p className="font-semibold mb-1">📍 Konum Doğrulaması:</p>
                    <p>Etkinlik konumu belirlenmişse, katılımı onaylamak için konum bilgisi gereklidir.</p>
                  </div>
                </div>

                {/* Event Selection */}
                <div className="space-y-3">
                  <label className="block text-white font-bold text-lg">Etkinlik Seçin</label>
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    disabled={isLoadingEvents}
                    className="w-full px-4 py-3 rounded-lg border-2 border-white/30 bg-white text-gray-800 font-medium focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  >
                    <option value="">
                      {isLoadingEvents ? "Etkinlikler yükleniyor..." : "Etkinlik seçin"}
                    </option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Participant Selection - Optional */}
                {selectedEventId && (
                  <div className="space-y-3 opacity-95">
                    <div className="flex items-center justify-between">
                      <label className="text-white font-semibold">Katılımcı Seçin</label>
                      <span className="text-white/70 text-xs bg-white/10 px-2 py-1 rounded">
                        İsteğe Bağlı
                      </span>
                    </div>
                    <select
                      value={selectedParticipantId}
                      onChange={(e) => setSelectedParticipantId(e.target.value)}
                      disabled={isLoadingParticipants || participants.length === 0}
                      className="w-full px-4 py-3 rounded-lg border-2 border-white/20 bg-white text-gray-800 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    >
                      <option value="">
                        {isLoadingParticipants
                          ? "Katılımcılar yükleniyor..."
                          : participants.length === 0
                            ? "Bu etkinliğe katılımcı yok"
                            : "Seçmemek için boş bırak"}
                      </option>
                      {participants.map((participant) => (
                        <option key={participant.id} value={participant.id}>
                          {participant.firstName} {participant.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Scan Button */}
                <button
                  onClick={startScanning}
                  disabled={!selectedEventId}
                  className={`w-full py-4 rounded-lg font-bold text-lg transition-all transform ${
                    selectedEventId
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:scale-105 hover:shadow-2xl active:scale-95"
                      : "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
                  }`}
                >
                  📷 QR Kodunu Tara
                </button>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/20 border-2 border-red-400 text-red-100 px-4 py-3 rounded-lg text-sm">
                    ⚠️ {error}
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Scanner UI */}
                <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden shadow-2xl mb-6">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    className={!scanning ? "opacity-50" : ""}
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

                <div className="text-center w-full">
                  <p className="text-white text-sm opacity-90 mb-4">QR kodunu kamera içine getirin</p>
                  
                  {/* Location Status Display */}
                  {locationStatus && (
                    <div className={`mb-4 px-4 py-2 rounded-lg text-sm font-medium ${
                      locationStatus.status === "checking" ? "bg-yellow-500/20 text-yellow-100" :
                      locationStatus.status === "success" ? "bg-green-500/20 text-green-100" :
                      "bg-red-500/20 text-red-100"
                    }`}>
                      {locationStatus.status === "checking" && "🔍 "}
                      {locationStatus.status === "success" && "✓ "}
                      {locationStatus.status === "unavailable" && "✕ "}
                      {locationStatus.status === "error" && "⚠️ "}
                      {locationStatus.message}
                    </div>
                  )}
                  
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

                <button
                  onClick={handleRetry}
                  className="mt-6 px-6 py-3 bg-white text-primary-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                >
                  ← Geri Dön
                </button>
              </>
            )}
          </>
        )}
      </div>

      {/* Unregistered Participant Form Modal */}
      {showUnregisteredForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Katılımcı Kaydı
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
              Sistemde kayıtlı değilsiniz. Lütfen bilgilerinizi girin.
            </p>

            <form onSubmit={handleUnregisteredFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={unregisteredForm.firstName}
                  onChange={(e) =>
                    setUnregisteredForm({
                      ...unregisteredForm,
                      firstName: e.target.value,
                    })
                  }
                  placeholder="Adınız"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Soyad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={unregisteredForm.lastName}
                  onChange={(e) =>
                    setUnregisteredForm({
                      ...unregisteredForm,
                      lastName: e.target.value,
                    })
                  }
                  placeholder="Soyadınız"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={unregisteredForm.email}
                  onChange={(e) =>
                    setUnregisteredForm({
                      ...unregisteredForm,
                      email: e.target.value,
                    })
                  }
                  placeholder="email@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={unregisteredForm.phone}
                  onChange={(e) =>
                    setUnregisteredForm({
                      ...unregisteredForm,
                      phone: e.target.value,
                    })
                  }
                  placeholder="+90 5xx xxx xxxx"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowUnregisteredForm(false);
                    setUnregisteredForm({
                      firstName: "",
                      lastName: "",
                      email: "",
                      phone: "",
                      qrToken: "",
                      eventId: "",
                    });
                    setError(null);
                  }}
                  disabled={isSubmittingForm}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingForm}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isSubmittingForm ? "Kayıt ediliyor..." : "Kayıt ol ve Tamdır"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-sm border-t border-white/20 p-4 text-center text-white text-sm opacity-75">
        <p>Lütfen yeterli ışıkta QR kodu tarayınız</p>
      </div>
      </div>
    </div>
  );
}
