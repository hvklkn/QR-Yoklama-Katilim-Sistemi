# QR Yoklama Katılım Sistemi

Etkinlik, ders ve konferans ortamında QR kod aracılığıyla güvenli, hızlı ve kapsamlı yoklama alan modern web tabanlı sistem.

## 🎯 Proje Amaçları

- Etkinlik ve ders ortamında hızlı yoklama alma
- Dinamik ve güvenli QR kodlar (her 5 dakikada yenilenen)
- GPS/Lokasyon doğrulaması ile yetkisiz taramaların önlenmesi
- Admin paneli ile etkinlik yönetimi
- Katılımcı yönetimi (CSV import, manuel ekleme)
- Detaylı yoklama kayıtları ve raporlar
- n8n webhook entegrasyonu

## 📋 Teknik Yığın (Tech Stack)

- **Frontend**: Next.js 16+ (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma 6
- **Form**: React Hook Form + Zod
- **Deployment**: Vercel
- **QR**: qrcode, jsqr
- **State Management**: Zustand

## 🚀 Başlangıç

### Gereksinimler

- Node.js 18+
- npm veya yarn
- PostgreSQL (Neon) hesabı

### Kurulum

1. **Projeyi klonlayın**
   ```bash
   git clone https://github.com/hvklkn/QR-Yoklama-Katilim-Sistemi.git
   cd QR-Yoklama-Katilim-Sistemi
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Environment değişkenlerini ayarlayın**
   ```bash
   cp .env.example .env.local
   ```

   Gerekli değişkenleri doldurun:
   ```env
   DATABASE_URL=postgresql://user:password@host/database
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ADMIN_EMAIL=admin@localhost
   ADMIN_PASSWORD=change-me
   QR_TOKEN_EXPIRY_MINUTES=5
   ```

4. **Veritabanını kurulumunu yapın**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. **Geliştirme sunucusunu başlatın**
   ```bash
   npm run dev
   ```

   Tarayıcıda `http://localhost:3000` adresine gidin.

## 📁 Klasör Yapısı

```
├── app/                      # Next.js App Router
│   ├── (dashboard)/         # Dashboard layout
│   │   ├── admin/          # Admin pages
│   │   └── layout.tsx      # Dashboard layout
│   ├── (public)/           # Public pages
│   │   └── layout.tsx      # Public layout
│   ├── api/                # API routes
│   ├── components/         # Reusable components
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── lib/                     # Utility functions
│   ├── api/               # API utilities
│   ├── auth/              # Authentication
│   ├── qr/                # QR token and location logic
│   └── validators/        # Zod schemas
├── types/                  # TypeScript types
├── services/              # Business logic services
├── hooks/                 # React hooks
├── store/                 # Zustand stores
├── prisma/               # Prisma schema
├── public/               # Static assets
├── tsconfig.json        # TypeScript config
├── tailwind.config.ts   # Tailwind config
└── next.config.ts       # Next.js config
```

## 🔑 Temel Özellikler (İhtiyaç Yönelimi)

### Aşama 1: Temel Kurulum ✅
- [x] Next.js + Tailwind + TypeScript setup
- [x] Prisma + Neon PostgreSQL integration
- [x] Proje yapısı ve klasörleme
- [x] Base layout ve UI components
- [x] Type definitions

### Aşama 2: Auth & Admin (Planlanan)
- [ ] Admin login/logout
- [ ] Session management
- [ ] Admin paneli

### Aşama 3: Event Management (Planlanan)
- [ ] Etkinlik CRUD işlemleri
- [ ] Dinamik QR kod üretimi
- [ ] QR token refresh mekanizması

### Aşama 4: Participant Management (Planlanan)
- [ ] Katılımcı ekleme/silme
- [ ] CSV import
- [ ] E-posta doğrulaması

### Aşama 5: QR Scanning (Planlanan)
- [ ] QR kod okuma
- [ ] Lokasyon doğrulaması
- [ ] Yoklama kaydı

### Aşama 6: Raporlar & Export (Planlanan)
- [ ] Yoklama raporları
- [ ] CSV/Excel export
- [ ] İstatistikler

### Aşama 7: n8n Integration (Planlanan)
- [ ] Webhook trigger sistemi
- [ ] Event logging

## 🔐 Güvenlik Notları

- Dinamik QR kodlar her 5 dakikada yenilenir (yapılandırılabilir)
- GPS/Lokasyon doğrulaması (geofencing) ile yetkisiz taramaların önlenmesi
- Admin session'ları 24 saatte sona erer
- Tüm API requestleri validation'dan geçer
- Hata senaryoları:
  - Geçersiz QR kodu
  - Süresi dolmuş QR kodu
  - Etkinlik bulunamaması
  - Yetkisiz erişim
  - Geofence dışında tarama

## 📊 API Örnekleri

### Event Oluştur
```
POST /api/events
{
  "name": "Programlama Dersi",
  "startTime": "2024-04-02T10:00:00Z",
  "endTime": "2024-04-02T12:00:00Z",
  "location": "Amfi A",
  "latitude": 41.0082,
  "longitude": 28.9784,
  "radius": 50
}
```

### Katılımcı Ekle
```
POST /api/participants
{
  "eventId": "...",
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "email": "ahmet@example.com"
}
```

### Yoklama Kaydet
```
POST /api/attendance
{
  "eventId": "...",
  "participantId": "...",
  "qrToken": "...",
  "latitude": 41.0082,
  "longitude": 28.9784
}
```

## 🛠️ Komutlar

```bash
# Geliştirme
npm run dev

# Build
npm run build

# Production çalıştırma
npm start

# Lint
npm run lint

# Prisma
npm run prisma:generate    # Client oluştur
npm run prisma:migrate     # Migration çalıştır
npm run prisma:studio      # Database GUI
```

## 🌐 Deployment

### Vercel
```bash
vercel
```

Environment variables'ları Vercel dashboard'dan ayarlayın.

### Environment Variables
- `DATABASE_URL`: Neon PostgreSQL bağlantı stringi
- `NEXT_PUBLIC_API_URL`: API base URL
- `ADMIN_EMAIL`: Admin e-postası
- `ADMIN_PASSWORD`: Admin şifresi
- `QR_TOKEN_EXPIRY_MINUTES`: QR token geçerlilik süresi
- `N8N_WEBHOOK_URL`: n8n webhook endpoint


## 👤 Geliştirici

Veli Kalkan (@hvklkn)

---

**Sürüm**: 0.1.0 (Yapı Aşaması)

**Son Güncelleme**: 6 Nisan 2026
