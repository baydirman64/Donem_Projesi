const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Güvenlik kapısını çağırıyoruz
const { verifyToken } = require('../middlewares/authMiddleware');

// GET /api/users/me - Sadece giriş yapmış kişiler kendi profilini görebilir
router.get('/me', verifyToken, userController.getMe);

module.exports = router;