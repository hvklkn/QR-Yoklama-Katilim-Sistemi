"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createEventSchema, CreateEventInput } from "@/lib/validators";

export default function CreateEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
    latitude: "",
    longitude: "",
    radius: "50",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      setError("Cihazınız konumdurumu özelliğini desteklemiyor");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }));
      },
      (error) => {
        setError(`Konum alınamadı: ${error.message}`);
      }
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log("[EventForm] Form submission started", formData);
      
      // Parse data for API
      const payload: CreateEventInput = {
        name: formData.name,
        description: formData.description || undefined,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        location: formData.location,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        radius: formData.radius ? parseFloat(formData.radius) : 50,
      };

      console.log("[EventForm] Payload prepared", payload);

      // Validate
      const validation = createEventSchema.safeParse(payload);
      if (!validation.success) {
        const errors = validation.error.errors
          .map((e) => e.message)
          .join(", ");
        console.error("[EventForm] Validation failed", validation.error.errors);
        setError(`Doğrulama hatası: ${errors}`);
        setIsLoading(false);
        return;
      }

      console.log("[EventForm] Validation passed, sending to API");

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("[EventForm] API response status", response.status);

      const data = await response.json();
      console.log("[EventForm] API response data", data);

      if (!response.ok) {
        console.error("[EventForm] API error", data);
        throw new Error(data.error?.message || "Etkinlik oluşturulamadı");
      }

      console.log("[EventForm] Event created successfully", data.data.id);
      router.push(`/admin/events/${data.data.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Bir hata oluştu";
      console.error("[EventForm] Error during submission", err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8 fade-in">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-2">
          ➕ Yeni Etkinlik Oluştur
        </h1>
        <p className="text-gray-600 font-medium">Etkinlik bilgilerini doldurup QR kod sistemi oluşturun</p>
      </div>

      {error && (
        <div className="mb-6 p-4 card-elevated border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-white text-red-700 animate-pulse fade-in">
          🚨 {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card-elevated p-8 max-w-2xl bg-gradient-to-br from-white to-gray-50 fade-in">
        <div className="space-y-6">
          {/* Event Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2">
              📛 Etkinlik Adı *
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="örn: Bilgisayar Mühendisliği 101"
              className="input-base"
              required
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-bold text-gray-900 mb-2">
              📝 Açıklama
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Etkinlik detaylarını yazın..."
              className="input-base"
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* DateTime */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-bold text-gray-900 mb-2">
                🕐 Başlangıç Tarihi/Saati *
              </label>
              <input
                id="startTime"
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className="input-base"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-bold text-gray-900 mb-2">
                ⏹️ Bitiş Tarihi/Saati *
              </label>
              <input
                id="endTime"
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                className="input-base"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-bold text-gray-900 mb-2">
              📍 Lokasyon Adı *
            </label>
            <input
              id="location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="örn: Amfi A, Sınıf 201"
              className="input-base"
              required
              disabled={isLoading}
            />
          </div>

          {/* Coordinates */}
          <div className="card p-4 border-l-4 border-blue-600 bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-bold text-gray-900">
                🧭 GPS Koordinatları (Opsiyonel)
              </label>
              <button
                type="button"
                onClick={handleGetLocation}
                className="btn-warning btn-small"
                disabled={isLoading}
              >
                📌 Konumu Al
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="number"
                name="latitude"
                step="0.0001"
                value={formData.latitude}
                onChange={handleInputChange}
                placeholder="Latitude"
                className="input-base"
                disabled={isLoading}
              />
              <input
                type="number"
                name="longitude"
                step="0.0001"
                value={formData.longitude}
                onChange={handleInputChange}
                placeholder="Longitude"
                className="input-base"
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-gray-600 mt-3 font-medium">
              💡 GPS koordinatları belirtirseniz tarama sırasında lokasyon doğrulaması yapılacaktır.
            </p>
          </div>

          {/* Geofence Radius */}
          <div>
            <label htmlFor="radius" className="block text-sm font-bold text-gray-900 mb-2">
              📏 Geofence Yarıçapı (Meter)
            </label>
            <input
              id="radius"
              type="number"
              name="radius"
              value={formData.radius}
              onChange={handleInputChange}
              min="5"
              max="1000"
              step="5"
              className="input-base"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-600 mt-2 font-medium">
              💡 Katılımcılar bu yarıçap içinde olmalı QR kod tarayabilecekler (varsayılan: 50m)
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-success"
            >
              {isLoading ? "⏳ Oluşturuluyor..." : "✅ Etkinlik Oluştur"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
              disabled={isLoading}
            >
              ← İptal
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
