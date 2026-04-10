# Konum (Lokasyon) Doğrulaması Sistemi

## Genel Bakış

Bu sistem, QR kod tarama sırasında katılımcıların etkinlik konumu içinde olup olmadığını doğrulamak için GPS konum verilerini kullanır.

## İşleyiş

### 1. Etkinlik Oluşturma (Admin Paneli)
- **Konum Adı**: Etkinliğin gerçek dünya konumu (örn: "Amfi A, Sınıf 201")
- **GPS Koordinatları**: Enlem (Latitude) ve Boylam (Longitude)
  - "📍 Konumu Al" butonu cihazın mevcut konumunu otomatik olarak doldurur
- **Geofence Yarıçapı**: Katılımcıların tarama yapabilmesi için etkinlik merkezinden kaç metre uzakta olabilecekleri
  - Varsayılan: 50 metre
  - Aralık: 5-1000 metre
  - Örneğe göre ayarlanmalı (sınıf içi için 20-30m, açık alan etkinliği için 100-200m)

### 2. QR Kodunu Tarama (Katılımcı)

#### Konum İzni
- Tarama başlatılırken tarayıcı konum izni ister (ilk defa)
- Kullanıcı "İzin Ver" veya "Engelle" seçeneğini seçer
- Engel durumunda hata mesajı gösterilir: "Konum izini reddettiniz. Ayarlar > Gizlilik > Konum'dan izin verin."

#### Konum Doğrulama Adımları
1. **Konum Alımı**
   ```
   🔍 Konum bilgisi alınıyor...
   ```
   - GPS taraması belirlenen timeout (5 saniye) içinde konumu alır
   - Temel doğruluk (high accuracy=false) kullanılarak güç tasarrufu sağlanır

2. **Başarılı Sonuç**
   ```
   ✓ Konum alındı (±15m)
   ✓ Hoş geldiniz, Ad Soyad!
   ```
   - Tarama başarılı olur
   - Katılım kaydı oluşturulur

3. **Hata Senaryoları**

   #### a) Konum Alınamıyor
   ```
   ✕ Konum bilgisi alınamadı. Lütfen cihazın konum servisini açın ve baştan deneyin.
   ```
   - Cihazın konum servisi kapalıdır
   - Tarama engellenir (Attendance kaydedilmez)
   - HTTP 400 döndürülür

   #### b) Konum Aralığı Dışında
   ```
   ✕ Konumunuz etkinlikten 150m uzağında. Minimum mesafe: 50m
   ```
   - Katılımcı geofence aralığı dışında
   - Tarama engellenir
   - HTTP 403 döndürülür
   - Mesafe bilgisi gösterilir

   #### c) Konum Hizmeti Kullanılamıyor
   ```
   ✕ Cihazınız konum hizmetlerini desteklemiyor
   ```
   - Tarayıcı `navigator.geolocation` desteklemez
   - Tarama engellenir

## Teknik Detaylar

### Haversine Formülü ile Mesafe Hesaplama
```typescript
function calculateDistance(coord1, coord2): number {
  // İki koordinat arasındaki havanın kuş uçuşu mesafesini metre cinsinden döndürür
}
```

### API Hata Kodları
| Kod | HTTP | Anlamı | Kullanıcı Mesajı |
|-----|------|--------|------------------|
| `LOCATION_UNAVAILABLE` | 400 | Konum alınamadı | "Konum bilgisi alınamadı. Bu etkinlik için konum doğrulaması gereklidir." |
| `LOCATION_OUT_OF_RANGE` | 403 | Geofence dışında | "Konumunuz etkinlikten Xm uzağında. Minimum mesafe: Ym" |

### Veritabanı
```prisma
model Attendance {
  latitude: Float?          // Taramanın yapıldığı konum
  longitude: Float?
  accuracyMeter: Float?     // Konum doğruluğu
  status: String            // "success" veya "location_failed"
  errorMessage: String?     // Hata detayı
}

model Event {
  latitude: Float?          // Etkinlik konumu
  longitude: Float?
  radius: Float             // Geofence yarıçapı (metre)
}
```

