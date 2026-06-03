import {
  StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView,
  SafeAreaView, Image, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useProperties } from '../context/PropertiesContext';
import { PROPERTY_TYPES, AMENITIES_LIST } from '../context/PropertiesContext';

const MIN_NIGHTS_OPTIONS = ['1', '2', '3', '5', '7'];
const MAX_GUESTS_OPTIONS = ['1', '2', '4', '6', '8', '10', '12', '15+'];

export default function SellScreen({ navigation }) {
  const { addProperty } = useProperties();
  const insets = useSafeAreaInsets();
  const [photos, setPhotos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState('Condo');
  const [pricePerNight, setPricePerNight] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [sqm, setSqm] = useState('');
  const [address, setAddress] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [minNights, setMinNights] = useState('1');
  const [maxGuests, setMaxGuests] = useState('4');

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Allow access to your photo library to upload photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhotos(prev => [...prev, ...result.assets.map(a => ({ uri: a.uri }))]);
    }
  };

  const removePhoto = (idx) => {
    setPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  const handlePublish = async () => {
    if (photos.length === 0) return Alert.alert('Add photos', 'Please add at least one photo of your space.');
    if (!title.trim()) return Alert.alert('Missing title', 'Please give your staycation a title.');
    if (!description.trim()) return Alert.alert('Missing description', 'Tell guests what makes your space special.');
    if (!pricePerNight.trim()) return Alert.alert('Missing price', 'Please enter your nightly rate.');
    if (!address.trim()) return Alert.alert('Missing address', 'Please enter the location of your space.');

    let lat = 14.6560, lng = 121.0540;
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        lat = loc.coords.latitude + (Math.random() - 0.5) * 0.002;
        lng = loc.coords.longitude + (Math.random() - 0.5) * 0.002;
      }
    } catch (e) {}

    const price = parseInt(pricePerNight.replace(/[^0-9]/g, ''), 10) || 0;

    const newProperty = {
      title: title.trim(),
      price: `₱${price.toLocaleString()}/night`,
      pricePerNight: price,
      type: 'staycation',
      propertyType,
      latitude: lat,
      longitude: lng,
      bedrooms: parseInt(bedrooms) || 1,
      bathrooms: parseInt(bathrooms) || 1,
      sqm: parseInt(sqm) || 30,
      address: address.trim(),
      description: description.trim(),
      amenities: selectedAmenities,
      minNights: parseInt(minNights) || 1,
      maxGuests: maxGuests === '15+' ? 15 : parseInt(maxGuests) || 4,
      photos,
    };

    addProperty(newProperty);
    Alert.alert('Published! 🎉', 'Your space is now live on the map.', [
      { text: 'View on map', onPress: () => navigation.replace('Map') },
      { text: 'Back to home', onPress: () => navigation.replace('Home') },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Host your space</Text>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Photos */}
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitleLarge}>Photos</Text>
          </View>
          <Text style={styles.sectionSub}>Show guests what your space looks like</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosRow}>
            {photos.map((p, i) => (
              <View key={i} style={styles.photoWrap}>
                <Image source={p} style={styles.photo} />
                <TouchableOpacity style={styles.photoRemove} onPress={() => removePhoto(i)}>
                  <Text style={styles.photoRemoveText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.photoAdd} onPress={pickImage}>
              <Text style={styles.photoAddPlus}>+</Text>
              <Text style={styles.photoAddText}>Add photo</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Property type */}
          <Text style={styles.sectionTitle}>Type of space</Text>
          <View style={styles.chipsRow}>
            {PROPERTY_TYPES.map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.chip, propertyType === t && styles.chipActive]}
                onPress={() => setPropertyType(t)}
              >
                <Text style={[styles.chipText, propertyType === t && styles.chipTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Title */}
          <Text style={styles.sectionTitle}>Title</Text>
          <Text style={styles.sectionSub}>What makes your space special?</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Cozy Tagaytay Cabin with Taal View"
            placeholderTextColor="#445566"
            maxLength={60}
          />

          {/* Nightly rate */}
          <Text style={styles.sectionTitle}>Nightly rate</Text>
          <View style={styles.priceWrap}>
            <Text style={styles.priceSymbol}>₱</Text>
            <TextInput
              style={styles.priceInput}
              value={pricePerNight}
              onChangeText={v => setPricePerNight(v.replace(/[^0-9]/g, ''))}
              placeholder="2500"
              placeholderTextColor="#445566"
              keyboardType="number-pad"
            />
            <Text style={styles.priceSuffix}>/night</Text>
          </View>

          {/* Guests + nights */}
          <View style={styles.gridRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Max guests</Text>
              <View style={styles.chipsRowSmall}>
                {MAX_GUESTS_OPTIONS.map(g => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.chipSmall, maxGuests === g && styles.chipActive]}
                    onPress={() => setMaxGuests(g)}
                  >
                    <Text style={[styles.chipSmallText, maxGuests === g && styles.chipTextActive]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Minimum nights</Text>
          <View style={styles.chipsRow}>
            {MIN_NIGHTS_OPTIONS.map(n => (
              <TouchableOpacity
                key={n}
                style={[styles.chip, minNights === n && styles.chipActive]}
                onPress={() => setMinNights(n)}
              >
                <Text style={[styles.chipText, minNights === n && styles.chipTextActive]}>{n} {n === '1' ? 'night' : 'nights'}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Room details */}
          <View style={styles.gridRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Bedrooms</Text>
              <TextInput style={styles.input} value={bedrooms} onChangeText={setBedrooms} placeholder="2" placeholderTextColor="#445566" keyboardType="number-pad" maxLength={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Bathrooms</Text>
              <TextInput style={styles.input} value={bathrooms} onChangeText={setBathrooms} placeholder="1" placeholderTextColor="#445566" keyboardType="number-pad" maxLength={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Sqm</Text>
              <TextInput style={styles.input} value={sqm} onChangeText={setSqm} placeholder="55" placeholderTextColor="#445566" keyboardType="number-pad" maxLength={4} />
            </View>
          </View>

          {/* Address */}
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.sectionSub}>City or area (e.g. Tagaytay City, Cavite)</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="e.g. San Juan, La Union"
            placeholderTextColor="#445566"
          />

          {/* Amenities */}
          <Text style={styles.sectionTitle}>Amenities</Text>
          <Text style={styles.sectionSub}>Select everything your space offers</Text>
          <View style={styles.chipsRow}>
            {AMENITIES_LIST.map(a => (
              <TouchableOpacity
                key={a}
                style={[styles.chip, selectedAmenities.includes(a) && styles.chipActive]}
                onPress={() => toggleAmenity(a)}
              >
                <Text style={[styles.chipText, selectedAmenities.includes(a) && styles.chipTextActive]}>{a}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.sectionSub}>Tell guests what makes this staycation unforgettable</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the vibe, what's nearby, who it's perfect for..."
            placeholderTextColor="#445566"
            multiline
            numberOfLines={5}
            maxLength={400}
          />
          <Text style={styles.charCount}>{description.length} / 400</Text>

          <TouchableOpacity style={styles.publishBtn} onPress={handlePublish}>
            <Text style={styles.publishText}>Publish listing 🏖️</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.boostBtn} onPress={() => navigation.navigate('Membership')}>
            <Text style={styles.boostBtnText}>🚀 Boost this listing</Text>
            <Text style={styles.boostBtnSub}>Get more visibility with OMW Coins</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 20, borderBottomWidth: 1, borderBottomColor: '#1E3050' },
  backText: { color: '#4A9EFF', fontSize: 15, width: 50 },
  headerTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  scrollContent: { padding: 20 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 22, marginBottom: 6 },
  sectionTitleLarge: { fontSize: 36, fontWeight: '800', color: '#FFFFFF', letterSpacing: -1 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', marginTop: 22, marginBottom: 6 },
  sectionSub: { fontSize: 12, color: '#8899AA', marginBottom: 10 },
  photosRow: { flexDirection: 'row' },
  photoWrap: { width: 100, height: 100, marginRight: 10, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  photo: { width: '100%', height: '100%' },
  photoRemove: { position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center' },
  photoRemoveText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  photoAdd: { width: 100, height: 100, borderRadius: 12, borderWidth: 1, borderColor: '#1E3050', borderStyle: 'dashed', backgroundColor: '#111F35', alignItems: 'center', justifyContent: 'center' },
  photoAddPlus: { fontSize: 28, color: '#4A9EFF', marginBottom: 2 },
  photoAddText: { fontSize: 11, color: '#8899AA' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chipsRowSmall: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1, borderColor: '#1E3050', backgroundColor: '#111F35' },
  chipSmall: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 16, borderWidth: 1, borderColor: '#1E3050', backgroundColor: '#111F35' },
  chipActive: { backgroundColor: '#4A9EFF', borderColor: '#4A9EFF' },
  chipText: { color: '#8899AA', fontSize: 13, fontWeight: '500' },
  chipSmallText: { color: '#8899AA', fontSize: 12, fontWeight: '500' },
  chipTextActive: { color: '#FFFFFF', fontWeight: '700' },
  input: { backgroundColor: '#111F35', borderWidth: 1, borderColor: '#1E3050', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: '#FFFFFF', fontSize: 14 },
  textArea: { height: 100, textAlignVertical: 'top' },
  charCount: { fontSize: 11, color: '#445566', textAlign: 'right', marginTop: 4 },
  priceWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111F35', borderWidth: 1, borderColor: '#1E3050', borderRadius: 12, paddingHorizontal: 14 },
  priceSymbol: { color: '#4A9EFF', fontSize: 18, fontWeight: '800', marginRight: 6 },
  priceInput: { flex: 1, paddingVertical: 12, color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  priceSuffix: { color: '#8899AA', fontSize: 14 },
  gridRow: { flexDirection: 'row', gap: 10 },
  publishBtn: { backgroundColor: '#4A9EFF', paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 30 },
  publishText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  boostBtn: { backgroundColor: '#111F35', borderWidth: 1, borderColor: '#0F6E56', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 20, alignItems: 'center', marginTop: 12 },
  boostBtnText: { color: '#1D9E75', fontSize: 15, fontWeight: '800' },
  boostBtnSub: { color: '#445566', fontSize: 11, marginTop: 3 },
});
