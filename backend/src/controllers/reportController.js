const db = require('../config/db');

exports.createReport = async (req, res) => {
    try {
        // Arkadaşının mobilden göndereceği veriler
        const { title, category, danger_level, description, latitude, longitude, address } = req.body;
        
        // Kimlik doğrulama kapısından (authMiddleware) geçen kullanıcının ID'si
        const userId = req.user.id; 

        // Eğer fotoğraf yüklendiyse yolunu al, yüklenmediyse null yap
        const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

        // Veritabanına kayıt işlemi
        const [result] = await db.query(
            `INSERT INTO reports 
            (user_id, title, category, danger_level, description, photo_url, latitude, longitude, address) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, title, category, danger_level, description, photoUrl, latitude, longitude, address]
        );

        res.status(201).json({ 
            message: 'Şikayet başarıyla oluşturuldu!', 
            reportId: result.insertId,
            photoUrl: photoUrl
        });

    } catch (error) {
        console.error('Şikayet oluşturma hatası:', error);
        res.status(500).json({ message: 'Sunucu tarafında bir hata oluştu.' });
    }
};
exports.getAllReports = async (req, res) => {
    try {
        // SQL JOIN kullanarak şikayeti kimin açtığının (isim) bilgisini de ekliyoruz
        const [reports] = await db.query(`
            SELECT r.*, u.name as reporter_name 
            FROM reports r 
            JOIN users u ON r.user_id = u.id 
            ORDER BY r.created_at DESC
        `);
        res.status(200).json(reports);
    } catch (error) {
        console.error('Şikayetleri getirme hatası:', error);
        res.status(500).json({ message: 'Sunucu tarafında bir hata oluştu.' });
    }
};

// 2. Sadece Giriş Yapan Kullanıcının Şikayetleri
exports.getMyReports = async (req, res) => {
    try {
        const userId = req.user.id; // Kimlik kapısından geçen kullanıcının ID'si
        const [reports] = await db.query('SELECT * FROM reports WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        res.status(200).json(reports);
    } catch (error) {
        console.error('Kendi şikayetlerini getirme hatası:', error);
        res.status(500).json({ message: 'Sunucu tarafında bir hata oluştu.' });
    }
};

// 3. Tek Bir Şikayetin Detayı (ID'ye göre)
exports.getReportById = async (req, res) => {
    try {
        const { id } = req.params; // URL'den gelen id değerini al (örnek: /api/reports/5)
        const [reports] = await db.query(`
            SELECT r.*, u.name as reporter_name 
            FROM reports r 
            JOIN users u ON r.user_id = u.id 
            WHERE r.id = ?
        `, [id]);
        
        if (reports.length === 0) {
            return res.status(404).json({ message: 'Şikayet bulunamadı.' });
        }
        res.status(200).json(reports[0]);
    } catch (error) {
        console.error('Şikayet detay hatası:', error);
        res.status(500).json({ message: 'Sunucu tarafında bir hata oluştu.' });
    }
};
// YETKİLİ - Şikayet Durumunu Güncelle (PATCH)
exports.updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params; // Güncellenecek şikayetin ID'si
        const { status } = req.body; // Yeni durum ('pending', 'in_progress', 'resolved', 'rejected')

        // Veritabanında (enum) belirlediğimiz geçerli durumlardan biri mi diye kontrol edelim
        const validStatuses = ['pending', 'in_progress', 'resolved', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Geçersiz durum değeri.' });
        }

        const [result] = await db.query('UPDATE reports SET status = ? WHERE id = ?', [status, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Şikayet bulunamadı.' });
        }

        res.status(200).json({ message: `Şikayet durumu '${status}' olarak güncellendi.` });
    } catch (error) {
        console.error('Durum güncelleme hatası:', error);
        res.status(500).json({ message: 'Sunucu tarafında bir hata oluştu.' });
    }
};

// YETKİLİ - Şikayete Not Ekle (POST)
exports.addAuthorityNote = async (req, res) => {
    try {
        const reportId = req.params.id; // Hangi şikayete not eklenecek?
        const authorityId = req.user.id; // Notu ekleyen yetkilinin ID'si (Token'dan geliyor)
        const { note } = req.body;

        if (!note) {
            return res.status(400).json({ message: 'Not alanı boş bırakılamaz.' });
        }

        const [result] = await db.query(
            'INSERT INTO authority_notes (report_id, authority_id, note) VALUES (?, ?, ?)',
            [reportId, authorityId, note]
        );

        res.status(201).json({ message: 'Yetkili notu başarıyla eklendi.', noteId: result.insertId });
    } catch (error) {
        console.error('Not ekleme hatası:', error);
        res.status(500).json({ message: 'Sunucu tarafında bir hata oluştu.' });
    }
};

// Şikayetin durumunu dinamik olarak günceller
exports.updateStatus = async (req, res) => {
    try {
        const reportId = req.params.id;
        // Artık durumu direkt body'den (mobil uygulamadan) alıyoruz
        const { status } = req.body; 

        await db.query("UPDATE reports SET status = ? WHERE id = ?", [status, reportId]);
        res.status(200).json({ message: 'Şikayet durumu başarıyla güncellendi!' });
    } catch (error) {
        console.error('Durum güncelleme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
};

// Sadece giriş yapan kullanıcının şikayetlerini getirir
exports.getMyReports = async (req, res) => {
    try {
        // Token'dan gelen kullanıcı ID'sini alıyoruz
        const userId = req.user.id; 
        
        // Veritabanından sadece bu ID'ye ait olanları çekiyoruz
        const [reports] = await db.query("SELECT * FROM reports WHERE user_id = ?", [userId]);
        
        res.status(200).json(reports);
    } catch (error) {
        console.error('Kullanıcı şikayetlerini getirme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
};