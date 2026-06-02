import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView,
  TextInput, Image, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useProperties } from '../context/PropertiesContext';

export default function ProfileScreen({ navigation }) {
  const { user, updateUser, myListings, reviewsReceived, reviewsGiven } = useProperties();
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('listings');
  const [name, setName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [bio, setBio] = useState(user.bio);
  const insets = useSafeAreaInsets();

  const initials = user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const hasReviews = reviewsReceived.length > 0;

  const pickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Allow access to photo library to set avatar.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      updateUser({ avatarUri: result.assets[0].uri });
    }
  };

  const saveProfile = () => {
    if (!name.trim()) return Alert.alert('Missing name', 'Please enter your display name.');
    updateUser({ displayName: name.trim(), email: email.trim(), phone: phone.trim(), bio: bio.trim() });
    setEditing(false);
    Alert.alert('Saved! ✓', 'Your profile has been updated.');
  };

  const cancelEdit = () => {
    setName(user.displayName);
    setEmail(user.email);
    setPhone(user.phone);
    setBio(user.bio);
    setEditing(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          {!editing ? (
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={saveProfile}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

          {/* Avatar section */}
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={editing ? pickAvatar : null} style={styles.avatarWrap}>
              {user.avatarUri ? (
                <Image source={{ uri: user.avatarUri }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
              )}
              {editing && (
                <View style={styles.avatarEditBadge}>
                  <Text style={{ fontSize: 14 }}>📷</Text>
                </View>
              )}
            </TouchableOpacity>

            {!editing ? (
              <>
                <Text style={styles.displayName}>{user.displayName}</Text>
                <Text style={styles.memberSince}>{user.memberSince}</Text>
                <View style={[styles.ratingPill, !hasReviews && styles.ratingPillEmpty]}>
                  {hasReviews ? (
                    <Text style={styles.ratingText}>⭐ {user.rating.toFixed(1)} · {user.totalReviews} reviews</Text>
                  ) : (
                    <Text style={styles.ratingTextEmpty}>N/A</Text>
                  )}
                </View>
                {!hasReviews && <Text style={styles.noReviewsLabel}>No reviews yet</Text>}
                {user.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}
              </>
            ) : (
              <View style={styles.editForm}>
                <Text style={styles.label}>Display name</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor="#445566" maxLength={30} />
                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="you@email.com" placeholderTextColor="#445566" keyboardType="email-address" autoCapitalize="none" />
                <Text style={styles.label}>Phone (PH)</Text>
                <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="09171234567" placeholderTextColor="#445566" keyboardType="phone-pad" />
                <Text style={styles.label}>Bio</Text>
                <TextInput style={[styles.input, styles.textArea]} value={bio} onChangeText={setBio} placeholder="Tell others about yourself..." placeholderTextColor="#445566" multiline maxLength={150} />
                <Text style={styles.charCount}>{bio.length}/150</Text>
                <TouchableOpacity style={styles.cancelBtn} onPress={cancelEdit}>
                  <Text style={styles.cancelBtnText}>Cancel changes</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {!editing && (
            <>
              {/* Contact info */}
              <View style={styles.contactCard}>
                <Text style={styles.contactTitle}>Contact information</Text>
                <View style={styles.contactRow}>
                  <Text style={styles.contactLabel}>📧 Email</Text>
                  <Text style={styles.contactValue}>{user.email}</Text>
                </View>
                <View style={styles.contactRow}>
                  <Text style={styles.contactLabel}>📱 Phone</Text>
                  <Text style={styles.contactValue}>{user.phone}</Text>
                </View>
              </View>

              {/* Settings + Help rows */}
              <View style={styles.menuCard}>
                <TouchableOpacity style={styles.menuRow} onPress={() => navigation.navigate('Settings')}>
                  <Text style={styles.menuIcon}>⚙️</Text>
                  <Text style={styles.menuLabel}>Settings</Text>
                  <Text style={styles.menuArrow}>→</Text>
                </TouchableOpacity>
                <View style={styles.menuDivider} />
                <TouchableOpacity style={styles.menuRow} onPress={() => navigation.navigate('Help')}>
                  <Text style={styles.menuIcon}>❓</Text>
                  <Text style={styles.menuLabel}>Help</Text>
                  <Text style={styles.menuArrow}>→</Text>
                </TouchableOpacity>
              </View>

              {/* Tabs */}
              <View style={styles.tabsRow}>
                <TouchableOpacity style={[styles.tab, activeTab === 'listings' && styles.tabActive]} onPress={() => setActiveTab('listings')}>
                  <Text style={[styles.tabText, activeTab === 'listings' && styles.tabTextActive]}>My listings ({myListings.length})</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab, activeTab === 'received' && styles.tabActive]} onPress={() => setActiveTab('received')}>
                  <Text style={[styles.tabText, activeTab === 'received' && styles.tabTextActive]}>Received ({reviewsReceived.length})</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab, activeTab === 'given' && styles.tabActive]} onPress={() => setActiveTab('given')}>
                  <Text style={[styles.tabText, activeTab === 'given' && styles.tabTextActive]}>Given ({reviewsGiven.length})</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.tabContent}>
                {activeTab === 'listings' && (
                  myListings.length === 0 ? (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyIcon}>🏠</Text>
                      <Text style={styles.emptyTitle}>No listings yet</Text>
                      <Text style={styles.emptySub}>Spaces you host will appear here</Text>
                      <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('Sell')}>
                        <Text style={styles.emptyBtnText}>+ Host your space</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    myListings.map((p) => (
                      <View key={p.id} style={styles.listingItem}>
                        {p.photos && p.photos[0] && (
                          <Image source={p.photos[0]} style={styles.listingPhoto} />
                        )}
                        <View style={{ flex: 1 }}>
                          <View style={styles.listingBadge}>
                            <Text style={styles.listingBadgeText}>STAYCATION</Text>
                          </View>
                          <Text style={styles.listingPrice}>{p.price}</Text>
                          <Text style={styles.listingTitle} numberOfLines={1}>{p.title}</Text>
                          <Text style={styles.listingAddr} numberOfLines={1}>📍 {p.address}</Text>
                        </View>
                      </View>
                    ))
                  )
                )}

                {activeTab === 'received' && (
                  reviewsReceived.length === 0 ? (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyIcon}>⭐</Text>
                      <Text style={styles.emptyTitle}>No reviews yet</Text>
                      <Text style={styles.emptySub}>Reviews from guests will appear here</Text>
                    </View>
                  ) : (
                    reviewsReceived.map((r) => (
                      <View key={r.id} style={styles.reviewCard}>
                        <View style={styles.reviewTop}>
                          <Text style={styles.reviewUser}>{r.user}</Text>
                          <Text style={styles.reviewDate}>{r.date}</Text>
                        </View>
                        <Text style={styles.reviewStars}>{'⭐'.repeat(r.rating)}</Text>
                        <Text style={styles.reviewText}>{r.text}</Text>
                      </View>
                    ))
                  )
                )}

                {activeTab === 'given' && (
                  reviewsGiven.length === 0 ? (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyIcon}>✍️</Text>
                      <Text style={styles.emptyTitle}>No reviews given</Text>
                      <Text style={styles.emptySub}>After staying, you can leave reviews here</Text>
                    </View>
                  ) : (
                    reviewsGiven.map((r) => (
                      <View key={r.id} style={styles.reviewCard}>
                        <View style={styles.reviewTop}>
                          <Text style={styles.reviewUser}>For: {r.targetName}</Text>
                          <Text style={styles.reviewDate}>{r.date}</Text>
                        </View>
                        <Text style={styles.reviewStars}>{'⭐'.repeat(r.rating)}</Text>
                        <Text style={styles.reviewText}>{r.text}</Text>
                      </View>
                    ))
                  )
                )}
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1E3050' },
  backText: { color: '#4A9EFF', fontSize: 15, width: 60 },
  headerTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  editText: { color: '#4A9EFF', fontSize: 15, width: 60, textAlign: 'right' },
  saveText: { color: '#1D9E75', fontSize: 15, fontWeight: '700', width: 60, textAlign: 'right' },
  avatarSection: { padding: 24, alignItems: 'center' },
  avatarWrap: { position: 'relative', marginBottom: 14 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#1E3050' },
  avatarFallback: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#185FA5', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#1E3050' },
  avatarText: { color: '#FFFFFF', fontSize: 32, fontWeight: '800' },
  avatarEditBadge: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: '#4A9EFF', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#0A1628' },
  displayName: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', marginTop: 6 },
  memberSince: { color: '#8899AA', fontSize: 12, marginTop: 4 },
  ratingPill: { backgroundColor: '#111F35', borderWidth: 1, borderColor: '#1E3050', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, marginTop: 10 },
  ratingPillEmpty: { backgroundColor: 'transparent', borderColor: '#445566' },
  ratingText: { color: '#EF9F27', fontSize: 12, fontWeight: '600' },
  ratingTextEmpty: { color: '#8899AA', fontSize: 12, fontWeight: '700' },
  noReviewsLabel: { color: '#8899AA', fontSize: 11, marginTop: 4, fontStyle: 'italic' },
  bio: { color: '#CCDDEE', fontSize: 13, marginTop: 12, textAlign: 'center', paddingHorizontal: 20, lineHeight: 18 },
  editForm: { width: '100%', marginTop: 8 },
  label: { color: '#8899AA', fontSize: 12, fontWeight: '600', marginTop: 14, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: '#111F35', borderWidth: 1, borderColor: '#1E3050', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: '#FFFFFF', fontSize: 14 },
  textArea: { height: 80, textAlignVertical: 'top' },
  charCount: { fontSize: 11, color: '#445566', textAlign: 'right', marginTop: 4 },
  cancelBtn: { marginTop: 18, alignItems: 'center', padding: 12 },
  cancelBtnText: { color: '#8899AA', fontSize: 13 },
  contactCard: { marginHorizontal: 20, backgroundColor: '#111F35', borderWidth: 1, borderColor: '#1E3050', borderRadius: 14, padding: 16, marginTop: 8 },
  contactTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginBottom: 12 },
  contactRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  contactLabel: { color: '#8899AA', fontSize: 13 },
  contactValue: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  menuCard: { marginHorizontal: 20, marginTop: 14, backgroundColor: '#111F35', borderWidth: 1, borderColor: '#1E3050', borderRadius: 14, paddingHorizontal: 16 },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 12 },
  menuIcon: { fontSize: 18, width: 26 },
  menuLabel: { flex: 1, color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  menuArrow: { color: '#4A9EFF', fontSize: 18 },
  menuDivider: { height: 1, backgroundColor: '#1E3050' },
  tabsRow: { flexDirection: 'row', marginHorizontal: 20, marginTop: 24, gap: 6 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: '#111F35', borderWidth: 1, borderColor: '#1E3050', alignItems: 'center' },
  tabActive: { backgroundColor: '#4A9EFF', borderColor: '#4A9EFF' },
  tabText: { color: '#8899AA', fontSize: 11, fontWeight: '600' },
  tabTextActive: { color: '#FFFFFF', fontWeight: '700' },
  tabContent: { padding: 20 },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  emptySub: { color: '#8899AA', fontSize: 13, marginTop: 6, textAlign: 'center' },
  emptyBtn: { marginTop: 16, backgroundColor: '#4A9EFF', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12 },
  emptyBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  listingItem: { flexDirection: 'row', backgroundColor: '#111F35', borderWidth: 1, borderColor: '#1E3050', borderRadius: 12, padding: 10, marginBottom: 10, gap: 12 },
  listingPhoto: { width: 72, height: 72, borderRadius: 8 },
  listingBadge: { alignSelf: 'flex-start', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, backgroundColor: '#0F6E56' },
  listingBadgeText: { color: '#FFFFFF', fontSize: 8, fontWeight: '700' },
  listingPrice: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginTop: 4 },
  listingTitle: { color: '#8899AA', fontSize: 12, marginTop: 2 },
  listingAddr: { color: '#4A9EFF', fontSize: 11, marginTop: 4 },
  reviewCard: { backgroundColor: '#111F35', borderWidth: 1, borderColor: '#1E3050', borderRadius: 12, padding: 14, marginBottom: 10 },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  reviewUser: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  reviewDate: { color: '#445566', fontSize: 11 },
  reviewStars: { fontSize: 12, marginBottom: 6 },
  reviewText: { color: '#CCDDEE', fontSize: 13, lineHeight: 18 },
});
