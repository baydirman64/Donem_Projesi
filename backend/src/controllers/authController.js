const bcrypt = require('bcryptjs'); // Şifreleri şifrelemek için
const jwt = require('jsonwebtoken'); // YENİ EKLENDİ: Token üretmek için
const db = require('../config/db');  // Veritabanı bağlantımız

exports.register = async (req, res) => {
    try {
        // Arkadaşının mobilden veya webden göndereceği verileri alıyoruz
        const { name, email, password, role } = req.body;

        // 1. Bu e-posta daha önce kayıt olmuş mu kontrol edelim
        const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanımda.' });
        }

        // 2. Şifreyi düz metin olarak kaydetmek tehlikelidir. Kriptolayalım (Hash)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Kullanıcıyı veritabanına ekleyelim (Eğer rol belirtilmemişse varsayılan olarak 'citizen' yani vatandaş olur)
        const userRole = role || 'citizen';
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, userRole]
        );

        // 4. Başarılı mesajı dönelim
        res.status(201).json({ 
            message: 'Kullanıcı başarıyla oluşturuldu!', 
            userId: result.insertId 
        });

    } catch (error) {
        console.error('Kayıt hatası:', error);
        res.status(500).json({ message: 'Sunucu tarafında bir hata oluştu.' });
    }
};
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Veritabanında bu e-postaya sahip kullanıcı var mı?
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' });
        }

        const user = users[0]; // Kullanıcıyı değişkene aldık

        // 2. Şifreler uyuşuyor mu? (bcrypt bizim için düz şifre ile kriptolu şifreyi karşılaştırır)
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' });
        }

        // 3. Her şey doğruysa Token (Kimlik Kartı) oluştur
        // Token'ın içine id ve role bilgilerini koyuyoruz ki sistem bu kişinin kim olduğunu ve yetkisini bilsin.
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token 1 gün geçerli olsun
        );

        // 4. Token'ı ve kullanıcı bilgilerini frontend'e (arkadaşına) gönder (şifreyi hariç tutarak)
        res.status(200).json({
            message: 'Giriş başarılı!',
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Giriş hatası:', error);
        res.status(500).json({ message: 'Sunucu tarafında bir hata oluştu.' });
    }
};
// Şifre Sıfırlama Fonksiyonu
exports.resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        // 1. Önce bu e-posta ile kayıtlı biri var mı bakıyoruz
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'Bu e-posta adresi sistemde bulunamadı.' });
        }

        // 2. Varsa, yeni şifreyi şifreliyoruz (Hashliyoruz)
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 3. Veritabanındaki şifreyi güncelliyoruz
        await db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);

        res.status(200).json({ message: 'Şifreniz başarıyla güncellendi. Artık giriş yapabilirsiniz.' });
    } catch (error) {
        console.error('Şifre sıfırlama hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası. Şifre sıfırlanamadı.' });
    }
};