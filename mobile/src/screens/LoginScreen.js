import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Uyarı', 'Lütfen e-posta ve şifrenizi girin.');
            return;
        }
        setIsLoading(true);
        const success = await login(email, password);
        if (!success) {
            Alert.alert('Hata', 'E-posta veya şifre hatalı. Lütfen tekrar deneyin.');
            setIsLoading(false);
        }
        // Başarılıysa App.js zaten bizi otomatik Ana Sayfaya yönlendirecek!
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={styles.container}
        >
            {/* Üst Kısım: Logo ve Karşılama */}
            <View style={styles.logoContainer}>
                <View style={styles.iconCircle}>
                    <Ionicons name="location" size={60} color="#fff" />
                </View>
                <Text style={styles.appName}>Şehir Sorun Bildir</Text>
                <Text style={styles.slogan}>Şehrini güzelleştirmek senin elinde!</Text>
            </View>

            {/* Orta Kısım: Girdiler */}
            <View style={styles.formContainer}>
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
                    style={styles.loginButton} 
                    onPress={handleLogin} 
                    activeOpacity={0.8} 
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.loginButtonText}>GİRİŞ YAP</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text style={{ color: '#e74c3c', textAlign: 'right', marginBottom: 20, fontWeight: 'bold' }}>Şifremi Unuttum</Text>
                </TouchableOpacity>
            </View>

            {/* Alt Kısım: Kayıt Ol Yönlendirmesi */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>Hesabın yok mu? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerText}>Hemen Kayıt Ol</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f6fa', justifyContent: 'center' },
    
    logoContainer: { alignItems: 'center', marginBottom: 50 },
    iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#3498db', justifyContent: 'center', alignItems: 'center', elevation: 10, shadowColor: '#3498db', shadowOpacity: 0.5, shadowRadius: 10, marginBottom: 20 },
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

    loginButton: { 
        backgroundColor: '#3498db', 
        paddingVertical: 15, 
        borderRadius: 15, 
        alignItems: 'center', 
        marginTop: 10,
        elevation: 5,
        shadowColor: '#3498db',
        shadowOpacity: 0.4,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 }
    },
    loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },

    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 40 },
    footerText: { fontSize: 15, color: '#7f8c8d' },
    registerText: { fontSize: 15, color: '#3498db', fontWeight: 'bold' }
});

export default LoginScreen;