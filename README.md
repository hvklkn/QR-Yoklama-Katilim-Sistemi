# QR Yoklama & Katılım Sistemi

QR kod tabanlı, lokasyon doğrulamalı modern yoklama sistemi. Etkinlik, ders ve konferans ortamlarında hızlı, güvenli ve doğrulanabilir katılım takibi sağlar.

---

## 🎯 Proje Amacı

* Manuel yoklama süreçlerini dijitalleştirmek
* QR kod ile hızlı ve pratik katılım sağlamak
* Lokasyon doğrulaması ile sahte katılımı engellemek
* Admin paneli üzerinden etkinlik ve katılımcı yönetimi yapmak

---

## 🚀 Temel Özellikler

### ✅ Tamamlanan Özellikler

* Admin giriş sistemi (session tabanlı)
* Etkinlik oluşturma ve yönetimi
* Dinamik QR token yapısı
* QR kod ile katılım alma
* Kayıtlı ve kayıtsız katılımcı desteği
* Lokasyon (GPS) doğrulama sistemi (geofence)
* Attendance (yoklama) kayıt sistemi
* Webhook tetikleme altyapısı (n8n uyumlu)

---

### ⚙️ Geliştirilebilir Noktalar

* Excel / CSV export geliştirmeleri
* Persist session (Redis / database tabanlı)
* Rol bazlı yetkilendirme (RBAC)
* Gelişmiş raporlama ve dashboard

---

## 🧱 Teknoloji Stack

* **Frontend**: Next.js, React, TypeScript
* **Styling**: Tailwind CSS
* **Backend**: Next.js API Routes
* **Database**: PostgreSQL (Neon)
* **ORM**: Prisma
* **State Management**: Zustand
* **Form Validation**: React Hook Form + Zod
* **QR İşleme**: qrcode, jsqr
* **Deployment**: Vercel

---

## ⚙️ Kurulum

### 1. Projeyi klonlayın

```bash
git clone https://github.com/hvklkn/QR-Yoklama-Katilim-Sistemi.git
cd QR-Yoklama-Katilim-Sistemi
```

### 2. Bağımlılıkları yükleyin

```bash
npm install
```

### 3. Environment değişkenlerini ayarlayın

```bash
cp .env.example .env.local
```

`.env.local` içeriği:

```env
DATABASE_URL=postgresql://user:password@host/database
NEXT_PUBLIC_API_URL=http://localhost:3000
ADMIN_EMAIL=admin@localhost
ADMIN_PASSWORD=change-me
QR_TOKEN_EXPIRY_MINUTES=5
```

---

### 4. Veritabanını hazırlayın

```bash
npm run prisma:generate
npm run prisma:migrate
```

---

### 5. Uygulamayı çalıştırın

```bash
npm run dev
```

Tarayıcıdan:
👉 http://localhost:3000

---

## 🔐 Sistem Mimarisi

1. Admin → Etkinlik oluşturur
2. Sistem → Dinamik QR token üretir
3. Katılımcı → QR kodu tarar
4. Sistem → Token doğrular
5. GPS → Konum kontrolü yapılır
6. Attendance → Katılım kaydı oluşturulur

---

## 📍 Lokasyon (Geofence) Doğrulama

* Kullanıcının GPS konumu alınır
* Etkinlik konumu ile karşılaştırılır
* Belirlenen yarıçap içindeyse katılım kabul edilir
* Aksi durumda katılım reddedilir

👉 Detaylı teknik açıklama: `docs/LOCATION_VALIDATION.md`

---

## 🔑 Güvenlik

* Dinamik QR token (yenilenebilir süre)
* Lokasyon doğrulama (geofence)
* API validation (Zod)
* Session bazlı admin authentication

---

## 📊 API Örnekleri

### Event oluşturma

```http
POST /api/events
```

### Katılım kaydetme

```http
POST /api/attendance
```

---

## 🌐 Deployment

Uygulama **Vercel** üzerinde deploy edilebilir.

👉 Detaylı kurulum: `docs/DEPLOYMENT.md`

---

## 🎥 Demo

👉 (BURAYA VERCEL LİNKİNİ EKLE)

---

## 👤 Geliştirici

**Veli Kalkan**
