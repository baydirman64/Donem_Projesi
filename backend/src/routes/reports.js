const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Middleware'leri içeri aktarıyoruz
const { verifyToken } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');

// GET /api/reports/my-reports - Sadece giriş yapanın şikayetleri
router.get('/my-reports', verifyToken, reportController.getMyReports);

// POST /api/reports - Yeni şikayet oluşturma
// Sırasıyla: 1. Token geçerli mi? -> 2. Fotoğraf var mı yükle -> 3. Veritabanına kaydet
router.post('/', verifyToken, upload.single('photo'), reportController.createReport);

// PATCH /api/reports/:id/status - Sadece yetkililer durum güncelleyebilir
// Dikkat: Önce token kontrol ediliyor, sonra rolü 'authority' mi diye bakılıyor
router.patch('/:id/status', verifyToken, checkRole(['authority']), reportController.updateReportStatus);

// POST /api/reports/:id/note - Sadece yetkililer nota ekleyebilir
router.post('/:id/note', verifyToken, checkRole(['authority']), reportController.addAuthorityNote);

module.exports = router;

// GET /api/reports - Tüm şikayetleri listele
router.get('/', verifyToken, reportController.getAllReports);

// GET /api/reports/my - Sadece benim şikayetlerimi listele
router.get('/my', verifyToken, reportController.getMyReports);

// GET /api/reports/:id - Belirli bir şikayetin detayını getir
router.get('/:id', verifyToken, reportController.getReportById);

// PUT /api/reports/:id/status - Durum güncelleme rotası
router.put('/:id/status', verifyToken, reportController.updateStatus);