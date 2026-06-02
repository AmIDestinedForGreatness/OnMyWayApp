import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.hero}>
        <Text style={styles.emoji}>🏠</Text>
        <Text style={styles.title}>On My Way!</Text>
        <Text style={styles.subtitle}>Properties Near You</Text>
        <Text style={styles.tagline}>Discover homes for sale and rent as you move through your city</Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.btnPrimaryText}>Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSecondary} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.btnSecondaryText}>I already have an account</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.footer}>Built for Filipino home seekers</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 80,
    paddingHorizontal: 28,
  },
  hero: {
    alignItems: 'center',
    marginTop: 40,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A9EFF',
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  tagline: {
    fontSize: 15,
    color: '#8899AA',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 20,
  },
  buttons: {
    width: '100%',
    gap: 12,
  },
  btnPrimary: {
    backgroundColor: '#4A9EFF',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A3F5F',
  },
  btnSecondaryText: {
    color: '#8899AA',
    fontSize: 15,
    fontWeight: '500',
  },
  footer: {
    fontSize: 13,
    color: '#445566',
  },
});

