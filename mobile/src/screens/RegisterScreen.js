import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun.');
            return;
        }

        setIsLoading(true);

        try {
            // Backend'e kayıt isteği atıyoruz
            await api.post('/auth/register', { name, email, password });
            
            Alert.alert('Harika!', 'Kayıt başarılı. Şimdi giriş yapabilirsiniz.', [
                { text: 'Tamam', onPress: () => navigation.navigate('Login') }
            ]);
        } catch (error) {
            console.error('Kayıt hatası:', error);
            Alert.alert('Hata', 'Kayıt olunamadı. E-posta adresi zaten kullanılıyor olabilir.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={{ flex: 1, backgroundColor: '#f5f6fa' }}
        >
            {/* Küçük ekranlı telefonlarda klavye açılınca kaydırılabilmesi için ScrollView kullanıyoruz */}
            <ScrollView contentContainerStyle={styles.container}>
                
                {/* Üst Kısım: Logo ve Karşılama */}
                <View style={styles.logoContainer}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="person-add" size={50} color="#fff" />
                    </View>
                    <Text style={styles.appName}>Aramıza Katıl!</Text>
                    <Text style={styles.slogan}>Sorunları birlikte çözelim.</Text>
                </View>

                {/* Orta Kısım: Girdiler */}
                <View style={styles.formContainer}>
                    
                    {/* İsim Kutusu */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={24} color="#7f8c8d" style={styles.inputIcon} />
                        <TextInput 
                            style={styles.input} 
                            placeholder="Adınız Soyadınız" 
                            placeholderTextColor="#bdc3c7"
                            value={name} 
                            onChangeText={setName} 
                        />
                    </View>

                    {/* E-posta Kutusu */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={24} color="#7f8c8d" style={styles.inputIcon} />
                        <TextInput 
                            style={styles.input} 
                            placeholder="E-posta Adresiniz" 
                            placeholderTextColor="#bdc3c7"
                            value={email} 
                            onChangeText={setEmail} 
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Şifre Kutusu */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={24} color="#7f8c8d" style={styles.inputIcon} />
                        <TextInput 
                            style={styles.input} 
                            placeholder="Şifreniz" 
                            placeholderTextColor="#bdc3c7"
                            value={password} 
                            onChangeText={setPassword} 
                            secureTextEntry 
                        />
                    </View>

                    {/* Buton */}
                    <TouchableOpacity 
                        style={styles.registerButton} 
                        onPress={handleRegister} 
                        activeOpacity={0.8} 
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.registerButtonText}>KAYIT OL</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Alt Kısım: Giriş Yap Yönlendirmesi */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Zaten hesabın var mı? </Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.loginText}>Giriş Yap</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, justifyContent: 'center', paddingVertical: 40 },
    
    logoContainer: { alignItems: 'center', marginBottom: 40 },
    iconCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#2ecc71', justifyContent: 'center', alignItems: 'center', elevation: 10, shadowColor: '#2ecc71', shadowOpacity: 0.5, shadowRadius: 10, marginBottom: 15 },
    appName: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50', marginBottom: 5 },
    slogan: { fontSize: 14, color: '#7f8c8d' },

    formContainer: { paddingHorizontal: 30 },
    inputContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#fff', 
        borderRadius: 15, 
        marginBottom: 20, 
        paddingHorizontal: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        borderWidth: 1,
        borderColor: '#eee'
    },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, paddingVertical: 15, fontSize: 16, color: '#2c3e50' },

    registerButton: { 
        backgroundColor: '#2ecc71', 
        paddingVertical: 15, 
        borderRadius: 15, 
        alignItems: 'center', 
        marginTop: 10,
        elevation: 5,
        shadowColor: '#2ecc71',
        shadowOpacity: 0.4,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 }
    },
    registerButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },

    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 40 },
    footerText: { fontSize: 15, color: '#7f8c8d' },
    loginText: { fontSize: 15, color: '#2ecc71', fontWeight: 'bold' }
});

export default RegisterScreen;