"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
}

interface WebhookLog {
  id: string;
  eventType: string;
  sentTo: string;
  status: string;
  createdAt: string;
  response: unknown;
}

const EVENT_TYPES = [
  { id: "attendance_created", label: "Yoklama Alındı", icon: "✓", desc: "Katılımcı QR taradığında" },
  { id: "event_started", label: "Etkinlik Başladı", icon: "▶️", desc: "Etkinlik başlangıcında" },
  { id: "event_ended", label: "Etkinlik Bitti", icon: "⏹️", desc: "Etkinlik sona erdiğinde" },
  { id: "participant_added", label: "Katılımcı Eklendi", icon: "👤", desc: "Yeni katılımcı kaydında" },
];

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formSaving, setFormSaving] = useState(false);
  const [testResult, setTestResult] = useState<{ id: string; status: string } | null>(null);
  const [testLoading, setTestLoading] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    url: "",
    events: [] as string[],
  });

  useEffect(() => {
    fetchWebhooks();
    fetchLogs();
  }, []);

  const fetchWebhooks = async () => {
    try {
      const res = await fetch("/api/webhooks/config");
      const json = await res.json();
      if (res.ok) setWebhooks(json.data || []);
    } catch {
      // sessizce devam
    }
  };

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/webhooks?limit=20");
      const json = await res.json();
      if (res.ok) setLogs(json.data || []);
    } catch {
      // sessizce devam
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.name.trim() || !form.url.trim() || form.events.length === 0) return;
    setFormSaving(true);
    try {
      const res = await fetch("/api/webhooks/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, url: form.url, events: form.events }),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error?.message || "Webhook eklenemedi");
        return;
      }
      setWebhooks((prev) => [json.data, ...prev]);
      setForm({ name: "", url: "", events: [] });
      setShowForm(false);
    } catch {
      alert("Webhook eklenemedi");
    } finally {
      setFormSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu webhook'u silmek istiyor musunuz?")) return;
    const res = await fetch(`/api/webhooks/config/${id}`, { method: "DELETE" });
    if (res.ok) setWebhooks((prev) => prev.filter((w) => w.id !== id));
  };

  const handleToggle = async (webhook: WebhookConfig) => {
    const res = await fetch(`/api/webhooks/config/${webhook.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !webhook.active }),
    });
    const json = await res.json();
    if (res.ok) setWebhooks((prev) => prev.map((w) => w.id === webhook.id ? json.data : w));
  };

  const handleTest = async (webhook: WebhookConfig) => {
    setTestLoading(webhook.id);
    setTestResult(null);
    try {
      const res = await fetch("/api/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookUrl: webhook.url,
          eventType: "test",
          payload: {
            message: "QR Yoklama Sistemi test webhook'u",
            webhookName: webhook.name,
            timestamp: new Date().toISOString(),
          },
        }),
      });
      const json = await res.json();
      setTestResult({ id: webhook.id, status: json.data?.status || "failed" });
      fetchLogs();
    } catch {
      setTestResult({ id: webhook.id, status: "failed" });
    } finally {
      setTestLoading(null);
    }
  };

  const toggleEvent = (eventId: string) => {
    setForm((prev) => ({
      ...prev,
      events: prev.events.includes(eventId)
        ? prev.events.filter((e) => e !== eventId)
        : [...prev.events, eventId],
    }));
  };

  return (
    <>
      <div className="flex items-start justify-between mb-8 fade-in">
        <div>
          <Link href="/admin" className="text-primary-600 hover:text-primary-700 text-sm font-medium mb-2 flex items-center gap-1 transition-colors">
            ← Admin Paneli
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent mb-1">
            🔗 Webhooks & Entegrasyon
          </h1>
          <p className="text-gray-600">n8n, Zapier ve harici sistemlere otomatik bildirim gönderin</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          ➕ Webhook Ekle
        </button>
      </div>

      {/* n8n Bilgi Kartı */}
      <div className="card-elevated p-6 mb-8 bg-gradient-to-br from-indigo-50 to-white border-l-4 border-indigo-600 fade-in">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl shrink-0">🤖</div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900 mb-1">n8n ile Entegrasyon</h2>
            <p className="text-gray-600 text-sm mb-3">
              n8n workflow'unuzda <strong>Webhook trigger</strong> node'u ekleyin, üretilen URL'yi aşağıya yapıştırın.
              Yoklama alındığında n8n otomatik olarak tetiklenecek.
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://docs.n8n.io/integrations/builtin/trigger-nodes/n8n-nodes-base.webhook/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline btn-small"
              >
                📖 n8n Webhook Dökümanı
              </a>
              <a
                href="https://n8n.io"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline btn-small"
              >
                🌐 n8n.io
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Webhook Ekle Formu */}
      {showForm && (
        <div className="card-elevated p-8 mb-8 bg-gradient-to-br from-indigo-50 to-white border-l-4 border-indigo-500 fade-in">
          <h3 className="text-xl font-bold text-gray-900 mb-6">➕ Yeni Webhook</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Webhook Adı</label>
              <input
                type="text"
                placeholder="n8n Yoklama Bildirimi"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Webhook URL</label>
              <input
                type="url"
                placeholder="https://your-n8n.app.n8n.cloud/webhook/..."
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="input-base font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">n8n Webhook node'undan Production URL'yi kopyalayın</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tetiklenecek Olaylar</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EVENT_TYPES.map((event) => (
                  <label
                    key={event.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      form.events.includes(event.id)
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.events.includes(event.id)}
                      onChange={() => toggleEvent(event.id)}
                      className="mt-0.5"
                    />
                    <div>
                      <div className="font-semibold text-sm text-gray-800">{event.icon} {event.label}</div>
                      <div className="text-xs text-gray-500">{event.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleAdd} disabled={formSaving} className="btn-primary">
                {formSaving ? "⏳ Kaydediliyor..." : "✓ Kaydet"}
              </button>
              <button onClick={() => setShowForm(false)} className="btn-secondary">
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Webhook Listesi */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Kayıtlı Webhooklar</h2>
        {webhooks.length === 0 ? (
          <div className="card-elevated p-10 text-center border-2 border-dashed border-gray-300">
            <div className="text-5xl mb-3">🔗</div>
            <p className="text-gray-500 text-lg mb-2">Henüz webhook eklenmedi</p>
            <p className="text-gray-400 text-sm mb-5">n8n veya Zapier URL'nizi ekleyin</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              ➕ İlk Webhook'u Ekle
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="card-elevated p-6 fade-in">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`w-3 h-3 rounded-full shrink-0 ${webhook.active ? "bg-green-500" : "bg-gray-400"}`} />
                      <h3 className="font-bold text-gray-900 text-lg">{webhook.name}</h3>
                      {testResult?.id === webhook.id && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${testResult.status === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {testResult.status === "success" ? "✓ Test başarılı" : "✗ Test başarısız"}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 font-mono truncate mb-2">{webhook.url}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {webhook.events.map((ev) => {
                        const found = EVENT_TYPES.find((e) => e.id === ev);
                        return found ? (
                          <span key={ev} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                            {found.icon} {found.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Toggle */}
                    <button
                      onClick={() => handleToggle(webhook)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${webhook.active ? "bg-green-500" : "bg-gray-300"}`}
                      title={webhook.active ? "Devre dışı bırak" : "Aktif et"}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${webhook.active ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                    <button
                      onClick={() => handleTest(webhook)}
                      disabled={testLoading === webhook.id}
                      className="btn-outline btn-small"
                    >
                      {testLoading === webhook.id ? "⏳" : "🧪 Test"}
                    </button>
                    <button
                      onClick={() => handleDelete(webhook.id)}
                      className="btn-danger btn-small"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payload Örneği */}
      <div className="card-elevated p-6 mb-10 fade-in">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📦 Gönderilen Payload Örneği</h2>
        <p className="text-sm text-gray-600 mb-3">n8n'e gönderilen JSON yapısı <code className="bg-gray-100 px-1 rounded">attendance_created</code> için:</p>
        <div className="bg-gray-900 rounded-xl p-5 font-mono text-sm text-green-400 overflow-x-auto">
          <pre>{`{
  "event": "attendance_created",
  "timestamp": "2026-04-03T10:30:00.000Z",
  "data": {
    "attendanceId": "clxyz123",
    "eventId": "clxyz456",
    "eventName": "Bahar Dönemi Açılış",
    "participantId": "clxyz789",
    "participantName": "Ahmet Yılmaz",
    "participantEmail": "ahmet@ornek.com",
    "scanTime": "2026-04-03T10:30:00.000Z",
    "status": "success",
    "location": {
      "latitude": 41.0082,
      "longitude": 28.9784
    }
  }
}`}</pre>
        </div>
      </div>

      {/* Log Tablosu */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">📋 Son Webhook Logları</h2>
          <button onClick={fetchLogs} className="btn-outline btn-small">
            🔄 Yenile
          </button>
        </div>
        {isLoading ? (
          <div className="text-center py-10">
            <div className="spinner w-8 h-8 border-4 border-gray-200 border-t-indigo-600 rounded-full mx-auto animate-spin mb-3"></div>
            <p className="text-gray-500 text-sm">Loglar yükleniyor...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="card-elevated p-8 text-center border-2 border-dashed border-gray-200">
            <p className="text-gray-500">Henüz log yok</p>
          </div>
        ) : (
          <div className="card-elevated overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-700">Olay</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-700">Hedef URL</th>
                  <th className="px-5 py-3 text-center text-xs font-bold text-gray-700">Durum</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-700">Zaman</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, idx) => (
                  <tr key={log.id} className={`border-b border-gray-100 hover:bg-indigo-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{log.eventType}</span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500 font-mono max-w-xs truncate">
                      {log.sentTo || "-"}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        log.status === "success" ? "bg-green-100 text-green-700" :
                        log.status === "failed" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {log.status === "success" ? "✓ Başarılı" : log.status === "failed" ? "✗ Başarısız" : "⏳ Beklemede"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500">
                      {new Date(log.createdAt).toLocaleString("tr-TR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
