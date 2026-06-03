import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function SignUpScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="light" />
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Create account</Text>
      <Text style={styles.subtitle}>Find your perfect staycation — book in minutes</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Full name</Text>
        <TextInput style={styles.input} placeholder="Juan dela Cruz" placeholderTextColor="#445566" />
        <Text style={styles.label}>Email address</Text>
        <TextInput style={styles.input} placeholder="juan@email.com" placeholderTextColor="#445566" keyboardType="email-address" autoCapitalize="none" />
        <Text style={styles.label}>Phone number</Text>
        <TextInput style={styles.input} placeholder="09XX XXX XXXX" placeholderTextColor="#445566" keyboardType="phone-pad" />
        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} placeholder="At least 8 characters" placeholderTextColor="#445566" secureTextEntry />
        <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.btnPrimaryText}>Create my account</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Already have an account? <Text style={styles.loginLinkBlue}>Log in</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0A1628',
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
  },
  back: {
    marginBottom: 24,
  },
  backText: {
    color: '#4A9EFF',
    fontSize: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#8899AA',
    marginTop: 6,
    marginBottom: 32,
  },
  form: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    color: '#8899AA',
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#111F35',
    borderWidth: 1,
    borderColor: '#1E3050',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 15,
  },
  btnPrimary: {
    backgroundColor: '#4A9EFF',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loginLink: {
    color: '#8899AA',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
  loginLinkBlue: {
    color: '#4A9EFF',
    fontWeight: '600',
  },
});
