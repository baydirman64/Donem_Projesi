import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

// Uygulamadaki Kategori Seçeneklerimiz
const CATEGORIES = [
    '🛣️ Yol/Asfalt', 
    '🐶 Sokak Hayvanları', 
    '🗑️ Çöp/Temizlik', 
    '💧 Su/Altyapı', 
    '🌳 Park/Bahçe', 
    '💡 Aydınlatma', 
    '⚠️ Diğer'
];

const ReportScreen = ({ navigation }) => {
    // title yerine artık category kullanıyoruz
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // 📸 GALERİDEN Fotoğraf Seçme
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Hata', 'Galeriye erişim izni gerekiyor!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    // 📷 KAMERADAN Fotoğraf Çekme (YENİ!)
    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Hata', 'Kameraya erişim izni gerekiyor!');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    // 📍 GPS'ten Konum Alma
    const getLocation = async () => {
        setIsLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Hata', 'Konuma erişim izni gerekiyor!');
            setIsLoading(false);
            return;
        }

        let currentLoc = await Location.getCurrentPositionAsync({});
        setLocation(currentLoc.coords);
        setIsLoading(false);
    };

    // 🚀 Verileri Backend'e Gönder
    const handleSubmit = async () => {
        if (!category || !description || !image || !location) {
            Alert.alert('Eksik Bilgi', 'Lütfen kategori seçin ve tüm alanları doldurun.');
            return;
        }

        setIsLoading(true);

        try {
            // YENİ: Başlıktaki emojiyi veritabanı çökmesin diye siliyoruz. 
            // Sadece boşluktan sonrasını alıyoruz (Örn: "🐶 Sokak Hayvanları" -> "Sokak Hayvanları")
            const safeTitle = category.substring(category.indexOf(' ') + 1);

            const formData = new FormData();
            formData.append('title', safeTitle); // Emojisiz güvenli başlık
            formData.append('description', description);
            formData.append('category', 'road'); // Veritabanının daha önce kabul ettiği güvenli kategori kelimesi
            formData.append('danger_level', 'medium'); 
            formData.append('latitude', location.latitude);
            formData.append('longitude', location.longitude);
            formData.append('address', 'Haritadan seçilen konum');

            const filename = image.uri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;
            formData.append('photo', { uri: image.uri, name: filename, type });

            await api.post('/reports', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setShowSuccessModal(true);
        } catch (error) {
            console.error('Gönderme hatası:', error);
            Alert.alert('Hata', 'Şikayet gönderilemedi.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        navigation.goBack(); 
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerContainer}>
                <Ionicons name="megaphone-outline" size={40} color="#3498db" />
                <Text style={styles.header}>Yeni Sorun Bildir</Text>
                <Text style={styles.subHeader}>Çevrenizdeki sorunları anında iletin.</Text>
            </View>

            {/* YENİ: Kategori Seçici (Chips) */}
            <Text style={styles.sectionTitle}>Sorun Kategorisi Nedir?</Text>
            <View style={styles.categoriesContainer}>
                {CATEGORIES.map((cat, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={[
                            styles.categoryChip, 
                            category === cat && styles.categoryChipSelected // Seçiliyse rengini değiştir
                        ]}
                        onPress={() => setCategory(cat)}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            styles.categoryText,
                            category === cat && styles.categoryTextSelected
                        ]}>
                            {cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Açıklama Input */}
            <Text style={styles.sectionTitle}>Detaylı Açıklama</Text>
            <View style={[styles.inputContainer, { alignItems: 'flex-start', paddingTop: 10 }]}>
                <Ionicons name="document-text-outline" size={20} color="#7f8c8d" style={styles.inputIcon} />
                <TextInput 
                    style={[styles.input, { height: 80, textAlignVertical: 'top' }]} 
                    placeholder="Lütfen sorunu detaylıca anlatın..." 
                    value={description} 
                    onChangeText={setDescription} 
                    multiline 
                />
            </View>

            {/* Aksiyon Butonları (Kamera ve Galeri Yan Yana) */}
            <Text style={styles.sectionTitle}>Fotoğraf Ekle</Text>
            <View style={styles.row}>
                <TouchableOpacity style={[styles.actionButton, image && { borderColor: '#27ae60', borderWidth: 2 }]} onPress={takePhoto} activeOpacity={0.7}>
                    <Ionicons name="camera-outline" size={30} color={image ? "#27ae60" : "#e67e22"} />
                    <Text style={styles.actionText}>Kamera</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionButton, image && { borderColor: '#27ae60', borderWidth: 2 }]} onPress={pickImage} activeOpacity={0.7}>
                    <Ionicons name="images-outline" size={30} color={image ? "#27ae60" : "#8e44ad"} />
                    <Text style={styles.actionText}>Galeri</Text>
                </TouchableOpacity>
            </View>

            {/* Konum Butonu (Tek Başına Alt Satırda) */}
            <TouchableOpacity style={[styles.actionButton, styles.locationButton, location && { borderColor: '#27ae60', borderWidth: 2 }]} onPress={getLocation} activeOpacity={0.7}>
                {isLoading && !location ? (
                    <ActivityIndicator color="#3498db" />
                ) : (
                    <Ionicons name={location ? "location" : "location-outline"} size={30} color={location ? "#27ae60" : "#3498db"} />
                )}
                <Text style={styles.actionText}>{location ? "Konum Başarıyla Alındı ✅" : "GPS Konumumu Al"}</Text>
            </TouchableOpacity>

            {/* Gönder Butonu */}
            <TouchableOpacity 
                style={[styles.submitButton, isLoading ? { backgroundColor: '#95a5a6' } : {}]} 
                onPress={handleSubmit} 
                disabled={isLoading}
                activeOpacity={0.8}
            >
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>🚀 ŞİKAYETİ GÖNDER</Text>}
            </TouchableOpacity>

            {/* BAŞARI MODALI */}
            <Modal visible={showSuccessModal} transparent={true} animationType="fade">
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Ionicons name="checkmark-circle" size={80} color="#27ae60" />
                        <Text style={styles.modalTitle}>Tebrikler!</Text>
                        <Text style={styles.modalText}>Şikayetiniz başarıyla belediyeye iletildi. En kısa sürede ilgilenilecektir.</Text>
                        <TouchableOpacity style={styles.modalButton} onPress={handleSuccessClose}>
                            <Text style={styles.modalButtonText}>Ana Sayfaya Dön</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#f5f6fa', flexGrow: 1 },
    headerContainer: { alignItems: 'center', marginBottom: 20, marginTop: 10 },
    header: { fontSize: 26, fontWeight: 'bold', color: '#2c3e50', marginTop: 10 },
    subHeader: { fontSize: 14, color: '#7f8c8d', marginTop: 5 },
    
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#34495e', marginBottom: 10, marginLeft: 5 },
    
    categoriesContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
    categoryChip: { 
        backgroundColor: '#fff', 
        paddingVertical: 10, 
        paddingHorizontal: 15, 
        borderRadius: 20, 
        margin: 5, 
        borderWidth: 1, 
        borderColor: '#dcdde1',
        elevation: 1 
    },
    categoryChipSelected: { backgroundColor: '#3498db', borderColor: '#3498db' },
    categoryText: { color: '#2c3e50', fontWeight: '600' },
    categoryTextSelected: { color: '#fff' },

    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, marginBottom: 20, paddingHorizontal: 15, borderWidth: 1, borderColor: '#e1e5ea', elevation: 1 },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, paddingVertical: 12, fontSize: 16, color: '#2c3e50' },
    
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    actionButton: { flex: 1, backgroundColor: '#fff', padding: 15, borderRadius: 15, alignItems: 'center', marginHorizontal: 5, borderWidth: 1, borderColor: '#e1e5ea', elevation: 2 },
    locationButton: { marginHorizontal: 0, marginBottom: 25, padding: 15, flexDirection: 'row', justifyContent: 'center', gap: 10 },
    actionText: { marginTop: 5, fontSize: 14, fontWeight: 'bold', color: '#34495e', textAlign: 'center' },
    
    submitButton: { backgroundColor: '#2ecc71', padding: 18, borderRadius: 15, alignItems: 'center', elevation: 3, marginBottom: 30 },
    submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

    modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
    modalContainer: { width: '85%', backgroundColor: '#fff', borderRadius: 20, padding: 30, alignItems: 'center', elevation: 10 },
    modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', marginTop: 15, marginBottom: 10 },
    modalText: { fontSize: 16, color: '#7f8c8d', textAlign: 'center', marginBottom: 25, lineHeight: 22 },
    modalButton: { backgroundColor: '#3498db', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
    modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default ReportScreen;