const checkRole = (roles) => {
    return (req, res, next) => {
        // Eğer giriş yapmış bir kullanıcı yoksa veya kullanıcının rolü izin verilen roller (roles) içinde değilse
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Bu işlem için yetkiniz bulunmamaktadır.' });
        }
        next(); // Yetkisi varsa kapıyı aç
    };
};

module.exports = { checkRole };