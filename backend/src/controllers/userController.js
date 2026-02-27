const db = require('../config/db');

// Giriş yapmış kullanıcının kendi profil bilgilerini getirir
exports.getMe = async (req, res) => {
    try {
        const userId = req.user.id; // Güvenlik kapısından (Token'dan) gelen ID

        // Veritabanından kullanıcıyı bul (Şifre sütununu bilerek ALMIYORUZ ki frontend'e gitmesin)
        const [users] = await db.query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ?', 
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        // Kullanıcı bilgilerini gönder
        res.status(200).json(users[0]);
    } catch (error) {
        console.error('Profil getirme hatası:', error);
        res.status(500).json({ message: 'Sunucu tarafında bir hata oluştu.' });
    }
};