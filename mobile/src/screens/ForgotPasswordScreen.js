import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleReset = async () => {
        if (!email || !newPassword) {
            Alert.alert('Uyarı', 'Lütfen e-posta adresinizi ve yeni şifrenizi girin.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.post('/auth/reset-password', { email, newPassword });
            
            Alert.alert('Başarılı! 🎉', response.data.message, [
                { text: 'Giriş Yap', onPress: () => navigation.navigate('Login') }
            ]);
        } catch (error) {
            // Eğer e-posta yoksa backend 404 dönüyor, onu yakalıyoruz
            if (error.response && error.response.status === 404) {
                Alert.alert('Hata', 'Bu e-posta adresiyle kayıtlı bir hesap bulunamadı.');
            } else {
                Alert.alert('Hata', 'Şifre sıfırlama işlemi başarısız oldu.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <View style={styles.logoContainer}>
                <View style={styles.iconCircle}>
                    <Ionicons name="key-outline" size={50} color="#fff" />
                </View>
                <Text style={styles.title}>Şifreni mi Unuttun?</Text>
                <Text style={styles.subtitle}>E-posta adresini girerek yeni şifreni belirleyebilirsin.</Text>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={24} color="#7f8c8d" style={styles.inputIcon} />
                    <TextInput 
                        style={styles.input} 
                        placeholder="E-posta Adresiniz" 
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
                        placeholder="Yeni Şifreniz" 
                        value={newPassword} 
                        onChangeText={setNewPassword} 
                        secureTextEntry 
                    />
                </View>

                <TouchableOpacity style={styles.resetButton} onPress={handleReset} activeOpacity={0.8} disabled={isLoading}>
                    {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.resetButtonText}>ŞİFREMİ SIFIRLA</Text>}
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Giriş Ekranına Dön</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f6fa', justifyContent: 'center', padding: 20 },
    logoContainer: { alignItems: 'center', marginBottom: 40 },
    iconCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#f39c12', justifyContent: 'center', alignItems: 'center', elevation: 10, shadowColor: '#f39c12', shadowOpacity: 0.5, shadowRadius: 10, marginBottom: 15 },
    title: { fontSize: 26, fontWeight: 'bold', color: '#2c3e50', marginBottom: 5 },
    subtitle: { fontSize: 14, color: '#7f8c8d', textAlign: 'center', paddingHorizontal: 20 },
    formContainer: { paddingHorizontal: 10 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 15, marginBottom: 20, paddingHorizontal: 15, borderWidth: 1, borderColor: '#eee', elevation: 2 },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, paddingVertical: 15, fontSize: 16, color: '#2c3e50' },
    resetButton: { backgroundColor: '#f39c12', paddingVertical: 15, borderRadius: 15, alignItems: 'center', elevation: 5, shadowColor: '#f39c12', shadowOpacity: 0.4, shadowRadius: 5 },
    resetButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    backButton: { marginTop: 30, alignItems: 'center' },
    backButtonText: { color: '#3498db', fontSize: 16, fontWeight: 'bold' }
});

export default ForgotPasswordScreen;