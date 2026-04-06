"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ParticipantDTO } from "@/types";

export default function ParticipantsPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [participants, setParticipants] = useState<ParticipantDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  // participantId -> { isPresent, attendanceStatus }
  const [attendanceMap, setAttendanceMap] = useState<Record<string, { isPresent: boolean; status: string }>>({});
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [showBulkImport, setShowBulkImport] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchParticipants();
    fetchAttendanceStatus();
  }, [eventId]);

  const fetchAttendanceStatus = async () => {
    try {
      const response = await fetch(`/api/attendance/history?eventId=${eventId}`);
      const data = await response.json();
      if (data.success && data.data) {
        const map: Record<string, { isPresent: boolean; status: string }> = {};
        for (const a of data.data.attendances) {
          if (["success", "manual_present"].includes(a.status)) {
            map[a.participantId] = { isPresent: true, status: a.status };
          } else if (!map[a.participantId]) {
            map[a.participantId] = { isPresent: false, status: a.status };
          }
        }
        setAttendanceMap(map);
      }
    } catch (err) {
      console.error("Yoklama durumu alınamadı:", err);
    }
  };

  const handleToggleAttendance = async (participantId: string) => {
    const current = attendanceMap[participantId];
    const isPresent = current?.isPresent ?? false;
    setTogglingId(participantId);
    try {
      const response = await fetch("/api/attendance/history", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, participantId, present: !isPresent }),
      });
      if (response.ok) {
        setAttendanceMap((prev) => ({
          ...prev,
          [participantId]: { isPresent: !isPresent, status: !isPresent ? "manual_present" : "" },
        }));
      }
    } catch (err) {
      console.error("Toggle hatası:", err);
    } finally {
      setTogglingId(null);
    }
  };

  const fetchParticipants = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/participants?eventId=${eventId}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message || "Katılımcılar yüklenemedi"
        );
      }

      setParticipants(data.data);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Bir hata oluştu";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddParticipant = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/participants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          ...formData,
          isPreRegistered: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Katılımcı eklenemedi");
      }

      setParticipants([data.data, ...participants]);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      });
      setShowForm(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Bir hata oluştu";
      setError(message);
    }
  };

  const handleDeleteParticipant = async (id: string) => {
    if (!confirm("Bu katılımcıyı silmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      const response = await fetch(`/api/participants/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Katılımcı silinemedi");
      }

      setParticipants(participants.filter((p) => p.id !== id));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Bir hata oluştu";
      alert(message);
    }
  };

  return (
    <>
    <div className="container-max py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 fade-in">
        <div>
          <Link href={`/admin/events/${eventId}`} className="text-primary-600 hover:text-primary-700 mb-2 font-medium transition-all duration-200 flex items-center gap-1">
            ← Etkinliğe Dön
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-2">
            👥 Katılımcıları Yönet
          </h1>
          <p className="text-gray-600 font-medium">
            <span className="font-bold text-primary-600">{participants.length}</span> katılımcı ({isLoading ? "yükleniyor..." : "toplam"})
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowBulkImport(!showBulkImport)}
            className="btn-warning"
          >
            📥 CSV İçe Aktar
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-success"
          >
            ➕ Katılımcı Ekle
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 font-medium animate-pulse">
          ❌ {error}
        </div>
      )}

      {/* Add Form */}
      {showForm && (
        <div className="card-elevated p-8 mb-8 bg-gradient-to-br from-green-50 to-white border-l-4 border-green-600 fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            ➕ Yeni Katılımcı Ekle
          </h2>
          <form onSubmit={handleAddParticipant} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Ad"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    firstName: e.target.value,
                  })
                }
                className="input-base"
                required
              />
              <input
                type="text"
                placeholder="Soyad"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lastName: e.target.value,
                  })
                }
                className="input-base"
                required
              />
            </div>
            <input
              type="email"
              placeholder="E-posta"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              className="input-base"
              required
            />
            <input
              type="tel"
              placeholder="Telefon (Opsiyonel)"
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value,
                })
              }
              className="input-base"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="btn-success flex-1 sm:flex-none"
              >
                ✓ Ekle
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary flex-1 sm:flex-none"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bulk Import Form */}
      {showBulkImport && (
        <BulkImportForm
          eventId={eventId}
          onSuccess={() => {
            fetchParticipants();
            setShowBulkImport(false);
          }}
        />
      )}

      {/* Participants List */}
      {isLoading ? (
        <div className="text-center py-16 fade-in">
          <div className="inline-block">
            <div className="spinner w-12 h-12 border-4 border-gray-200 border-t-primary-600 rounded-full"></div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Katılımcılar yükleniyor...</p>
        </div>
      ) : participants.length === 0 ? (
        <div className="text-center py-16 card-elevated bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-300 fade-in">
          <p className="text-gray-600 mb-6 text-lg font-medium">👥 Henüz katılımcı eklenmemiş</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setShowForm(true)}
              className="btn-success"
            >
              ➕ İlk Katılımcıyı Ekle
            </button>
            <button
              onClick={() => setShowBulkImport(true)}
              className="btn-outline"
            >
              📥 CSV'den İçe Aktar
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto card-elevated">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">👤 Ad Soyad</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">📧 E-posta</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">📱 Telefon</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">✓ Var/Yok</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">⚙️ İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p, idx) => {
                const att = attendanceMap[p.id];
                const isPresent = att?.isPresent ?? false;
                const isScanned = att?.status === "success";
                return (
                  <tr 
                    key={p.id} 
                    className={`border-b border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-300 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">
                      {p.firstName} {p.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-sm font-medium">
                    {p.email}
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-sm">
                    {p.phone || <span className="text-gray-400">-</span>}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => handleToggleAttendance(p.id)}
                        disabled={togglingId === p.id}
                        title={isScanned ? "QR ile katıldı" : isPresent ? "Yok olarak işaretle" : "Var olarak işaretle"}
                        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                          isPresent ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                            isPresent ? "translate-x-8" : "translate-x-1"
                          }`}
                        />
                      </button>
                      <span className={`text-xs font-semibold ${isPresent ? "text-green-700" : "text-gray-500"}`}>
                        {togglingId === p.id ? "..." : isPresent ? (isScanned ? "📷 Tarandı" : "✓ Var") : "✗ Yok"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteParticipant(p.id)}
                      className="btn-danger btn-small hover:animate-pulse"
                    >
                      🗑️ Sil
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
}

interface BulkImportFormProps {
  eventId: string;
  onSuccess: () => void;
}

function BulkImportForm({ eventId, onSuccess }: BulkImportFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Parse CSV
      let text = await file.text();

      // UTF-8 BOM temizle (0xFEFF)
      if (text.charCodeAt(0) === 0xFEFF) {
        text = text.slice(1);
      }

      // Satır ayırıcısını normalize et (\r\n veya \r)
      const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");

      if (lines.length < 2) {
        throw new Error("CSV dosyası boş veya geçersiz");
      }

      // Header normalization: BOM, boşluk, tırnak, büyük/küçük harf, Türkçe karakter
      const normalizeHeader = (h: string): string => {
        return h
          .replace(/^\uFEFF/, "") // BOM
          .replace(/^["']|["']$/g, "") // tırnak işaretleri
          .trim()
          .toLowerCase()
          .replace(/ı/g, "i")
          .replace(/ğ/g, "g")
          .replace(/ü/g, "u")
          .replace(/ş/g, "s")
          .replace(/ö/g, "o")
          .replace(/ç/g, "c")
          .replace(/[-_\s]/g, ""); // ayraçları kaldır
      };

      const rawHeaders = lines[0].split(",");
      const headers = rawHeaders.map(normalizeHeader);

      // Header indeksleri bul
      const getHeaderIndex = (possibleNames: string[]): number => {
        const normalized = possibleNames.map(normalizeHeader);
        const idx = headers.findIndex((h) => normalized.includes(h));
        return idx >= 0 ? idx : -1;
      };

      const firstNameIdx = getHeaderIndex(["ad", "firstname", "first_name", "isim", "name"]);
      const lastNameIdx = getHeaderIndex(["soyad", "lastname", "last_name", "surname"]);
      const emailIdx = getHeaderIndex(["eposta", "email", "e-mail", "e_mail", "mail", "e-posta"]);
      const phoneIdx = getHeaderIndex(["telefon", "phone", "tel", "cep", "gsm"]);

      // Debug: Hata durumunda header listesini göster
      if (firstNameIdx === -1 || lastNameIdx === -1 || emailIdx === -1) {
        const headerList = rawHeaders.map((h) => `"${h.trim()}"`).join(", ");
        throw new Error(
          `CSV'de zorunlu sütunlar bulunamadı.\nBulunan başlıklar: ${headerList}\nGerekli başlıklar: Ad, Soyad, E-posta`
        );
      }

      if (firstNameIdx === -1 || lastNameIdx === -1 || emailIdx === -1) {
        throw new Error("CSV'de zorunlu sütunlar eksik: Ad, Soyad, E-posta");
      }

      let imported = 0;
      let failed = 0;
      const failedRows: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const values = lines[i].split(",").map((v) => v.trim().replace(/^["']|["']$/g, ""));
        
        // Zorunlu alanlar kontrol et
        if (!values[firstNameIdx] || !values[lastNameIdx] || !values[emailIdx]) {
          failed++;
          failedRows.push(`Satır ${i + 1}: Eksik zorunlu alan`);
          continue;
        }

        try {
          const response = await fetch("/api/participants", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              eventId,
              firstName: values[firstNameIdx],
              lastName: values[lastNameIdx],
              email: values[emailIdx],
              phone: values[phoneIdx] || "",
              isPreRegistered: true,
            }),
          });

          const data = await response.json();

          if (response.ok) {
            imported++;
          } else {
            failed++;
            failedRows.push(`Satır ${i + 1}: ${data.error?.message || "Hata"}`);
          }
        } catch (err) {
          failed++;
          failedRows.push(`Satır ${i + 1}: ${err instanceof Error ? err.message : "Bağlantı hatası"}`);
        }
      }

      if (imported === 0) {
        throw new Error(`İçe aktarma başarısız! ${failedRows.slice(0, 3).join(", ")}`);
      }

      setSuccess(
        `✓ ${imported} katılımcı başarıyla içe aktarıldı${failed > 0 ? `, ${failed} başarısız` : ""}`
      );
      setFileInputKey((prev) => prev + 1); // Input'u reset et
      setTimeout(() => onSuccess(), 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : "CSV işlenemedi";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-elevated p-8 mb-6 bg-gradient-to-br from-yellow-50 to-white border-l-4 border-yellow-600 fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        📥 CSV İçe Aktarma
      </h2>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-sm font-medium">
          ❌ {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded text-green-700 text-sm font-medium">
          {success}
        </div>
      )}
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700 mb-2 font-medium">📋 CSV formatı örneği:</p>
          <code className="block bg-white p-3 rounded text-xs text-gray-800 font-mono overflow-x-auto border border-blue-100">
            Ad,Soyad,E-posta,Telefon{"\n"}
            Ahmet,Yılmaz,ahmet@example.com,05551234567{"\n"}
            Ayşe,Kaya,ayse@example.com,05559876543
          </code>
          <p className="text-xs text-gray-600 mt-2">
            ℹ️ Sütun adları: ad, soyad, e-posta (zorunlu) + telefon (opsiyonel)
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CSV Dosyası Seç:
          </label>
          <input
            key={fileInputKey}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={isLoading}
            className="block w-full text-sm border-2 border-dashed border-gray-300 rounded-lg p-3 cursor-pointer hover:border-yellow-500 focus:outline-none focus:border-yellow-600 transition-colors"
          />
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-yellow-700 font-medium">
            <div className="spinner w-5 h-5 border-2 border-yellow-200 border-t-yellow-600 rounded-full animate-spin"></div>
            İçe aktarılıyor...
          </div>
        )}
      </div>
    </div>
    </>
  );
}
