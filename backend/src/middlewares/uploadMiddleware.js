const multer = require('multer');
const path = require('path');

// Yüklenecek dosyaların nereye ve hangi isimle kaydedileceğini belirliyoruz
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Dosyalar uploads klasörüne gidecek
    },
    filename: (req, file, cb) => {
        // Dosya isminin sonuna anlık zaman damgası ekliyoruz ki aynı isimde iki dosya çakışmasın
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Sadece resim dosyalarına izin veren bir filtre
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Lütfen sadece resim dosyası yükleyin!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Maksimum 5MB dosya boyutu sınırı
});

module.exports = upload;