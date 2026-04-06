"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ApiResponse } from "@/types";

interface Attendance {
  id: string;
  eventId: string;
  participantId: string;
  qrTokenId: string;
  latitude: number | null;
  longitude: number | null;
  accuracyMeter: number | null;
  scanTime: string;
  status: string;
  errorMessage: string | null;
  participant: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  };
}

export default function AttendancePage() {
  const params = useParams();
  const eventId = params.id as string;

  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
  });

  useEffect(() => {
    fetchAttendances();
  }, [eventId]);

  const fetchAttendances = async () => {
    try {
      const response = await fetch(
        `/api/attendance/history?eventId=${eventId}`
      );
      const data: ApiResponse<{
        attendances: Attendance[];
      }> = await response.json();

      if (data.success && data.data) {
        setAttendances(data.data.attendances);

        // Calculate stats
        const total = data.data.attendances.length;
        const success = data.data.attendances.filter(
          (a) => a.status === "success"
        ).length;

        setStats({
          total,
          success,
          failed: total - success,
        });
      } else {
        setError(data.error?.message || "Yoklama alınamadı");
      }
    } catch (err) {
      setError("Yoklama alınırken hata oluştu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = async () => {
    try {
      const response = await fetch(
        `/api/attendance/history?eventId=${eventId}&format=csv`
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance-${eventId}-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError("CSV indirilemedi");
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: { [key: string]: string } = {
      success: "bg-success-100 text-success-800",
      invalid_qr: "bg-danger-100 text-danger-800",
      expired_qr: "bg-warning-100 text-warning-800",
      location_failed: "bg-warning-100 text-warning-800",
      unauthorized: "bg-danger-100 text-danger-800",
    };

    const labels: { [key: string]: string } = {
      success: "Başarılı",
      invalid_qr: "Geçersiz QR",
      expired_qr: "QR Süresi Dolmuş",
      location_failed: "Konum Başarısız",
      unauthorized: "Yetkisiz",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          styles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {labels[status] || status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("tr-TR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="container-max py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 fade-in">
        <div>
          <Link href={`/admin/events/${eventId}`} className="text-primary-600 hover:text-primary-700 mb-2 font-medium transition-all duration-200 flex items-center gap-1">
            ← Etkinliğe Dön
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-2">
            📊 Yoklama Kayıtları
          </h1>
          <p className="text-gray-600 font-medium">Tüm tarama geçmişi ve durumları</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={downloadCSV}
            className="btn-warning"
          >
            📥 CSV İndir
          </button>
          <Link
            href={`/admin/events/${eventId}`}
            className="btn-secondary flex-1 sm:flex-initial text-center"
          >
            ← Etkinliğe Dön
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 fade-in">
        <div className="card-elevated p-6 border-t-4 border-blue-600 bg-gradient-to-br from-blue-50 to-white">
          <p className="text-gray-600 text-sm font-medium mb-2">📈 Toplam Tarama</p>
          <p className="text-4xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="card-elevated p-6 border-t-4 border-green-600 bg-gradient-to-br from-green-50 to-white">
          <p className="text-gray-600 text-sm font-medium mb-2">✅ Başarılı</p>
          <p className="text-4xl font-bold text-green-600">{stats.success}</p>
        </div>
        <div className="card-elevated p-6 border-t-4 border-red-600 bg-gradient-to-br from-red-50 to-white">
          <p className="text-gray-600 text-sm font-medium mb-2">❌ Başarısız</p>
          <p className="text-4xl font-bold text-red-600">{stats.failed}</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="card-elevated p-4 border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-white text-red-700 animate-pulse fade-in">
          🚨 {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16 fade-in">
          <div className="inline-block">
            <div className="spinner w-12 h-12 border-4 border-gray-200 border-t-primary-600 rounded-full"></div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Yoklama kayıtları yükleniyor...</p>
        </div>
      )}

      {/* Attendances Table */}
      {!loading && attendances.length === 0 && (
        <div className="card-elevated p-8 bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-300 text-center fade-in">
          <p className="text-gray-600 text-lg font-medium">📭 Henüz yoklama kaydı bulunmuyor</p>
        </div>
      )}

      {!loading && attendances.length > 0 && (
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
              {attendances.map((attendance, idx) => (
                <tr 
                  key={attendance.id} 
                  className={`border-b border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-300 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">
                      {attendance.participant.firstName} {attendance.participant.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-sm font-medium">
                    {attendance.participant.email}
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-sm">
                    {formatDate(attendance.scanTime)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(attendance.status)}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {attendance.errorMessage ? (
                      <span className="text-red-600 font-medium">{attendance.errorMessage}</span>
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
    </div>
    </div>
  );
}
