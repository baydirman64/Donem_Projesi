import React, { useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
// İkonlarımızı içeri aktarıyoruz (Expo ile hazır gelir, kuruluma gerek yok)
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
    const { logout, userInfo } = useContext(AuthContext);

    if (!userInfo) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3498db" />
            </View>
        );
    }

    const isAdmin = userInfo.role === 'admin';

    return (
        <SafeAreaView style={styles.container}>
            {/* Üst Kısım: Karşılama ve Profil Avatarı */}
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{userInfo.name.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={styles.title}>Merhaba, {userInfo.name} 👋</Text>
                <Text style={styles.subtitle}>
                    {isAdmin ? '👑 Yetkili Yönetim Paneli' : 'Şehir Sorun Bildir Uygulaması'}
                </Text>
            </View>

            {/* Alt Kısım: Şık Menü Kartları */}
            <View style={styles.menuContainer}>
                
                {/* Yalnızca Vatandaşa Görünen Bildiri Butonu */}
                {!isAdmin && (
                    <TouchableOpacity 
                        style={[styles.card, { backgroundColor: '#3498db' }]} 
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('Report')}
                    >
                        <Ionicons name="add-circle" size={40} color="#fff" />
                        <Text style={styles.cardText}>Yeni Sorun Bildir</Text>
                    </TouchableOpacity>
                )}

                {/* Liste Butonu */}
                <TouchableOpacity 
                    style={[styles.card, { backgroundColor: '#8e44ad' }]} 
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('MyReports')}
                >
                    <Ionicons name="list" size={40} color="#fff" />
                    <Text style={styles.cardText}>{isAdmin ? "Tüm Şikayetleri Yönet" : "Bildirimlerim"}</Text>
                </TouchableOpacity>

                {/* Harita Butonu */}
                <TouchableOpacity 
                    style={[styles.card, { backgroundColor: '#27ae60' }]} 
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('Map')}
                >
                    <MaterialCommunityIcons name="map-marker-radius" size={40} color="#fff" />
                    <Text style={styles.cardText}>Haritayı Aç</Text>
                </TouchableOpacity>

                {/* Çıkış Yap Butonu (Farklı tasarım) */}
                <TouchableOpacity 
                    style={styles.logoutButton} 
                    activeOpacity={0.8}
                    onPress={logout}
                >
                    <Ionicons name="log-out-outline" size={24} color="#e74c3c" />
                    <Text style={styles.logoutText}>Çıkış Yap</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f6fa' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { 
        backgroundColor: '#fff', 
        padding: 30, 
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        marginBottom: 20
    },
    avatar: { 
        width: 70, 
        height: 70, 
        borderRadius: 35, 
        backgroundColor: '#34495e', 
        justifyContent: 'center', 
        alignItems: 'center',
        marginBottom: 15
    },
    avatarText: { fontSize: 30, color: '#fff', fontWeight: 'bold' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', marginBottom: 5 },
    subtitle: { fontSize: 14, color: '#7f8c8d' },
    menuContainer: { paddingHorizontal: 20, paddingBottom: 20 },
    card: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 20, 
        borderRadius: 15, 
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 }
    },
    cardText: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginLeft: 15 },
    logoutButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: 15, 
        borderRadius: 15, 
        borderWidth: 2, 
        borderColor: '#e74c3c', 
        marginTop: 20 
    },
    logoutText: { fontSize: 16, fontWeight: 'bold', color: '#e74c3c', marginLeft: 10 }
});

export default HomeScreen;