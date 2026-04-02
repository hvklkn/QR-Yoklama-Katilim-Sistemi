"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const name = searchParams.get("name") || "Katılımcı";

  return (
    <div className="min-h-screen bg-gradient-to-br from-success-600 to-success-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="inline-block bg-success-100 rounded-full p-4">
            <svg
              className="w-12 h-12 text-success-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hoş Geldiniz!</h1>
        <p className="text-2xl font-semibold text-primary-600 mb-4">{name}</p>
        <p className="text-gray-600 mb-6">Yoklama kaydınız başarıyla oluşturulmuştur.</p>

        <div className="grid grid-cols-2 gap-4 my-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-3xl font-bold text-primary-600">✓</p>
            <p className="text-gray-600 text-sm mt-2">Kaydınız Tamamlandı</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-3xl font-bold text-success-600">📍</p>
            <p className="text-gray-600 text-sm mt-2">Konum Alındı</p>
          </div>
        </div>

        <div className="space-y-3 mt-8">
          <button
            onClick={() => router.push("/scan")}
            className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Başka QR Tara
          </button>
          <button
            onClick={() => router.back()}
            className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Geri Dön
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">Verileriniz güvenli şekilde saklanmıştır.</p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
