const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Arkadaşın (frontend) token'ı gönderirken "Bearer [TOKEN_BURAYA]" şeklinde gönderecek
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Erişim reddedildi. Lütfen giriş yapın.' });
    }

    // "Bearer " kısmını atıp sadece token metnini alıyoruz
    const token = authHeader.split(' ')[1];

    try {
        // Token'ı o en başta belirlediğimiz gizli şifremizle çözüyoruz
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Çözülen bilgileri (kullanıcının id'si ve rolü) req.user içine koyuyoruz ki diğer dosyalarda kullanabilelim
        req.user = decoded; 
        
        next(); // Her şey yolundaysa kapıyı aç, işleme devam et
    } catch (error) {
        return res.status(401).json({ message: 'Geçersiz veya süresi dolmuş token.' });
    }
};

module.exports = { verifyToken };