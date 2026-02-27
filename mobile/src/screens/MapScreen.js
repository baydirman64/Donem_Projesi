import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import api from '../services/api';

const MapScreen = ({ navigation }) => {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Sayfa açıldığında backend'den tüm şikayetleri (GET) çek
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await api.get('/reports');
                setReports(response.data);
            } catch (error) {
                console.error('Şikayetleri çekerken hata:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3498db" />
                <Text>Harita Yükleniyor...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView 
                style={styles.map}
                // Başlangıç noktası olarak Kütahya/Türkiye civarını merkeze alalım
                initialRegion={{
                    latitude: 39.4242,
                    longitude: 29.9833,
                    latitudeDelta: 0.1, // Yakınlaştırma seviyesi
                    longitudeDelta: 0.1,
                }}
            >
                {/* Şikayetleri haritaya pin olarak ekliyoruz */}
                {/* Şikayetleri haritaya pin olarak ekliyoruz */}
                {reports.map((report) => (
                    <Marker 
                       key={report.id}
                          coordinate={{
                            latitude: parseFloat(report.latitude),
                            longitude: parseFloat(report.longitude)
                        }}
                        pinColor={
                            report.status === 'resolved' ? 'green' : 
                            report.status === 'in_progress' ? 'yellow' : 'red'
                       }
                        onPress={() => navigation.navigate('ReportDetail', { report: report })}
                    />
                ))}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { width: '100%', height: '100%' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    calloutContainer: { width: 150, padding: 5 },
    calloutTitle: { fontWeight: 'bold', fontSize: 14, marginBottom: 5 },
    calloutText: { fontSize: 12, marginBottom: 2 }
});

export default MapScreen;