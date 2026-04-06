"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EventDTO } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

export default function EventsPage() {
  const router = useRouter();
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
    <div className="container-max py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 fade-in">
        <div>
          <Link href="/admin" className="text-primary-600 hover:text-primary-700 mb-2 font-medium transition-all duration-200 flex items-center gap-1">
            ← Admin Paneline Dön
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-2">
            📅 Etkinlikler
          </h1>
          <p className="text-gray-600 font-medium">
            {isLoading ? "Yükleniyor..." : `${events.length} aktif etkinlik`}
          </p>
        </div>
        <Link href="/admin/events/new" className="btn-success">
          ➕ Yeni Etkinlik
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 card-elevated border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-white text-red-700 animate-pulse">
          🚨 {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-16 fade-in">
          <div className="inline-block">
            <div className="spinner w-12 h-12 border-4 border-gray-200 border-t-primary-600 rounded-full"></div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Etkinlikler yükleniyor...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 card-elevated bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-300 fade-in">
          <p className="text-gray-600 mb-6 text-lg font-medium">📭 Henüz etkinlik oluşturulmamış</p>
          <Link href="/admin/events/new" className="btn-success">
            ➕ İlk Etkinliği Oluştur
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {events.map((event, idx) => (
            <Link
              key={event.id}
              href={`/admin/events/${event.id}`}
              className="card-hover card-elevated p-6 border-l-4 border-primary-600 group fade-in"
              style={{ 
                animationDelay: `${idx * 50}ms`
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    🔲 {event.name}
                  </h3>
                  {event.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div className="badge-info">
                      📍 {event.location}
                    </div>
                    <div className="badge-info">
                      🕐 {new Date(event.startTime).toLocaleDateString("tr-TR")}
                    </div>
                    <div className="badge-success">
                      👥 {(event as any).participantCount || 0}
                    </div>
                    <div className="badge-info">
                      ✓ {(event as any).attendanceCount || 0}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-3 pt-2 sm:pt-0">
                  <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 rounded-full text-sm font-semibold whitespace-nowrap">
                    {formatDistanceToNow(new Date(event.startTime), {
                      addSuffix: true,
                      locale: tr,
                    })}
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(event.id);
                    }}
                    className="btn-danger btn-small hover:animate-pulse"
                  >
                    🗑️ Sil
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
    </>
  );
}
