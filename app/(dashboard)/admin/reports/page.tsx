"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EventDTO } from "@/types";

interface ReportData {
  totalEvents: number;
  totalParticipants: number;
  totalAttendances: number;
  avgAttendanceRate: number;
  events: EventDTO[];
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/events");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Veri alınamadı");

      const events: EventDTO[] = json.data;
      const totalParticipants = events.reduce((s, e) => s + (e.participantCount || 0), 0);
      const totalAttendances = events.reduce((s, e) => s + (e.attendanceCount || 0), 0);
      const avgAttendanceRate =
        totalParticipants > 0
          ? Math.round((totalAttendances / totalParticipants) * 100)
          : 0;

      setData({
        totalEvents: events.length,
        totalParticipants,
        totalAttendances,
        avgAttendanceRate,
        events,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCSV = (event: EventDTO) => {
    const rows = [
      ["Etkinlik", "Katılımcı Sayısı", "Yoklama Sayısı", "Katılım Oranı"],
      [
        event.name,
        String(event.participantCount || 0),
        String(event.attendanceCount || 0),
        event.participantCount
          ? `%${Math.round(((event.attendanceCount || 0) / event.participantCount) * 100)}`
          : "%0",
      ],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rapor-${event.name.replace(/\s+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAllCSV = () => {
    if (!data) return;
    const rows = [
      ["Etkinlik", "Başlangıç", "Konum", "Katılımcı", "Yoklama", "Oran"],
      ...data.events.map((e) => [
        e.name,
        new Date(e.startTime).toLocaleDateString("tr-TR"),
        e.location,
        String(e.participantCount || 0),
        String(e.attendanceCount || 0),
        e.participantCount
          ? `%${Math.round(((e.attendanceCount || 0) / e.participantCount) * 100)}`
          : "%0",
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tum-etkinlik-raporlari.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
    <div className="container-max py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 fade-in">
        <div>
          <Link href="/admin" className="text-primary-600 hover:text-primary-700 mb-2 font-medium transition-all duration-200 flex items-center gap-1">
            ← Admin Paneline Dön
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-2">
            📊 Raporlar
          </h1>
          <p className="text-gray-600 font-medium">Tüm etkinliklerin istatistik ve analizleri</p>
        </div>
        {data && data.events.length > 0 && (
          <button onClick={downloadAllCSV} className="btn-success">
            📥 CSV İndir
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 font-medium">
          ❌ {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-16">
          <div className="spinner w-12 h-12 border-4 border-gray-200 border-t-purple-600 rounded-full mx-auto mb-4 animate-spin"></div>
          <p className="text-gray-600 font-medium">Raporlar yükleniyor...</p>
        </div>
      ) : data ? (
        <>
          {/* Özet Kartlar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="card-elevated p-6 border-t-4 border-purple-500 bg-gradient-to-br from-purple-50 to-white fade-in">
              <p className="text-sm text-gray-500 mb-1">Toplam Etkinlik</p>
              <p className="text-4xl font-black text-purple-600">{data.totalEvents}</p>
            </div>
            <div className="card-elevated p-6 border-t-4 border-green-500 bg-gradient-to-br from-green-50 to-white fade-in">
              <p className="text-sm text-gray-500 mb-1">Toplam Katılımcı</p>
              <p className="text-4xl font-black text-green-600">{data.totalParticipants}</p>
            </div>
            <div className="card-elevated p-6 border-t-4 border-blue-500 bg-gradient-to-br from-blue-50 to-white fade-in">
              <p className="text-sm text-gray-500 mb-1">Toplam Yoklama</p>
              <p className="text-4xl font-black text-blue-600">{data.totalAttendances}</p>
            </div>
            <div className="card-elevated p-6 border-t-4 border-orange-500 bg-gradient-to-br from-orange-50 to-white fade-in">
              <p className="text-sm text-gray-500 mb-1">Ort. Katılım Oranı</p>
              <p className="text-4xl font-black text-orange-600">%{data.avgAttendanceRate}</p>
            </div>
          </div>

          {/* Etkinlik Bazlı Tablo */}
          {data.events.length === 0 ? (
            <div className="card-elevated p-12 text-center border-2 border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">Henüz etkinlik yok</p>
              <Link href="/admin/events/new" className="btn-primary mt-4 inline-flex">
                ➕ Etkinlik Oluştur
              </Link>
            </div>
          ) : (
            <div className="card-elevated overflow-x-auto">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Etkinlik Bazlı Rapor</h2>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">📅 Etkinlik</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">📍 Konum</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">👥 Katılımcı</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">✓ Yoklama</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">📈 Oran</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">⚙️ İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {data.events.map((event, idx) => {
                    const rate =
                      event.participantCount
                        ? Math.round(((event.attendanceCount || 0) / event.participantCount) * 100)
                        : 0;
                    return (
                      <tr
                        key={event.id}
                        className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-transparent transition-all duration-200 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{event.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {new Date(event.startTime).toLocaleDateString("tr-TR")}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">{event.location}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="badge-info font-bold">{event.participantCount || 0}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="badge-success font-bold">{event.attendanceCount || 0}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${rate >= 75 ? "bg-green-500" : rate >= 50 ? "bg-yellow-500" : "bg-red-400"}`}
                                style={{ width: `${rate}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-gray-700">%{rate}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => downloadCSV(event)}
                            className="btn-outline btn-small"
                          >
                            ⬇️ CSV
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : null}
    </div>
    </>
  );
}
