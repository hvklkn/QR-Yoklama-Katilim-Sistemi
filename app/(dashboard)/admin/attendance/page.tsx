"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Event {
  id: string;
  name: string;
}

interface Attendance {
  id: string;
  participantId: string;
  scanTime: string;
  status: string;
  errorMessage: string | null;
  latitude: number | null;
  longitude: number | null;
  participant: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  };
}

const STATUS_LABELS: Record<string, string> = {
  success: "Başarılı",
  invalid_qr: "Geçersiz QR",
  expired_qr: "QR Süresi Dolmuş",
  location_failed: "Konum Başarısız",
  unauthorized: "Yetkisiz",
  manual_present: "Manuel Var",
};

const STATUS_STYLES: Record<string, string> = {
  success: "bg-green-100 text-green-800",
  manual_present: "bg-blue-100 text-blue-800",
  invalid_qr: "bg-red-100 text-red-800",
  expired_qr: "bg-yellow-100 text-yellow-800",
  location_failed: "bg-yellow-100 text-yellow-800",
  unauthorized: "bg-red-100 text-red-800",
};

export default function AllAttendancePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingAttendances, setIsLoadingAttendances] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchAttendances(selectedEventId);
    } else {
      setAttendances([]);
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

  const fetchAttendances = async (eventId: string) => {
    try {
      setIsLoadingAttendances(true);
      setError(null);
      const res = await fetch(`/api/attendance/history?eventId=${eventId}`);
      const data = await res.json();
      if (data.success) {
        setAttendances(data.data.attendances);
      } else {
        setError(data.error?.message || "Yoklama kayıtları alınamadı");
      }
    } catch (err) {
      setError("Bir hata oluştu");
      console.error(err);
    } finally {
      setIsLoadingAttendances(false);
    }
  };

  const downloadCSV = async () => {
    if (!selectedEventId) return;
    try {
      const res = await fetch(`/api/attendance/history?eventId=${selectedEventId}&format=csv`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `yoklama-${selectedEventId}-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("CSV indirilemedi:", err);
    }
  };

  const filtered = attendances.filter((a) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      a.participant.firstName.toLowerCase().includes(q) ||
      a.participant.lastName.toLowerCase().includes(q) ||
      a.participant.email.toLowerCase().includes(q);
    const matchesStatus = filterStatus === "all" || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: attendances.length,
    success: attendances.filter((a) => ["success", "manual_present"].includes(a.status)).length,
    failed: attendances.filter((a) => !["success", "manual_present"].includes(a.status)).length,
  };

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 fade-in">
        <div>
          <Link href="/admin" className="text-primary-600 hover:text-primary-700 mb-2 font-medium transition-all duration-200 flex items-center gap-1">
            ← Admin Paneline Dön
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">
            ✓ Yoklama Kayıtları
          </h1>
          <p className="text-gray-600 font-medium">
            {selectedEvent ? selectedEvent.name : "Etkinlik seçin"}
          </p>
        </div>
        <div className="flex gap-2">
          {selectedEventId && (
            <>
              <button onClick={downloadCSV} className="btn-warning">
                📥 CSV İndir
              </button>
              <Link href={`/admin/events/${selectedEventId}/attendance`} className="btn-outline">
                Detaylı Görünüm →
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      {!isLoadingAttendances && attendances.length > 0 && (
        <div className="grid grid-cols-3 gap-4 fade-in">
          <div className="card-elevated p-4 text-center border-t-4 border-blue-600 bg-gradient-to-br from-blue-50 to-white">
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-gray-600 text-xs font-medium mt-1">Toplam Tarama</p>
          </div>
          <div className="card-elevated p-4 text-center border-t-4 border-green-600 bg-gradient-to-br from-green-50 to-white">
            <p className="text-2xl font-bold text-green-600">{stats.success}</p>
            <p className="text-gray-600 text-xs font-medium mt-1">✅ Başarılı</p>
          </div>
          <div className="card-elevated p-4 text-center border-t-4 border-red-600 bg-gradient-to-br from-red-50 to-white">
            <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            <p className="text-gray-600 text-xs font-medium mt-1">❌ Başarısız</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card-elevated p-4 fade-in">
        {isLoadingEvents ? (
          <p className="text-gray-500 text-sm">Etkinlikler yükleniyor...</p>
        ) : events.length === 0 ? (
          <p className="text-gray-500 text-sm">Henüz etkinlik yok.</p>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Etkinlik</label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>{ev.name}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Durum Filtrele</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">Tümü</option>
                <option value="success">Başarılı</option>
                <option value="manual_present">Manuel Var</option>
                <option value="invalid_qr">Geçersiz QR</option>
                <option value="expired_qr">Süresi Dolmuş</option>
                <option value="location_failed">Konum Başarısız</option>
                <option value="unauthorized">Yetkisiz</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Katılımcı Ara</label>
              <input
                type="text"
                placeholder="Ad, soyad veya e-posta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      {isLoadingAttendances && (
        <div className="text-center py-16 fade-in">
          <div className="spinner w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full mx-auto"></div>
          <p className="text-gray-600 mt-4 font-medium">Yoklama kayıtları yükleniyor...</p>
        </div>
      )}

      {/* Empty */}
      {!isLoadingAttendances && selectedEventId && attendances.length === 0 && !error && (
        <div className="card-elevated p-8 text-center border-2 border-dashed border-gray-300 fade-in">
          <p className="text-gray-600 text-lg font-medium">📭 Bu etkinliğe henüz yoklama kaydı yok</p>
        </div>
      )}

      {/* Table */}
      {!isLoadingAttendances && filtered.length > 0 && (
        <div className="overflow-x-auto card-elevated fade-in">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">👤 Katılımcı</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">📧 E-posta</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">🕐 Tarama Tarihi</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">📍 Durum</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">⚠️ Hata</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, idx) => (
                <tr
                  key={a.id}
                  className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {a.participant.firstName} {a.participant.lastName}
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{a.participant.email}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">
                    {new Date(a.scanTime).toLocaleString("tr-TR")}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_STYLES[a.status] || "bg-gray-100 text-gray-800"}`}>
                      {STATUS_LABELS[a.status] || a.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {a.errorMessage ? (
                      <span className="text-red-600 font-medium">{a.errorMessage}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No search results */}
      {!isLoadingAttendances && attendances.length > 0 && filtered.length === 0 && (
        <div className="card-elevated p-6 text-center text-gray-500 fade-in">
          🔍 Filtre kriterlerine uyan kayıt bulunamadı
        </div>
      )}
    </div>
  );
}
