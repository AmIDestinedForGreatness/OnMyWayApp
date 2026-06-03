import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Switch, ActivityIndicator, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProperties } from '../context/PropertiesContext';

const APP_VERSION = 'V.1.1';

export default function HomeScreen({ navigation }) {
  const { user, adminMode, setAdminMode, myListings, reviewsReceived } = useProperties();
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#4A9EFF" />
        <Text style={styles.loadingText}>Finding staycations near you...</Text>
      </View>
    );
  }

  const initials = user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const hasReviews = reviewsReceived.length > 0;
  const ratingDisplay = hasReviews ? `⭐ ${user.rating.toFixed(1)}` : 'No reviews yet';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}>

        <View style={styles.topRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.brand}>On My Way!</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileBtn}>
            {user.avatarUri ? (
              <Image source={{ uri: user.avatarUri }} style={styles.profileAvatar} />
            ) : (
              <View style={styles.profileAvatarFallback}>
                <Text style={styles.profileAvatarText}>{initials}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.tagline}>Tara, staycation! ✨</Text>

        {/* Find a staycation */}
        <TouchableOpacity
          style={[styles.bigCard, styles.browseCard]}
          onPress={() => navigation.navigate('Map')}
        >
          <View style={styles.cardIconCircle}>
            <Text style={styles.cardIcon}>🗺️</Text>
          </View>
          <Text style={styles.bigCardTitle}>Find a staycation</Text>
          <Text style={styles.bigCardSub}>Discover Filipino-owned rentals near you on the map</Text>
          <View style={styles.arrow}>
            <Text style={styles.arrowText}>→</Text>
          </View>
        </TouchableOpacity>

        {/* Host your space */}
        <TouchableOpacity
          style={[styles.bigCard, styles.sellCard]}
          onPress={() => navigation.navigate('Sell')}
        >
          <View style={[styles.cardIconCircle, styles.sellIconCircle]}>
            <Text style={styles.cardIcon}>🏠</Text>
          </View>
          <Text style={styles.bigCardTitle}>Host your space</Text>
          <Text style={styles.bigCardSub}>List your property and earn from staycation guests</Text>
          <View style={[styles.arrow, styles.sellArrow]}>
            <Text style={styles.arrowText}>→</Text>
          </View>
        </TouchableOpacity>

        {/* Profile card */}
        <TouchableOpacity style={styles.profileCard} onPress={() => navigation.navigate('Profile')}>
          <View style={styles.profileCardLeft}>
            {user.avatarUri ? (
              <Image source={{ uri: user.avatarUri }} style={styles.profileCardAvatar} />
            ) : (
              <View style={styles.profileCardAvatarFallback}>
                <Text style={styles.profileCardAvatarText}>{initials}</Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.profileCardName}>{user.displayName}</Text>
              <Text style={styles.profileCardSub}>
                {myListings.length} {myListings.length === 1 ? 'listing' : 'listings'} · {ratingDisplay}
              </Text>
            </View>
          </View>
          <Text style={styles.viewProfileLink}>View profile</Text>
        </TouchableOpacity>

        {/* Dev mode */}
        <View style={styles.devCard}>
          <View style={styles.devRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.devTitle}>🛠️ Developer mode</Text>
              <Text style={styles.devSub}>GPS spoofing joystick + tap-teleport for testing proximity features</Text>
            </View>
            <Switch
              value={adminMode}
              onValueChange={setAdminMode}
              trackColor={{ false: '#1E3050', true: '#CC0000' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.logout} onPress={() => navigation.replace('Welcome')}>
          <Text style={styles.logoutText}>Sign out</Text>
        </TouchableOpacity>

      </ScrollView>

      <Text style={[styles.versionBadge, { bottom: insets.bottom + 8 }]}>{APP_VERSION}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  loadingContainer: { flex: 1, backgroundColor: '#0A1628', alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#8899AA', fontSize: 13, marginTop: 16 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  brand: { fontSize: 30, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5 },
  profileBtn: { width: 56, height: 56, borderRadius: 28, overflow: 'hidden', borderWidth: 2, borderColor: '#1E3050' },
  profileAvatar: { width: '100%', height: '100%' },
  profileAvatarFallback: { width: '100%', height: '100%', backgroundColor: '#185FA5', alignItems: 'center', justifyContent: 'center' },
  profileAvatarText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  tagline: { fontSize: 16, color: '#8899AA', marginTop: 20, marginBottom: 20 },
  bigCard: { padding: 22, borderRadius: 20, marginBottom: 14, position: 'relative', overflow: 'hidden', minHeight: 160 },
  browseCard: { backgroundColor: '#185FA5' },
  sellCard: { backgroundColor: '#0F6E56' },
  cardIconCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  sellIconCircle: { backgroundColor: 'rgba(255,255,255,0.2)' },
  cardIcon: { fontSize: 26 },
  bigCardTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  bigCardSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  arrow: { position: 'absolute', top: 22, right: 22, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  sellArrow: { backgroundColor: 'rgba(255,255,255,0.2)' },
  arrowText: { fontSize: 18, color: '#FFFFFF', fontWeight: '700' },
  profileCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#111F35', borderWidth: 1, borderColor: '#1E3050', borderRadius: 14, padding: 14, marginTop: 4 },
  profileCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  profileCardAvatar: { width: 42, height: 42, borderRadius: 21 },
  profileCardAvatarFallback: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#185FA5', alignItems: 'center', justifyContent: 'center' },
  profileCardAvatarText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  profileCardName: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  profileCardSub: { fontSize: 11, color: '#8899AA', marginTop: 2 },
  viewProfileLink: { color: '#4A9EFF', fontSize: 13, fontWeight: '700' },
  devCard: { marginTop: 14, backgroundColor: '#111F35', borderWidth: 1, borderColor: '#1E3050', borderRadius: 14, padding: 14 },
  devRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  devTitle: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  devSub: { fontSize: 11, color: '#8899AA', marginTop: 4, lineHeight: 16 },
  logout: { marginTop: 30, alignItems: 'center' },
  logoutText: { color: '#445566', fontSize: 13 },
  versionBadge: { position: 'absolute', right: 16, color: '#445566', fontSize: 11 },
});
