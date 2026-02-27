const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/register isteği gelirse authController.register fonksiyonunu çalıştır
router.post('/register', authController.register);

// POST /api/auth/login isteği gelirse authController.login fonksiyonunu çalıştır
router.post('/login', authController.login);
// POST /api/auth/reset-password - Şifre Sıfırlama
router.post('/reset-password', authController.resetPassword);
module.exports = router;