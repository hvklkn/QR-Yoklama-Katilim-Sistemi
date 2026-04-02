"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginError {
  field?: string;
  message: string;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<LoginError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError({
          message: data.error?.message || "Giriş başarısız",
        });
        setIsLoading(false);
        return;
      }

      // Success - redirect to admin dashboard
      router.push("/admin");
    } catch (err) {
      setError({
        message: "Bir hata oluştu. Lütfen tekrar deneyin.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              QR
            </div>
            <span className="font-bold text-gray-900 text-lg">Yoklama Admin</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Girişi
          </h1>
          <p className="text-gray-600">
            Etkinliklerinizi yönetmek için giriş yapın
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
            role="alert"
          >
            {error.message}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="admin@example.com"
              className="input-base"
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Şifre
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="input-base pr-10"
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary"
          >
            {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>

          {/* Demo Credentials */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-3">
              Demo hesap bilgileri (yoklama sistemi):
            </p>
            <div className="bg-gray-50 p-3 rounded text-xs space-y-1">
              <p>
                <span className="font-semibold text-gray-700">E-posta:</span>{" "}
                <code>admin@localhost</code>
              </p>
              <p>
                <span className="font-semibold text-gray-700">Şifre:</span>{" "}
                <code>admin123</code>
              </p>
            </div>
          </div>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            ← Ana sayfaya geri dön
          </Link>
        </div>
      </div>
    </div>
  );
}
