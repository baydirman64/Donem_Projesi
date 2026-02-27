import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const ReportDetailScreen = ({ route, navigation }) => {
    const { report } = route.params;
    const { userInfo } = useContext(AuthContext);
    const [status, setStatus] = useState(report.status); // 'pending', 'in_progress', 'resolved'

    const isAdmin = userInfo?.role === 'admin';

    const serverUrl = api.defaults.baseURL.replace('/api', '');
    const imageSource = report.photo_url 
        ? { uri: `${serverUrl}${report.photo_url}` }
        : { uri: 'https://via.placeholder.com/400x250.png?text=Fotograf+Yok' };

    // Duruma göre metin ve renk belirleyen yardımcı fonksiyon
    const getStatusInfo = (currentStatus) => {
        switch(currentStatus) {
            case 'resolved': return { text: '✅ Çözüldü', color: '#27ae60', bgColor: '#27ae6020' };
            case 'in_progress': return { text: '🚧 Ekipler Bölgede', color: '#f39c12', bgColor: '#f39c1220' };
            default: return { text: '⏳ İnceleniyor', color: '#e74c3c', bgColor: '#e74c3c20' };
        }
    };

    const statusInfo = getStatusInfo(status);

    // Durum değiştirme fonksiyonu (Backend'e artık hangi duruma geçeceğini de söylüyoruz)
    const handleStatusChange = async (newStatus, successMessage) => {
        try {
            await api.put(`/reports/${report.id}/status`, { status: newStatus });
            setStatus(newStatus);
            Alert.alert('Başarılı!', successMessage);
        } catch (error) {
            Alert.alert('Hata', 'İşlem gerçekleştirilemedi.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={imageSource} style={styles.image} resizeMode="cover" />
            </View>

            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>{report.title}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
                        <Text style={[styles.statusText, { color: statusInfo.color }]}>
                            {statusInfo.text}
                        </Text>
                    </View>
                </View>

                <Text style={styles.date}>Tarih: {new Date(report.created_at).toLocaleDateString('tr-TR')}</Text>
                <View style={styles.divider} />
                <Text style={styles.sectionTitle}>Açıklama</Text>
                <Text style={styles.description}>{report.description}</Text>
                <View style={styles.divider} />

                {/* ADMİN KONTROL PANELLERİ */}
                {isAdmin && (
                    <View style={styles.adminPanel}>
                        {status === 'pending' && (
                            <TouchableOpacity 
                                style={[styles.adminButton, { backgroundColor: '#f39c12' }]} 
                                onPress={() => handleStatusChange('in_progress', 'Ekipler bölgeye yönlendirildi olarak işaretlendi.')}
                            >
                                <Text style={styles.adminButtonText}>🚧 EKİPLERİ YÖNLENDİR (SARI YAP)</Text>
                            </TouchableOpacity>
                        )}

                        {status === 'in_progress' && (
                            <TouchableOpacity 
                                style={[styles.adminButton, { backgroundColor: '#27ae60' }]} 
                                onPress={() => handleStatusChange('resolved', 'Bu şikayet tamamen çözüldü olarak işaretlendi.')}
                            >
                                <Text style={styles.adminButtonText}>✅ SORUNU ÇÖZÜLDÜ YAP (YEŞİL YAP)</Text>
                            </TouchableOpacity>
                        )}
                        
                        {status === 'resolved' && (
                            <Text style={styles.resolvedText}>Bu sorun başarıyla çözülmüştür.</Text>
                        )}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    imageContainer: { width: '100%', height: 280, backgroundColor: '#e1e5ea' },
    image: { width: '100%', height: '100%' },
    content: { padding: 20, backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, marginTop: -25 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50', flex: 1, marginRight: 10 },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
    statusText: { fontWeight: 'bold', fontSize: 12 },
    date: { fontSize: 13, color: '#95a5a6', marginBottom: 15 },
    divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#34495e', marginBottom: 8 },
    description: { fontSize: 15, color: '#555', lineHeight: 22 },
    adminPanel: { marginTop: 10 },
    adminButton: { padding: 15, borderRadius: 15, marginTop: 10, alignItems: 'center', elevation: 3 },
    adminButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    resolvedText: { textAlign: 'center', color: '#27ae60', fontWeight: 'bold', marginTop: 10, fontSize: 16 }
});

export default ReportDetailScreen;