## Senaryo Örnekleri

### Senaryo 1: Başarılı Tarama
```
1. Katılımcı QR tarama ekranında "📷 QR Kodunu Tara" tıklar
2. Sistem konum izni ister (eğer alan vermemişse)
3. Konum alınır: 41.0082°N, 28.9784°E (±15m doğruluk)
4. Etkinlik konumu: 41.0085°N, 28.9780°E, yarıçap: 50m
5. Mesafe: 35m (geofence içinde) ✓
6. Tarama başarılı, katılım kaydedilir
```

### Senaryo 2: Geofence Dışında
```
1. Konum alınır: 41.0200°N, 28.9800°E (katılımcı 2km uzakta)
2. Etkinlik konumu: 41.0082°N, 28.9784°E, yarıçap: 50m
3. Mesafe: 2100m (geofence dışında) ✕
4. Hata: "Konumunuz etkinlikten 2100m uzağında. Minimum mesafe: 50m"
5. Tarama ENGELLENIR, katılım kaydedilmez ❌
```

### Senaryo 3: Konum İzni Reddedildi
```
1. Sistem konum ister
2. Kullanıcı "Engelle" tıklar
3. navigator.geolocation.getCurrentPosition() hata callback'i çağrılır
4. Hata: "Konum izini reddettiniz. Ayarlar > Gizlilik > Konum'dan izin verin."
5. Tarama ENGELLENIR ❌
```

## Kullanıcı Deneyimi

### Mobil Cihaz (iOS)
1. İlk tarama: "Kabul Et", "Sadece Kullanırken İzin Ver", "Engelle" seçenekleri
2. Sonraki taramalar: İzin durumuna göre otomatik konum alımı
3. Konum alınamıyorsa: Ayarlar > Gizlilik > Konum > [App] değiştirilir

### Mobil Cihaz (Android)
1. İlk tarama: "İzin Ver", "Engelle" seçenekleri
2. Konum alınırken "Konum bilgisi alınıyor..." gösterilir
3. Hata durumunda açık mesaj gösterilir

### Masaüstü / Laptop
1. Eğer GPS varsa (nadiren) çalışır
2. Çoğu durumda: "Cihaz konum hizmetlerini desteklemiyor"
3. Etkinlik konumu belirtilmemişse: Konum doğrulaması yapılmaz

## Yönetici Kılavuzu

### Geofence Yarıçapı Ayarları
| Etkinlik Tipi | Önerilen Yarıçap | Açıklama |
|---------------|------------------|----------|
| Sınıf Dersi | 20-30m | Oda içerisinde tüm katılımcıları seçer |
| Amfi / Konferans Salonu | 30-50m | Geniş iç mekan etkinlikleri |
| Açık Alan Konferansı | 50-100m | Açık alanda sınırlanmış alan |
| Kampüs Etkinliği | 100-300m | Geniş alanlı etkinlikler |

### Sorun Giderme
- **"Konum alınamıyor"**: Cihazın GPS'i açık mı? İnternet bağlantısı var mı?
- **"Çoğu kişi dış konum dışında"**: Geofence yarıçapını artırın
- **"Koordinatlar yanlış"**: "📍 Konumu Al" butonunun konumu alırkenEtkinlik merkezine yakın bir alana taşıyın

## Entegrasyon

### Hesap Makinesiyle Test
1. Admin panelinden etkinlik oluştururken "📍 Konumu Al" tıklayın
2. Konumu kontrol edin
3. Tarama testini yapın
4. Hata durumlarını gözlemleyin

### Webhook
Başarılı tarama `triggerWebhook()` çağrısı yapar:
```json
{
  "eventId": "...",
  "participantId": "...",
  "attendanceId": "...",
  "message": "Yoklama başarıyla kaydedildi"
}
```

Başarısız taramalar webhook'u tetiklemez.
