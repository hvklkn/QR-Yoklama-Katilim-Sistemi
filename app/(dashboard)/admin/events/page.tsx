"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EventDTO } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

export default function EventsPage() {
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/events");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Etkinlikler yüklenemedi");
      }

      setEvents(data.data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Bir hata oluştu";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu etkinliği silmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Etkinlik silinemedi");
      }

      setEvents(events.filter((e) => e.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Bir hata oluştu";
      alert(message);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Etkinlikler</h1>
          <p className="text-gray-600">
            {events.length} etkinlik ({isLoading ? "yükleniyor..." : "toplam"})
          </p>
        </div>
        <Link href="/admin/events/new" className="btn-primary">
          + Yeni Etkinlik
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Etkinlikler yükleniyor...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 card">
          <p className="text-gray-600 mb-4">Henüz etkinlik oluşturulmamış</p>
          <Link href="/admin/events/new" className="btn-primary">
            İlk Etkinliği Oluştur
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/admin/events/${event.id}`}
              className="card p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {event.name}
                  </h3>
                  {event.description && (
                    <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>📍 {event.location}</span>
                    <span>
                      🕐{" "}
                      {new Date(event.startTime).toLocaleDateString("tr-TR")}
                    </span>
                    <span>👥 {(event as any).participantCount || 0} katılımcı</span>
                    <span>✓ {(event as any).attendanceCount || 0} yoklama</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 text-sm text-gray-500">
                  <span>
                    {formatDistanceToNow(new Date(event.startTime), {
                      addSuffix: true,
                      locale: tr,
                    })}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(event.id);
                      }}
                      className="btn-danger btn-small"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
