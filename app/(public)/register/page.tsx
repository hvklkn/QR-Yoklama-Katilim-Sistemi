"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const dynamic = "force-dynamic";

const quickRegisterSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  phone: z.string().optional().or(z.literal("")),
});

type QuickRegisterForm = z.infer<typeof quickRegisterSchema>;

function RegisterContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const eventId = searchParams.get("eventId");
  const qrToken = searchParams.get("qrToken");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuickRegisterForm>({
    resolver: zodResolver(quickRegisterSchema),
    defaultValues: { phone: "" },
  });

  const onSubmit = async (data: QuickRegisterForm) => {
    if (!eventId || !qrToken) {
      setError("Etkinlik ve QR kodu bilgisi gerekli");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const participantResponse = await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || null,
          isPreRegistered: false,
        }),
      });

      const participantData = await participantResponse.json();

      if (!participantResponse.ok) {
        throw new Error(participantData.error?.message || "Katılımcı oluşturulamadı");
      }

      const attendanceResponse = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          participantId: participantData.data.id,
          qrToken,
        }),
      });

      const attendanceData = await attendanceResponse.json();

      if (!attendanceData.success) {
        throw new Error(attendanceData.error?.message || "Yoklama kaydedilemedi");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/success?name=${data.firstName} ${data.lastName}&event=${eventId}`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800">
      <div className="max-w-md mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">🎫 Hızlı Kayıt</h1>
          <p className="text-gray-600 text-center mb-6">Lütfen bilgilerinizi girin</p>

          {success ? (
            <div className="bg-success-50 border border-success-200 rounded-lg p-4 text-center">
              <p className="text-success-700 font-semibold">✓ Kayıt başarılı!</p>
              <p className="text-success-600 text-sm mt-2">Yönlendiriliyorsunuz...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ad *</label>
                <input
                  {...register("firstName")}
                  type="text"
                  placeholder="Adınız"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.firstName && (
                  <p className="text-danger-600 text-xs mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Soyad *</label>
                <input
                  {...register("lastName")}
                  type="text"
                  placeholder="Soyadınız"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.lastName && (
                  <p className="text-danger-600 text-xs mt-1">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-posta *</label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="ornek@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.email && (
                  <p className="text-danger-600 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="+90 5XX XXX XXXX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 transition-colors mt-6"
              >
                {loading ? "Kaydediliyor..." : "Kayıt Ol"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
