const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const userRoutes = require('./routes/users');

const db = require('./config/db');

// --- YENİ EKLENEN SATIR: Rota dosyamızı içeri aktarıyoruz ---
const authRoutes = require('./routes/auth');

// -- Şikayet rotalarını içeri aktar ---
const reportRoutes = require('./routes/reports');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.urlencoded({ extended: true }));

// --- uploads klasörünü dışarıdan erişilebilir yap ---
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('Şehir Sorun Bildir API tıkır tıkır çalışıyor!');
});

// --- YENİ EKLENEN SATIR: '/api/auth' ile başlayan tüm istekleri authRoutes'a yönlendir ---
app.use('/api/auth', authRoutes);

// ---'/api/reports' ile başlayan istekleri reportRoutes'a yönlendir ---
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda ayağa kalktı. 🔥`);
});