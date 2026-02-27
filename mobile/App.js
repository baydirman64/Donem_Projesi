import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ReportDetailScreen from './src/screens/ReportDetailScreen';
import MyReportsScreen from './src/screens/MyReportsScreen';
import MapScreen from './src/screens/MapScreen';
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

// Ekranlarımızı çağırıyoruz
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen'; 
import HomeScreen from './src/screens/HomeScreen';         
import ReportScreen from './src/screens/ReportScreen'; // Yeni sayfamızı çağırdık

const Stack = createNativeStackNavigator();

const AppNav = () => {
  const { userToken, isLoading } = useContext(AuthContext);

  // Telefon hafızası okunurken yükleniyor ikonu göster
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken === null ? (
          // Kullanıcı giriş YAPMADIYSA bu ekranları görsün
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Kayıt Ol' }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
          </>
        ) : (
          // Kullanıcı giriş YAPTIYSA bu ekranları görsün (Hem Ana Sayfa hem de Sorun Bildir)
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Ana Sayfa' }} />
            <Stack.Screen name="Report" component={ReportScreen} options={{ title: 'Sorun Bildir' }} />
            <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Şikayet Haritası' }} />
            <Stack.Screen name="MyReports" component={MyReportsScreen} options={{ title: 'Bildirimler' }} />
            <Stack.Screen name="ReportDetail" component={ReportDetailScreen} options={{ title: 'Şikayet Detayı' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppNav />
    </AuthProvider>
  );
}