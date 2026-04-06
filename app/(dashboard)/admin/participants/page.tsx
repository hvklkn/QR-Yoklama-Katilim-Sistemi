"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Event {
  id: string;
  name: string;
}

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  eventId: string;
  attendanceCount: number;
}

export default function AllParticipantsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchParticipants(selectedEventId);
    } else {
      setParticipants([]);
    }
  }, [selectedEventId]);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (data.success) {
        setEvents(data.data);
        if (data.data.length > 0) {
          setSelectedEventId(data.data[0].id);
        }
      }
    } catch (err) {
      console.error("Etkinlikler alınamadı:", err);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const fetchParticipants = async (eventId: string) => {
    try {
      setIsLoadingParticipants(true);
      setError(null);
      const res = await fetch(`/api/participants?eventId=${eventId}`);
      const data = await res.json();
      if (data.success) {
        setParticipants(data.data);
      } else {
        setError(data.error?.message || "Katılımcılar alınamadı");
      }
    } catch (err) {
      setError("Bir hata oluştu");
      console.error(err);
    } finally {
      setIsLoadingParticipants(false);
    }
  };

  const filteredParticipants = participants.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      (p.phone || "").includes(q)
    );
  });

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  return (
    <main className="flex-1 container-max py-8">
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 fade-in">
        <div>
          <Link href="/admin" className="text-primary-600 hover:text-primary-700 mb-2 font-medium transition-all duration-200 flex items-center gap-1">
            ← Admin Paneline Dön
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2">
            👥 Katılımcılar
          </h1>
          <p className="text-gray-600 font-medium">
            {selectedEvent ? selectedEvent.name : "Etkinlik seçin"}
            {!isLoadingParticipants && participants.length > 0 && (
              <span className="ml-2 text-green-600 font-bold">({participants.length} kişi)</span>
            )}
          </p>
        </div>
        {selectedEventId && (
          <Link
            href={`/admin/events/${selectedEventId}/participants`}
            className="btn-success"
          >
            ➕ Katılımcı Ekle / Yönet
          </Link>
        )}
      </div>

      {/* Event Selector */}
      <div className="card-elevated p-4 fade-in">
        {isLoadingEvents ? (
          <p className="text-gray-500 text-sm">Etkinlikler yükleniyor...</p>
        ) : events.length === 0 ? (
          <p className="text-gray-500 text-sm">Henüz etkinlik yok. <Link href="/admin/events/new" className="text-primary-600 font-medium">Etkinlik oluşturun →</Link></p>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Etkinlik Seçin</label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>{ev.name}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ara</label>
              <input
                type="text"
                placeholder="Ad, soyad veya e-posta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="card-elevated p-4 border-l-4 border-red-500 bg-red-50 text-red-700 fade-in">
          ❌ {error}
        </div>
      )}

      {/* Loading */}
      {isLoadingParticipants && (
        <div className="text-center py-16 fade-in">
          <div className="spinner w-10 h-10 border-4 border-gray-200 border-t-green-600 rounded-full mx-auto"></div>
          <p className="text-gray-600 mt-4 font-medium">Katılımcılar yükleniyor...</p>
        </div>
      )}

      {/* Empty */}
      {!isLoadingParticipants && selectedEventId && participants.length === 0 && !error && (
        <div className="card-elevated p-8 text-center border-2 border-dashed border-gray-300 fade-in">
          <p className="text-gray-600 text-lg font-medium mb-4">👥 Bu etkinliğe henüz katılımcı eklenmemiş</p>
          <Link href={`/admin/events/${selectedEventId}/participants`} className="btn-success">
            ➕ Katılımcı Ekle
          </Link>
        </div>
      )}

      {/* Participants Table */}
      {!isLoadingParticipants && filteredParticipants.length > 0 && (
        <div className="overflow-x-auto card-elevated fade-in">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">#</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">👤 Ad Soyad</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">📧 E-posta</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">📱 Telefon</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">✓ Yoklama</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">⚙️ Detay</th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipants.map((p, idx) => (
                <tr
                  key={p.id}
                  className={`border-b border-gray-200 hover:bg-green-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="px-6 py-4 text-gray-500 text-sm">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{p.firstName} {p.lastName}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{p.email}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{p.phone || <span className="text-gray-400">-</span>}</td>
                  <td className="px-6 py-4 text-center">
                    {(p as any).attendanceCount > 0 ? (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        ✓ Katıldı
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-500">
                        Katılmadı
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/events/${p.eventId}/participants`}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Yönet →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No results */}
      {!isLoadingParticipants && participants.length > 0 && filteredParticipants.length === 0 && (
        <div className="card-elevated p-6 text-center text-gray-500 fade-in">
          🔍 "{searchQuery}" için sonuç bulunamadı
        </div>
      )}
    </div>
    </main>
  );
}
