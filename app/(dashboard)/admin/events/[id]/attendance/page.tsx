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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Yoklama Kayıtları</h1>
        <div className="flex gap-2">
          <button
            onClick={downloadCSV}
            className="px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors"
          >
            📥 CSV İndir
          </button>
          <Link
            href={`/admin/events/${eventId}`}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Geri
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-gray-600 text-sm font-medium mb-2">
            Toplam Tarama
          </h3>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-gray-600 text-sm font-medium mb-2">
            Başarılı
          </h3>
          <p className="text-3xl font-bold text-success-600">{stats.success}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-gray-600 text-sm font-medium mb-2">
            Başarısız
          </h3>
          <p className="text-3xl font-bold text-danger-600">{stats.failed}</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-danger-50 border border-danger-200 text-danger-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
          <p className="text-gray-600">Yoklama kayıtları yükleniyor...</p>
        </div>
      )}

      {/* Attendances Table */}
      {!loading && attendances.length === 0 && (
        <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
          <p className="text-gray-600">Henüz yoklama kaydı bulunmuyor</p>
        </div>
      )}

      {!loading && attendances.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Katılımcı
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  E-posta
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Tarama Tarihi
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Hata
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendances.map((attendance) => (
                <tr key={attendance.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {attendance.participant.firstName}{" "}
                    {attendance.participant.lastName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {attendance.participant.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(attendance.scanTime)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(attendance.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {attendance.errorMessage || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
