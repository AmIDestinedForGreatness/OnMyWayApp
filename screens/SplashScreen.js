import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.logoCircle}>
        <Text style={styles.logoEmoji}>🗺️</Text>
      </View>
      <Text style={styles.brand}>On My Way!</Text>
      <Text style={styles.tagline}>Properties Near You</Text>
      <ActivityIndicator color="#4A9EFF" size="small" style={{ marginTop: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628', alignItems: 'center', justifyContent: 'center' },
  logoCircle: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: '#185FA5',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#4A9EFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  logoEmoji: { fontSize: 48 },
  brand: { color: '#FFFFFF', fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  tagline: { color: '#4A9EFF', fontSize: 14, marginTop: 6, letterSpacing: 1 },
});
