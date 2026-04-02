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
  const [showBulkImport, setShowBulkImport] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchParticipants();
  }, [eventId]);

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 fade-in">
        <div>
          <Link href={`/admin/events/${eventId}`} className="text-primary-600 hover:text-primary-700 hover:scale-110 mb-2 font-medium transition-all duration-200 flex items-center gap-1">
            ← Etkinliğe Dön
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-2">
            👥 Katılımcıları Yönet
          </h1>
          <p className="text-gray-600 text-lg">
            <span className="font-bold text-primary-600">{participants.length}</span> katılımcı ({isLoading ? "yükleniyor..." : "toplam"})
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowBulkImport(!showBulkImport)}
            className="btn-warning flex-1 sm:flex-none"
          >
            📥 CSV İçe Aktar
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-success flex-1 sm:flex-none"
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
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">✓ Yoklamalar</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">⚙️ İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p, idx) => (
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
                  <td className="px-6 py-4">
                    <span className="badge-success">
                      {(p as any).attendanceCount || 0} ✓
                    </span>
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
              ))}
            </tbody>
          </table>
        </div>
      )}
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
      const text = await file.text();
      const lines = text.split("\n");
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

      let imported = 0;
      let failed = 0;

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const values = lines[i].split(",").map((v) => v.trim());
        const firstNameIdx = headers.indexOf("ad") || headers.indexOf("firstname") || 0;
        const lastNameIdx =
          headers.indexOf("soyad") ||
          headers.indexOf("lastname") ||
          1;
        const emailIdx = headers.indexOf("eposta") || headers.indexOf("email") || 2;
        const phoneIdx = headers.indexOf("telefon") || headers.indexOf("phone") || 3;

        try {
          const response = await fetch("/api/participants", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              eventId,
              firstName: values[firstNameIdx] || "",
              lastName: values[lastNameIdx] || "",
              email: values[emailIdx] || "",
              phone: values[phoneIdx] || "",
              isPreRegistered: true,
            }),
          });

          if (response.ok) {
            imported++;
          } else {
            failed++;
          }
        } catch {
          failed++;
        }
      }

      setSuccess(
        `${imported} katılımcı başarıyla içe aktarıldı${failed > 0 ? `, ${failed} başarısız` : ""}`
      );
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : "CSV işlenemedi";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        CSV İçe Aktarma
      </h2>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
          {success}
        </div>
      )}
      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          CSV dosyasını şu sütun adlarıyla yükleyin:
          <code className="block bg-gray-100 p-2 rounded mt-2 text-xs">
            Ad, Soyad, E-posta, Telefon
          </code>
        </p>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          disabled={isLoading}
          className="input-base"
        />
      </div>
    </div>
  );
}
