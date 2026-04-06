"use client";

import { useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "qr" | "location" | "account">("general");

  const [generalSettings, setGeneralSettings] = useState({
    systemName: "QR Yoklama Sistemi",
    contactEmail: "",
    language: "tr",
    timezone: "Europe/Istanbul",
  });

  const [qrSettings, setQrSettings] = useState({
    tokenExpireMinutes: "5",
    autoRefresh: true,
    allowMultipleScan: false,
  });

  const [locationSettings, setLocationSettings] = useState({
    defaultRadius: "100",
    gpsToleranceMeters: "20",
    requireLocation: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: "general", label: "Genel", icon: "⚙️" },
    { id: "qr", label: "QR Kod", icon: "🔲" },
    { id: "location", label: "Lokasyon", icon: "📍" },
    { id: "account", label: "Hesap", icon: "👤" },
  ] as const;

  return (
    <>
    <div className="container-max py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 fade-in">
        <div>
          <Link href="/admin" className="text-primary-600 hover:text-primary-700 mb-2 font-medium transition-all duration-200 flex items-center gap-1">
            ← Admin Paneline Dön
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-2">
            ⚙️ Ayarlar
          </h1>
          <p className="text-gray-600 font-medium">Sistem yapılandırması ve tercihler</p>
        </div>
      </div>

      {saved && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg text-green-700 font-medium fade-in">
          ✓ Ayarlar kaydedildi
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Tab Menü */}
        <div className="md:w-48 shrink-0">
          <nav className="card-elevated p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm flex items-center gap-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* İçerik */}
        <div className="flex-1">
          {/* Genel */}
          {activeTab === "general" && (
            <div className="card-elevated p-8 fade-in">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">⚙️ Genel Ayarlar</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Sistem Adı</label>
                  <input
                    type="text"
                    value={generalSettings.systemName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, systemName: e.target.value })}
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">İletişim E-postası</label>
                  <input
                    type="email"
                    placeholder="ornek@kurum.com"
                    value={generalSettings.contactEmail}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Dil</label>
                  <select
                    value={generalSettings.language}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })}
                    className="input-base"
                  >
                    <option value="tr">Türkçe</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Saat Dilimi</label>
                  <select
                    value={generalSettings.timezone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                    className="input-base"
                  >
                    <option value="Europe/Istanbul">Europe/Istanbul (UTC+3)</option>
                    <option value="UTC">UTC</option>
                    <option value="Europe/London">Europe/London (UTC+0/+1)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* QR Kod */}
          {activeTab === "qr" && (
            <div className="card-elevated p-8 fade-in">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">🔲 QR Kod Ayarları</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Token Geçerlilik Süresi (dakika)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={qrSettings.tokenExpireMinutes}
                    onChange={(e) => setQrSettings({ ...qrSettings, tokenExpireMinutes: e.target.value })}
                    className="input-base max-w-xs"
                  />
                  <p className="text-xs text-gray-500 mt-1">QR kod bu dakika sonra otomatik yenilenir</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <p className="font-semibold text-gray-800">Otomatik Yenileme</p>
                    <p className="text-xs text-gray-500">QR kod süresi dolunca otomatik yenile</p>
                  </div>
                  <button
                    onClick={() => setQrSettings({ ...qrSettings, autoRefresh: !qrSettings.autoRefresh })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${qrSettings.autoRefresh ? "bg-primary-600" : "bg-gray-300"}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${qrSettings.autoRefresh ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <p className="font-semibold text-gray-800">Çoklu Tarama</p>
                    <p className="text-xs text-gray-500">Aynı katılımcı birden fazla kez tarayabilsin</p>
                  </div>
                  <button
                    onClick={() => setQrSettings({ ...qrSettings, allowMultipleScan: !qrSettings.allowMultipleScan })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${qrSettings.allowMultipleScan ? "bg-primary-600" : "bg-gray-300"}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${qrSettings.allowMultipleScan ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lokasyon */}
          {activeTab === "location" && (
            <div className="card-elevated p-8 fade-in">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">📍 Lokasyon Ayarları</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Varsayılan Yarıçap (metre)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="10000"
                    value={locationSettings.defaultRadius}
                    onChange={(e) => setLocationSettings({ ...locationSettings, defaultRadius: e.target.value })}
                    className="input-base max-w-xs"
                  />
                  <p className="text-xs text-gray-500 mt-1">Yeni etkinlikler için varsayılan geofence yarıçapı</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    GPS Tolerans Payı (metre)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={locationSettings.gpsToleranceMeters}
                    onChange={(e) => setLocationSettings({ ...locationSettings, gpsToleranceMeters: e.target.value })}
                    className="input-base max-w-xs"
                  />
                  <p className="text-xs text-gray-500 mt-1">GPS hata payını telafi etmek için ek tolerans</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <p className="font-semibold text-gray-800">Lokasyon Zorunlu</p>
                    <p className="text-xs text-gray-500">Tüm etkinliklerde konum doğrulamasını zorunlu tut</p>
                  </div>
                  <button
                    onClick={() => setLocationSettings({ ...locationSettings, requireLocation: !locationSettings.requireLocation })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${locationSettings.requireLocation ? "bg-primary-600" : "bg-gray-300"}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${locationSettings.requireLocation ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Hesap */}
          {activeTab === "account" && (
            <div className="card-elevated p-8 fade-in">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">👤 Hesap Bilgileri</h2>
              <div className="space-y-5">
                <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      A
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">Admin</p>
                      <p className="text-gray-600 text-sm">admin@yoklama.com</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                        Sistem Yöneticisi
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mevcut Şifre</label>
                  <input type="password" placeholder="••••••••" className="input-base" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Yeni Şifre</label>
                  <input type="password" placeholder="••••••••" className="input-base" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Yeni Şifre Tekrar</label>
                  <input type="password" placeholder="••••••••" className="input-base" />
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700">
                  ⚠️ Şifre değişikliği bu sürümde veritabanına kaydedilmez. Şimdilik görsel amaçlıdır.
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button onClick={handleSave} className="btn-primary px-8">
              ✓ Ayarları Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
