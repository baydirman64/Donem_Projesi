import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const MyReportsScreen = ({ navigation }) => {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Giren kişinin kim olduğunu AuthContext'ten alıyoruz
    const { userInfo } = useContext(AuthContext);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                // Kullanıcı admin mi kontrol et
                const isAdmin = userInfo?.role === 'admin';
                
                // Adminse tümünü (/reports), vatandaşsa sadece kendininkileri (/reports/my-reports) çek!
                const endpoint = isAdmin ? '/reports' : '/reports/my-reports';
                
                const response = await api.get(endpoint);
                setReports(response.data.reverse()); // En yeniler en üstte çıksın
            } catch (error) {
                console.error('Şikayetleri çekerken hata:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();
    }, [userInfo]); // userInfo değiştiğinde useEffect tekrar çalışsın

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ReportDetail', { report: item })}
        >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.description}</Text>
            
            <View style={styles.footer}>
                <Text style={styles.date}>Tarih: {new Date(item.created_at).toLocaleDateString('tr-TR')}</Text>
                <Text style={[styles.status, { color: item.status === 'resolved' ? '#27ae60' : '#f39c12' }]}>
                    {item.status === 'resolved' ? '✅ Çözüldü' : '⏳ İnceleniyor'}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3498db" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList 
                data={reports}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Size ait herhangi bir şikayet bulunamadı.</Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f6fa', padding: 15 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: { 
        backgroundColor: '#fff', 
        padding: 15, 
        borderRadius: 15, 
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        borderLeftWidth: 5,
        borderLeftColor: '#3498db'
    },
    title: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 5 },
    desc: { fontSize: 14, color: '#7f8c8d', marginBottom: 15 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
    date: { fontSize: 12, color: '#bdc3c7' },
    status: { fontSize: 14, fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: 'gray' }
});

export default MyReportsScreen;