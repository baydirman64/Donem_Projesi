# 🏙️ Şehir Sorun Bildir - Full-Stack Mobil Uygulama

Bu proje, vatandaşların çevrelerinde gördükleri altyapı, temizlik, sokak hayvanları gibi sorunları yetkililere (belediyeye) anlık olarak fotoğraflı ve konumlu bir şekilde bildirmesini sağlayan tam teşekküllü bir mobil uygulamadır.

---

## 🛑 BAŞLAMADAN ÖNCE: Gerekli Programların Kurulumu

Projeyi bilgisayarınızda çalıştırabilmek için öncelikle aşağıdaki temel yazılımların kurulu olması gerekmektedir. Eğer bunlar bilgisayarınızda yoksa, linklere tıklayarak **varsayılan ayarlarıyla (Next > Next diyerek)** kurun:

1. **[Node.js](https://nodejs.org/):** Sitedeki **LTS (Recommended for most users)** sürümünü indirin ve kurun. (Bu, projenin altyapısını çalıştıracak motorumuzdur).
2. **[MySQL ve MySQL Workbench](https://dev.mysql.com/downloads/installer/):** Veritabanımız için gereklidir. Kurulum sırasında belirlediğiniz **"Root Password" (Şifre)** kısmını unutmayın, projede kullanacağız!
3. **[Git](https://git-scm.com/downloads):** Projeyi bilgisayarınıza indirebilmeniz için gereklidir.
4. **Telefonunuza "Expo Go" Uygulaması:** iPhone kullanıyorsanız App Store'dan, Android kullanıyorsanız Google Play Store'dan **"Expo Go"** uygulamasını indirin.

---

## 🚀 A'dan Z'ye Proje Kurulum Rehberi

Gerekli programları kurduysanız, sırasıyla aşağıdaki adımları izleyin:

### 1. Projeyi Bilgisayarınıza İndirin
Masaüstünde (veya istediğiniz bir yerde) boş bir klasör açın. Klasörün içinde sağ tıklayıp **"Open in Terminal"** (veya Git Bash Here) diyerek terminali açın ve şu komutu yapıştırın:
\`\`\`bash
git clone https://github.com/baydirman64/Donem_Projesi.git
\`\`\`
*(Dosyalar indikten sonra VS Code gibi bir kod editörü ile bu klasörü açın).*

### 2. Tek Tıkla Kütüphaneleri Kurun
Projeyi VS Code'da açtıktan sonra üst menüden **Terminal -> New Terminal** diyerek terminali açın ve şu "Sihirli" komutu yazıp Enter'a basın:
\`\`\`bash
npm run kurulum
\`\`\`
*(Bu komut, uygulamanın çalışması için gereken tüm paketleri hem backend hem de mobile klasörlerine otomatik olarak indirecektir).*

### 3. Veritabanını (MySQL) Hazırlayın
1. Bilgisayarınızdan **MySQL Workbench** programını açın ve giriş yapın.
2. Üst menüden **Server -> Data Import** seçeneğine tıklayın.
3. **"Import from Self-Contained File"** seçeneğini işaretleyip, proje klasörünüzün ana dizininde bulunan **`database.sql`** dosyasını seçin.
4. Sağ alttaki **"Start Import"** butonuna basarak tabloları sisteminize yükleyin.

### 4. Şifre ve IP Ayarlarını Kendi Bilgisayarınıza Göre Yapın
**A) Veritabanı Şifresi:**
- VS Code'dan `backend/src/config/db.js` dosyasını açın.
- `password: "SENIN_MYSQL_SIFREN"` yazan yere, kendi MySQL şifrenizi yazın.

**B) Ağ IP Adresi (Çok Önemli):**
- Bilgisayarınızda başlat menüsüne `cmd` yazıp Komut İstemini açın ve **`ipconfig`** yazıp Enter'a basın.
- Orada yazan **IPv4 Adresinizi** (Örn: 192.168.1.55) kopyalayın.
- VS Code'dan `mobile/src/services/api.js` dosyasını açın ve `baseURL` kısmındaki IP adresi yerine kendi IPv4 adresinizi yapıştırın.

---

## 🎮 Projeyi Ayağa Kaldırma ve iPhone'da Çalıştırma

🚨 **DİKKAT:** Telefonunuzun bağlandığı Wi-Fi ağı ile bilgisayarınızın bağlandığı internet ağı **KESİNLİKLE AYNI OLMALIDIR.** Aksi takdirde uygulama telefonunuzda açılmaz!

VS Code'da alt kısımdaki terminal panelinde yan yana **iki farklı terminal** sekmesi açın:

**1. Terminal (Arka Plan Sunucusu İçin):**
\`\`\`bash
cd backend
npm run dev
\`\`\`

**2. Terminal (Mobil Ön Yüz İçin):**
\`\`\`bash
cd mobile
npx expo start -c
\`\`\`

İkinci terminalde devasa bir **QR Kod** belirecek. 

📱 **iPhone (iOS) Kullanıcıları İçin:**
Telefonunuzun kendi normal **Kamera** uygulamasını açın ve ekrandaki QR kodu okutun. Ekranın üstünde beliren **"Expo Go'da aç"** bildirimine tıklayın. 

📱 **Android Kullanıcıları İçin:**
Direkt Expo Go uygulamasını açıp "Scan QR Code" butonuna basarak okutun.

Tebrikler! Şehir Sorun Bildir uygulaması artık tamamen sizin bilgisayarınızda ve telefonunuzda çalışıyor! 🎉