import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions,
  Modal, SafeAreaView, ActivityIndicator, Image, PanResponder, TextInput, Animated
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, UrlTile, Polyline } from 'react-native-maps';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { useProperties } from '../context/PropertiesContext';

const { width } = Dimensions.get('window');
const MAP_TILE_URL = 'https://cartodb-basemaps-a.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png';

const SAMPLE_REVIEWS = [
  { id: 1, user: 'Mark V.', rating: 5, text: 'Very legit seller! Property exactly as described. Highly recommend!', date: '2 days ago' },
  { id: 2, user: 'Carla M.', rating: 4, text: 'Good experience overall. Quick to respond sa messages.', date: '1 week ago' },
  { id: 3, user: 'Paolo R.', rating: 5, text: 'Smooth transaction. Walang hidden fees. Legit talaga!', date: '2 weeks ago' },
];

const PROPERTY_TYPES = ['All', 'House', 'Condo', 'Apartment', 'Townhouse', 'Studio'];
const PRICE_RANGES = [
  { label: 'Any', min: 0, max: Infinity },
  { label: 'Under ₱2M', min: 0, max: 2000000 },
  { label: '₱2M–5M', min: 2000000, max: 5000000 },
  { label: '₱5M–10M', min: 5000000, max: 10000000 },
  { label: '₱10M+', min: 10000000, max: Infinity },
];
const RENT_RANGES = [
  { label: 'Any', min: 0, max: Infinity },
  { label: 'Under ₱10K', min: 0, max: 10000 },
  { label: '₱10K–20K', min: 10000, max: 20000 },
  { label: '₱20K+', min: 20000, max: Infinity },
];
const DISTANCE_FILTERS = [
  { label: 'Any distance', value: Infinity },
  { label: 'Within 500m', value: 500 },
  { label: 'Within 1km', value: 1000 },
  { label: 'Within 3km', value: 3000 },
];
const SQM_FILTERS = [
  { label: 'Any size', min: 0 },
  { label: '30+ sqm', min: 30 },
  { label: '60+ sqm', min: 60 },
  { label: '100+ sqm', min: 100 },
];

const SLIDER_WIDTH = 220;

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getBearing(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => deg * Math.PI / 180;
  const toDeg = (rad) => rad * 180 / Math.PI;
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) - Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

function parsePrice(priceStr) {
  const num = priceStr.replace(/[^0-9]/g, '');
  return parseInt(num, 10) || 0;
}

function formatDistance(m) {
  return m < 1000 ? `${Math.round(m)}m away` : `${(m / 1000).toFixed(1)}km away`;
}

function formatDuration(s) {
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

function StarRating({ rating }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Text key={s} style={{ fontSize: 12, color: s <= Math.round(rating) ? '#EF9F27' : '#2A3F5F' }}>★</Text>
      ))}
    </View>
  );
}

function getPinSize(distance) {
  if (distance === undefined || distance === null) return 44;
  if (distance < 100) return 72;
  if (distance < 300) return 62;
  if (distance < 600) return 52;
  if (distance < 1200) return 44;
  return 36;
}

function PropertyPin({ property, distance, isSelected, isNav }) {
  const size = getPinSize(distance);
  const borderColor = property.type === 'staycation' ? '#0F6E56' : property.type === 'rent' ? '#0F6E56' : '#185FA5';
  return (
    <View style={styles.pinContainer}>
      <View style={[
        styles.pinCircle,
        { width: size, height: size, borderRadius: size / 2, borderColor },
        isSelected && styles.pinSelected,
        isNav && styles.pinNav,
      ]}>
        {property.photos && property.photos[0] ? (
          <Image source={property.photos[0]} style={{ width: size - 6, height: size - 6, borderRadius: (size - 6) / 2 }} />
        ) : (
          <Text style={{ fontSize: size * 0.45 }}>🏠</Text>
        )}
      </View>
      <View style={[styles.pinTail, { borderTopColor: borderColor }]} />
    </View>
  );
}

function UserMarker({ spoofed, focused }) {
  return (
    <View style={styles.userMarkerWrap}>
      {focused && <View style={styles.userMarkerFocused} />}
      <View style={styles.userMarkerOuter} />
      <View style={styles.userMarkerPulse} />
      <View style={[styles.userMarkerDot, spoofed && { backgroundColor: '#CC0000' }]} />
    </View>
  );
}

export default function MapScreen({ route, navigation }) {
  const { properties, adminMode, spoofedLocation, setSpoofedLocation } = useProperties();
  const insets = useSafeAreaInsets();
  const [realLocation, setRealLocation] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [detailProperty, setDetailProperty] = useState(null);
  const [activePhoto, setActivePhoto] = useState(0);
  const [navigating, setNavigating] = useState(false);
  const [navTarget, setNavTarget] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [teleportMode, setTeleportMode] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterListing, setFilterListing] = useState('all');
  const [filterPrice, setFilterPrice] = useState(PRICE_RANGES[0]);
  const [filterRent, setFilterRent] = useState(RENT_RANGES[0]);
  const [filterDistance, setFilterDistance] = useState(DISTANCE_FILTERS[0]);
  const [filterSqm, setFilterSqm] = useState(SQM_FILTERS[0]);
  const [sortBy, setSortBy] = useState('nearest');
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0); // 0.2 (slow) to 3.0 (fast)
  const [sliderX, setSliderX] = useState(SLIDER_WIDTH * 0.27); // visual position
  const [gpsFocused, setGpsFocused] = useState(false);
  const mapRef = useRef(null);
  const scrollRef = useRef(null);
  const speedRef = useRef(1.0);
  const lastRoutePosRef = useRef(null);
  const isReroutingRef = useRef(false);
  const realLocationRef = useRef(null); // always current real GPS, avoids stale closure in joystick // tracks position of last OSRM fetch

  useEffect(() => {
    speedRef.current = speedMultiplier;
  }, [speedMultiplier]);

  // Persistent location: spoofed survives toggling adminMode off
  const effectiveLocation = spoofedLocation
    ? { coords: { latitude: spoofedLocation.latitude, longitude: spoofedLocation.longitude } }
    : realLocation;

  const locationLat = effectiveLocation?.coords?.latitude;
  const locationLng = effectiveLocation?.coords?.longitude;

  const activeFilterCount = (
    (filterType !== 'All' ? 1 : 0) +
    (filterListing !== 'all' ? 1 : 0) +
    (filterPrice.label !== 'Any' ? 1 : 0) +
    (filterRent.label !== 'Any' ? 1 : 0) +
    (filterDistance.value !== Infinity ? 1 : 0) +
    (filterSqm.min > 0 ? 1 : 0) +
    (searchText.trim() ? 1 : 0)
  );

  const sortedProperties = useMemo(() => {
    let list = properties.map(p => ({
      ...p,
      distance: locationLat && locationLng ? getDistance(locationLat, locationLng, p.latitude, p.longitude) : undefined,
    }));

    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        (p.propertyType && p.propertyType.toLowerCase().includes(q))
      );
    }
    if (filterType !== 'All') list = list.filter(p => p.propertyType === filterType);
    if (filterListing !== 'all') list = list.filter(p => p.type === filterListing);
    list = list.filter(p => {
      if (p.type === 'sale') {
        const price = parsePrice(p.price);
        return price >= filterPrice.min && price <= filterPrice.max;
      }
      if (p.type === 'rent') {
        const price = parsePrice(p.price);
        return price >= filterRent.min && price <= filterRent.max;
      }
      return true;
    });
    if (filterDistance.value !== Infinity) list = list.filter(p => p.distance !== undefined && p.distance <= filterDistance.value);
    if (filterSqm.min > 0) list = list.filter(p => p.sqm >= filterSqm.min);

    if (sortBy === 'nearest') list.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    else if (sortBy === 'priceLow') list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    else if (sortBy === 'priceHigh') list.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    else if (sortBy === 'sqm') list.sort((a, b) => b.sqm - a.sqm);

    return list;
  }, [locationLat, locationLng, properties, searchText, filterType, filterListing, filterPrice, filterRent, filterDistance, filterSqm, sortBy]);

  const resetFilters = () => {
    setSearchText(''); setFilterType('All'); setFilterListing('all');
    setFilterPrice(PRICE_RANGES[0]); setFilterRent(RENT_RANGES[0]);
    setFilterDistance(DISTANCE_FILTERS[0]); setFilterSqm(SQM_FILTERS[0]); setSortBy('nearest');
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setRealLocation({ coords: { latitude: 14.6560, longitude: 121.0540 } });
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setRealLocation(loc);
      realLocationRef.current = loc;
      await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
        (newLoc) => { setRealLocation(newLoc); realLocationRef.current = newLoc; }
      );
    })();
  }, []);

  useEffect(() => {
    if (route?.params?.startNavigation && mapReady) {
      const prop = route.params.startNavigation;
      navigation.setParams({ startNavigation: null });
      setTimeout(() => startNavigation(prop), 500);
    }
  }, [route?.params?.startNavigation, mapReady]);

  // Re-fetch road route every 80m of movement during navigation
  useEffect(() => {
    if (!navigating || !locationLat || !locationLng || !navTarget) return;

    // Update live distance always
    const dist = getDistance(locationLat, locationLng, navTarget.latitude, navTarget.longitude);
    setRouteInfo({ distance: dist, duration: dist / 1.4 });

    // Re-fetch full OSRM route if moved 80m+ from last fetch point and not already fetching
    const last = lastRoutePosRef.current;
    const movedFar = !last || getDistance(locationLat, locationLng, last.lat, last.lng) > 80;
    if (movedFar && !isReroutingRef.current) {
      isReroutingRef.current = true;
      lastRoutePosRef.current = { lat: locationLat, lng: locationLng };
      fetchRoute(navTarget, locationLat, locationLng).finally(() => {
        isReroutingRef.current = false;
      });
    }
  }, [locationLat, locationLng, navigating]);

  // Slider PanResponder for joystick speed
  const sliderPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const x = Math.max(0, Math.min(SLIDER_WIDTH, e.nativeEvent.locationX));
        setSliderX(x);
        const speed = 0.2 + (x / SLIDER_WIDTH) * 2.8;
        setSpeedMultiplier(speed);
      },
      onPanResponderMove: (e) => {
        const x = Math.max(0, Math.min(SLIDER_WIDTH, e.nativeEvent.locationX));
        setSliderX(x);
        const speed = 0.2 + (x / SLIDER_WIDTH) * 2.8;
        setSpeedMultiplier(speed);
      },
    })
  ).current;

  const joystickPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        const radius = 50;
        const dist = Math.sqrt(g.dx ** 2 + g.dy ** 2);
        const clampedDist = Math.min(dist, radius);
        const angle = Math.atan2(g.dy, g.dx);
        const x = Math.cos(angle) * clampedDist;
        const y = Math.sin(angle) * clampedDist;
        setJoystickPos({ x, y });

        if (dist > 5) {
          setSpoofedLocation((prev) => {
            const baseLat = prev?.latitude ?? realLocationRef.current?.coords?.latitude ?? 14.6560;
            const baseLng = prev?.longitude ?? realLocationRef.current?.coords?.longitude ?? 121.0540;
            const speed = 0.000004 * speedRef.current;
            const intensity = (clampedDist / radius) ** 2;
            const dLat = -y / radius * speed * 6 * intensity;
            const dLng = x / radius * speed * 6 * intensity;
            return { latitude: baseLat + dLat, longitude: baseLng + dLng };
          });
        }
      },
      onPanResponderRelease: () => setJoystickPos({ x: 0, y: 0 }),
    })
  ).current;

  const handleMapPress = (e) => {
    if (teleportMode) {
      const { coordinate } = e.nativeEvent;
      setSpoofedLocation({ latitude: coordinate.latitude, longitude: coordinate.longitude });
      setTeleportMode(false);
      return;
    }
    if (!navigating) setSelectedProperty(null);
    if (gpsFocused) setGpsFocused(false);
  };

  const resetSpoof = () => {
    setSpoofedLocation(null);
    if (realLocation && mapRef.current) {
      mapRef.current.animateCamera({
        center: { latitude: realLocation.coords.latitude, longitude: realLocation.coords.longitude },
        pitch: 0, zoom: 15, heading: 0,
      }, { duration: 800 });
    }
  };

  const fetchRoute = async (property, fromLat, fromLng) => {
    const lat = fromLat || locationLat;
    const lng = fromLng || locationLng;
    if (!lat || !lng) return null;
    setLoadingRoute(true);
    lastRoutePosRef.current = { lat, lng };

    const straight = [
      { latitude: lat, longitude: lng },
      { latitude: property.latitude, longitude: property.longitude },
    ];
    const directDist = getDistance(lat, lng, property.latitude, property.longitude);
    setRouteCoords(straight);
    setRouteInfo({ distance: directDist, duration: directDist / 1.4 });

    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${lng},${lat};${property.longitude},${property.latitude}?overview=full&geometries=geojson`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const r = data.routes[0];
        const coords = r.geometry.coordinates.map((c) => ({ latitude: c[1], longitude: c[0] }));
        setRouteCoords(coords);
        setRouteInfo({ distance: r.distance, duration: r.duration });
        setLoadingRoute(false);
        return coords;
      }
    } catch (e) {
      console.log('[Route] OSRM failed, using straight line:', e.message);
    }
    setLoadingRoute(false);
    return straight;
  };

  const startNavigation = async (property) => {
    setDetailProperty(null);
    setSelectedProperty(null);
    setNavTarget(property);
    setNavigating(true);

    const coords = await fetchRoute(property);

    // Always animate camera even if route fetch had issues
    if (mapRef.current && locationLat && locationLng) {
      const heading = getBearing(locationLat, locationLng, property.latitude, property.longitude);
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.animateCamera({
            center: { latitude: locationLat, longitude: locationLng },
            pitch: 60, heading: heading, zoom: 17, altitude: 500,
          }, { duration: 1500 });
        }
      }, 600);
    }
  };

  const stopNavigation = () => {
    setNavigating(false); setNavTarget(null);
    lastRoutePosRef.current = null;
    isReroutingRef.current = false;
    setRouteCoords([]); setRouteInfo(null);
    if (mapRef.current && locationLat && locationLng) {
      mapRef.current.animateCamera({
        center: { latitude: locationLat, longitude: locationLng },
        pitch: 0, heading: 0, zoom: 15,
      }, { duration: 800 });
    }
  };

  // Pin tap now goes DIRECTLY to detail modal (no carousel intermediary)
  const handlePinPress = (property) => {
    if (navigating || teleportMode) return;
    setActivePhoto(0);
    setDetailProperty(property);
  };

  const openChat = (property) => {
    setDetailProperty(null);
    navigation.navigate('Chat', { property });
  };

  // GPS focus mode: zoom IN with pulsing radiance
  const focusOnGps = () => {
    if (!effectiveLocation || !mapRef.current) return;
    setGpsFocused(true);
    mapRef.current.animateCamera({
      center: { latitude: effectiveLocation.coords.latitude, longitude: effectiveLocation.coords.longitude },
      pitch: 0, zoom: 18, heading: 0,
    }, { duration: 1000 });
    // Auto-clear focus after 4 seconds
    setTimeout(() => setGpsFocused(false), 4000);
  };

  const getCardSize = (distance, isMain) => {
    if (isMain) return { width: width * 0.78, height: 210, opacity: 1 };
    if (distance === undefined) return { width: width * 0.45, height: 150, opacity: 0.85 };
    if (distance < 150) return { width: width * 0.62, height: 185, opacity: 0.95 };
    if (distance < 350) return { width: width * 0.50, height: 160, opacity: 0.85 };
    if (distance < 700) return { width: width * 0.42, height: 140, opacity: 0.75 };
    return { width: width * 0.35, height: 118, opacity: 0.6 };
  };

  const carouselProperties = sortedProperties;

  const speedLabel = speedMultiplier < 0.5 ? 'Slow' : speedMultiplier < 1.5 ? 'Normal' : speedMultiplier < 2.5 ? 'Fast' : 'Turbo';

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{ latitude: 14.6560, longitude: 121.0540, latitudeDelta: 0.018, longitudeDelta: 0.018 }}
        showsUserLocation={false}
        showsMyLocationButton={false}
        pitchEnabled={true}
        rotateEnabled={true}
        onMapReady={() => setMapReady(true)}
        onPress={handleMapPress}
      >
        <UrlTile urlTemplate={MAP_TILE_URL} maximumZ={19} flipY={false} tileSize={256} opacity={0.99} />

        {sortedProperties.map((p) => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
            onPress={() => handlePinPress(p)}
            anchor={{ x: 0.5, y: 1 }}
            zIndex={1}
            tracksViewChanges={false}
          >
            <PropertyPin property={p} distance={p.distance} isSelected={selectedProperty?.id === p.id} isNav={navTarget?.id === p.id} />
          </Marker>
        ))}

        {effectiveLocation && (
          <Marker
            coordinate={{ latitude: effectiveLocation.coords.latitude, longitude: effectiveLocation.coords.longitude }}
            anchor={{ x: 0.5, y: 0.5 }}
            zIndex={20}
            tracksViewChanges={gpsFocused || !!spoofedLocation}
          >
            <UserMarker spoofed={!!spoofedLocation} focused={gpsFocused} />
          </Marker>
        )}

        {routeCoords.length > 1 && (
          <>
            <Polyline coordinates={routeCoords} strokeColor="#FFFFFF" strokeWidth={12} lineCap="round" lineJoin="round" zIndex={50} />
            <Polyline coordinates={routeCoords} strokeColor="#2563EB" strokeWidth={7} lineCap="round" lineJoin="round" zIndex={51} />
          </>
        )}
      </MapView>

      {!navigating && (
        <View style={[styles.topOverlay, { paddingTop: insets.top + 8 }]}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.topBtn}>
              <Text style={styles.topBtnText}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.searchBar} onPress={() => setSearchOpen(true)}>
              <Text style={styles.searchIcon}>🔍</Text>
              <Text style={styles.searchText} numberOfLines={1}>
                {searchText || 'Search location, type, price…'}
              </Text>
              {activeFilterCount > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow} contentContainerStyle={styles.chipsContent}>
            <TouchableOpacity style={[styles.quickChip, filterListing === 'all' && styles.quickChipActive]} onPress={() => setFilterListing('all')}>
              <Text style={[styles.quickChipText, filterListing === 'all' && styles.quickChipTextActive]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickChip, filterListing === 'sale' && styles.quickChipActive, filterListing === 'sale' && { backgroundColor: '#185FA5' }]} onPress={() => setFilterListing('sale')}>
              <Text style={[styles.quickChipText, filterListing === 'sale' && styles.quickChipTextActive]}>🏡 Buy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickChip, filterListing === 'rent' && styles.quickChipActive, filterListing === 'rent' && { backgroundColor: '#0F6E56' }]} onPress={() => setFilterListing('rent')}>
              <Text style={[styles.quickChipText, filterListing === 'rent' && styles.quickChipTextActive]}>🌴 Staycation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickChip, filterDistance.value === 1000 && styles.quickChipActive]} onPress={() => setFilterDistance(filterDistance.value === 1000 ? DISTANCE_FILTERS[0] : DISTANCE_FILTERS[2])}>
              <Text style={[styles.quickChipText, filterDistance.value === 1000 && styles.quickChipTextActive]}>📍 Near me</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* GPS focus button - now zooms IN */}
      {/* Pin/GPS button — above carousel */}
      {!navigating && (
        <TouchableOpacity style={styles.locationBtn} onPress={focusOnGps}>
          <Text style={{ fontSize: 22 }}>📍</Text>
        </TouchableOpacity>
      )}

      {/* Floating joystick + speed slider side by side */}
      {adminMode && (
        <View style={styles.joystickWrap}>
          <View style={styles.joystickFloat} {...joystickPan.panHandlers}>
            <View style={styles.joystickBase}>
              <View style={[styles.joystickStick, { transform: [{ translateX: joystickPos.x }, { translateY: joystickPos.y }] }]} />
            </View>
          </View>
          <View style={styles.speedSliderWrap}>
            <Text style={styles.speedLabel}>Speed: {speedLabel} ({speedMultiplier.toFixed(1)}x)</Text>
            <View style={styles.sliderTrack} {...sliderPan.panHandlers}>
              <View style={[styles.sliderFill, { width: sliderX }]} />
              <View style={[styles.sliderThumb, { left: sliderX - 10 }]} />
            </View>
          </View>
        </View>
      )}
        <View style={styles.devTopRow}>
          <View style={styles.devLabel}>
            <View style={styles.devLabelDot} />
            <Text style={styles.devLabelText}>DEV MODE</Text>
          </View>
          <TouchableOpacity
            style={[styles.devToolBtn, teleportMode && styles.devToolBtnActive]}
            onPress={() => setTeleportMode((v) => !v)}
          >
            <Text style={styles.devToolText}>{teleportMode ? '✓ Tap map' : '📍 Teleport'}</Text>
          </TouchableOpacity>
          {spoofedLocation && (
            <TouchableOpacity style={[styles.devToolBtn, styles.devToolBtnReset]} onPress={resetSpoof}>
              <Text style={styles.devToolText}>🔄 Reset</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {navigating && navTarget && (
        <View style={styles.navBar}>
          <View style={styles.navTopRow}>
            <TouchableOpacity style={styles.navBack} onPress={stopNavigation}>
              <Text style={styles.navBackText}>←</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.navTitle}>Navigating to</Text>
              <Text style={styles.navProp} numberOfLines={1}>{navTarget.title}</Text>
            </View>
          </View>
          {loadingRoute ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color="#4A9EFF" />
              <Text style={styles.loadingText}>Calculating route...</Text>
            </View>
          ) : routeInfo ? (
            <View style={styles.navStats}>
              <View>
                <Text style={styles.navDist}>{(routeInfo.distance / 1000).toFixed(1)} km</Text>
                <Text style={styles.navDur}>{formatDuration(routeInfo.duration)}</Text>
              </View>
              <Text style={styles.navAddr} numberOfLines={1}>{navTarget.address}</Text>
            </View>
          ) : null}
          {routeInfo && routeInfo.distance <= 50 ? (
            <TouchableOpacity style={styles.arrivedBtn} onPress={() => {
              stopNavigation();
              setTimeout(() => alert("🎉 You've arrived at " + navTarget.title + "! Enjoy your staycation!"), 300);
            }}>
              <Text style={styles.arrivedBtnText}>📍 I've Arrived!</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.stopBtn} onPress={stopNavigation}>
              <Text style={styles.stopBtnText}>✕ Stop navigation</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {!navigating && carouselProperties.length > 0 && (
        <View style={[styles.carouselWrap, adminMode && { bottom: 160 }]}>
          <Text style={styles.carouselLabel}>{sortedProperties.length} found · Tap a pin or swipe</Text>
          <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel} decelerationRate="fast">
            {carouselProperties.map((p) => {
              const size = getCardSize(p.distance, false);
              return (
                <TouchableOpacity key={p.id} onPress={() => setDetailProperty(p)} style={[styles.card, { width: size.width, height: size.height, opacity: size.opacity, borderColor: '#1E3050', borderWidth: 1 }]}>
                  <View style={styles.cardPhotoWrap}>
                    {p.photos && p.photos[0] ? (
                      <Image source={p.photos[0]} style={styles.cardPhotoImg} />
                    ) : (
                      <View style={[styles.cardPhotoImg, { backgroundColor: '#1A3A6B', alignItems: 'center', justifyContent: 'center' }]}>
                        <Text style={{ fontSize: 22 }}>🏠</Text>
                      </View>
                    )}
                    <View style={[styles.cardBadge, { backgroundColor: p.type === 'rent' ? '#0F6E56' : '#185FA5' }]}>
                      <Text style={styles.cardBadgeText}>{p.type === 'staycation' ? 'STAYCATION' : p.type === 'sale' ? 'FOR SALE' : 'STAYCATION'}</Text>
                    </View>
                  </View>
                  <View style={styles.cardBody}>
                    <Text style={[styles.cardPrice, { fontSize: 12 }]}>{p.price}</Text>
                    <Text style={[styles.cardTitle, { fontSize: 9 }]} numberOfLines={1}>{p.title}</Text>
                    {p.distance !== undefined && (
                      <Text style={[styles.cardDist, { fontSize: 9 }]}>📍 {formatDistance(p.distance)}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      <Modal visible={searchOpen} animationType="slide" onRequestClose={() => setSearchOpen(false)}>
        <SafeAreaView style={styles.searchModal}>
          <View style={styles.searchModalHeader}>
            <TouchableOpacity onPress={() => setSearchOpen(false)}>
              <Text style={styles.searchModalClose}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.searchModalTitle}>Search &amp; filters</Text>
            <TouchableOpacity onPress={resetFilters}>
              <Text style={styles.searchModalReset}>Reset</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.searchModalContent}>
            <Text style={styles.filterLabel}>Search</Text>
            <View style={styles.searchInputWrap}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput style={styles.searchInput} value={searchText} onChangeText={setSearchText} placeholder="e.g. Katipunan, condo, Maginhawa" placeholderTextColor="#445566" />
            </View>

            <Text style={styles.filterLabel}>Sort by</Text>
            <View style={styles.chipGrid}>
              {[{ k: 'nearest', l: '📍 Nearest first' }, { k: 'priceLow', l: '💰 Price low → high' }, { k: 'priceHigh', l: '💎 Price high → low' }, { k: 'sqm', l: '📏 Biggest sqm' }].map(opt => (
                <TouchableOpacity key={opt.k} style={[styles.filterChip, sortBy === opt.k && styles.filterChipActive]} onPress={() => setSortBy(opt.k)}>
                  <Text style={[styles.filterChipText, sortBy === opt.k && styles.filterChipTextActive]}>{opt.l}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterLabel}>Listing type</Text>
            <View style={styles.chipGrid}>
              {[{ k: 'all', l: 'All' }, { k: 'staycation', l: '🌴 Staycation' }, { k: 'sale', l: '🏡 For Sale' }].map(opt => (
                <TouchableOpacity key={opt.k} style={[styles.filterChip, filterListing === opt.k && styles.filterChipActive]} onPress={() => setFilterListing(opt.k)}>
                  <Text style={[styles.filterChipText, filterListing === opt.k && styles.filterChipTextActive]}>{opt.l}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterLabel}>Property type</Text>
            <View style={styles.chipGrid}>
              {PROPERTY_TYPES.map(t => (
                <TouchableOpacity key={t} style={[styles.filterChip, filterType === t && styles.filterChipActive]} onPress={() => setFilterType(t)}>
                  <Text style={[styles.filterChipText, filterType === t && styles.filterChipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterLabel}>Distance from me</Text>
            <View style={styles.chipGrid}>
              {DISTANCE_FILTERS.map(d => (
                <TouchableOpacity key={d.label} style={[styles.filterChip, filterDistance.value === d.value && styles.filterChipActive]} onPress={() => setFilterDistance(d)}>
                  <Text style={[styles.filterChipText, filterDistance.value === d.value && styles.filterChipTextActive]}>{d.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterLabel}>Nightly rate</Text>
            <View style={styles.chipGrid}>
              {PRICE_RANGES.map(p => (
                <TouchableOpacity key={p.label} style={[styles.filterChip, filterPrice.label === p.label && styles.filterChipActive]} onPress={() => setFilterPrice(p)}>
                  <Text style={[styles.filterChipText, filterPrice.label === p.label && styles.filterChipTextActive]}>{p.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterLabel}>Monthly rate</Text>
            <View style={styles.chipGrid}>
              {RENT_RANGES.map(p => (
                <TouchableOpacity key={p.label} style={[styles.filterChip, filterRent.label === p.label && styles.filterChipActive]} onPress={() => setFilterRent(p)}>
                  <Text style={[styles.filterChipText, filterRent.label === p.label && styles.filterChipTextActive]}>{p.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterLabel}>Floor area</Text>
            <View style={styles.chipGrid}>
              {SQM_FILTERS.map(s => (
                <TouchableOpacity key={s.label} style={[styles.filterChip, filterSqm.min === s.min && styles.filterChipActive]} onPress={() => setFilterSqm(s)}>
                  <Text style={[styles.filterChipText, filterSqm.min === s.min && styles.filterChipTextActive]}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>

          <View style={styles.searchModalFooter}>
            <TouchableOpacity style={styles.applyBtn} onPress={() => setSearchOpen(false)}>
              <Text style={styles.applyBtnText}>Show {sortedProperties.length} {sortedProperties.length === 1 ? 'result' : 'results'}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      <Modal visible={!!detailProperty} animationType="slide" onRequestClose={() => setDetailProperty(null)}>
        {detailProperty && (
          <SafeAreaView style={styles.modal}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.photoCarousel}>
                <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={(e) => setActivePhoto(Math.round(e.nativeEvent.contentOffset.x / width))} scrollEventThrottle={16}>
                  {(detailProperty.photos || []).map((photo, i) => (
                    <View key={i} style={styles.photo}>
                      <Image source={photo} style={styles.photoImg} resizeMode="cover" />
                    </View>
                  ))}
                </ScrollView>
                <View style={styles.photoDots}>
                  {(detailProperty.photos || []).map((_, i) => (
                    <View key={i} style={[styles.dot, i === activePhoto && styles.dotActive]} />
                  ))}
                </View>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setDetailProperty(null)}>
                  <Text style={styles.closeBtnText}>← Back</Text>
                </TouchableOpacity>
                <View style={[styles.detailBadge, { backgroundColor: '#0F6E56' }]}>
                  <Text style={styles.detailBadgeText}>🌴 STAYCATION</Text>
                </View>
              </View>

              <View style={styles.detailBody}>
                <Text style={styles.detailPrice}>{detailProperty.price}</Text>
                <Text style={styles.detailTitle}>{detailProperty.title}</Text>
                <Text style={styles.detailAddr}>📍 {detailProperty.address}</Text>

                {detailProperty.propertyType && (
                  <View style={styles.propTypeBadge}>
                    <Text style={styles.propTypeText}>{detailProperty.propertyType}</Text>
                  </View>
                )}
                {detailProperty.rentDuration && (
                  <View style={[styles.propTypeBadge, { backgroundColor: '#0F6E56', borderColor: '#0F6E56' }]}>
                    <Text style={[styles.propTypeText, { color: '#FFFFFF' }]}>📅 {detailProperty.rentDuration}</Text>
                  </View>
                )}

                <View style={styles.detailTags}>
                  <View style={styles.detailTag}><Text style={styles.detailTagText}>{detailProperty.bedrooms} Bedrooms</Text></View>
                  <View style={styles.detailTag}><Text style={styles.detailTagText}>{detailProperty.bathrooms} Bathrooms</Text></View>
                  <View style={styles.detailTag}><Text style={styles.detailTagText}>{detailProperty.sqm} sqm</Text></View>
                </View>

                <Text style={styles.sectionTitle}>About this staycation</Text>
                <Text style={styles.detailDesc}>{detailProperty.description}</Text>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Host information</Text>
                <View style={styles.sellerRow}>
                  <View style={styles.sellerAvatar}>
                    <Text style={styles.sellerAvatarText}>{detailProperty.seller.name.split(' ').map(n => n[0]).join('')}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sellerName}>{detailProperty.seller.name}</Text>
                    <Text style={styles.sellerMember}>{detailProperty.seller.member}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <StarRating rating={detailProperty.seller.rating} />
                      <Text style={styles.sellerRating}>{detailProperty.seller.rating} · {detailProperty.seller.reviews} reviews</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.reviewHeader}>
                  <Text style={styles.sectionTitle}>Reviews</Text>
                  <View style={styles.reviewSummary}>
                    <Text style={styles.reviewBig}>{detailProperty.seller.rating}</Text>
                    <View>
                      <StarRating rating={detailProperty.seller.rating} />
                      <Text style={styles.reviewCount}>{detailProperty.seller.reviews} reviews</Text>
                    </View>
                  </View>
                </View>

                {SAMPLE_REVIEWS.map((r) => (
                  <View key={r.id} style={styles.reviewItem}>
                    <View style={styles.reviewTop}>
                      <Text style={styles.reviewUser}>{r.user}</Text>
                      <Text style={styles.reviewDate}>{r.date}</Text>
                    </View>
                    <StarRating rating={r.rating} />
                    <Text style={styles.reviewText}>{r.text}</Text>
                  </View>
                ))}

                <View style={{ height: 120 }} />
              </View>
            </ScrollView>

            <View style={styles.ctaWrap}>
              <TouchableOpacity style={styles.messageBtn} onPress={() => openChat(detailProperty)}>
                <Text style={styles.messageBtnEmoji}>💬</Text>
                <View>
                  <Text style={styles.messageBtnText}>Message host</Text>
                  <Text style={styles.messageBtnSub}>Chat to unlock OMW! navigation</Text>
                </View>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  map: { flex: 1 },
  topOverlay: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 14 },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  topBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(10,22,40,0.95)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1E3050' },
  topBtnText: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(10,22,40,0.95)', borderRadius: 23, paddingHorizontal: 16, paddingVertical: 13, borderWidth: 1, borderColor: '#1E3050', gap: 8 },
  searchIcon: { fontSize: 14 },
  searchText: { flex: 1, color: '#8899AA', fontSize: 13 },
  filterBadge: { backgroundColor: '#4A9EFF', borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2, minWidth: 20, alignItems: 'center' },
  filterBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  chipsRow: { marginTop: 10 },
  chipsContent: { flexDirection: 'row', gap: 8, paddingHorizontal: 2, paddingBottom: 4 },
  quickChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 18, backgroundColor: 'rgba(10,22,40,0.95)', borderWidth: 1, borderColor: '#1E3050' },
  quickChipActive: { borderColor: '#4A9EFF' },
  quickChipText: { color: '#8899AA', fontSize: 13, fontWeight: '600' },
  quickChipTextActive: { color: '#FFFFFF' },
  locationBtn: { position: 'absolute', bottom: 210, right: 16, backgroundColor: 'rgba(10,22,40,0.92)', width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1E3050' },
  pinContainer: { alignItems: 'center' },
  pinCircle: { alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#185FA5', backgroundColor: '#FFFFFF', overflow: 'hidden' },
  pinTail: { width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 9, borderLeftColor: 'transparent', borderRightColor: 'transparent', marginTop: -2 },
  pinSelected: { borderColor: '#4A9EFF', borderWidth: 4 },
  pinNav: { borderColor: '#FF4444', borderWidth: 4 },
  userMarkerWrap: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
  userMarkerFocused: { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(74,158,255,0.4)', borderWidth: 3, borderColor: 'rgba(74,158,255,0.8)' },
  userMarkerOuter: { position: 'absolute', width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(74,158,255,0.15)' },
  userMarkerPulse: { position: 'absolute', width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(74,158,255,0.35)' },
  userMarkerDot: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#4A9EFF', borderWidth: 3, borderColor: '#FFFFFF' },
  navBar: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'rgba(10,22,40,0.96)', padding: 16, paddingTop: 54, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, zIndex: 100 },
  navTopRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  navBack: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#111F35', alignItems: 'center', justifyContent: 'center' },
  navBackText: { color: '#FFFFFF', fontSize: 20 },
  navTitle: { color: '#4A9EFF', fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
  navProp: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  navStats: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  navAddr: { color: '#8899AA', fontSize: 12, textAlign: 'right', flex: 1, marginLeft: 10 },
  navDist: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  navDur: { color: '#4A9EFF', fontSize: 13, marginTop: 2 },
  loadingWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  loadingText: { color: '#8899AA', fontSize: 13 },
  stopBtn: { backgroundColor: '#CC0000', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  stopBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  arrivedBtn: { backgroundColor: '#0F6E56', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  arrivedBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
  devTopRow: { position: 'absolute', top: 130, left: 12, right: 12, flexDirection: 'row', alignItems: 'center', gap: 6 },
  devLabel: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(204,0,0,0.95)', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 14 },
  devLabelDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#FFFFFF' },
  devLabelText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  devToolBtn: { backgroundColor: 'rgba(10,22,40,0.95)', borderWidth: 1, borderColor: '#CC0000', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 7 },
  devToolBtnActive: { backgroundColor: '#CC0000' },
  devToolBtnReset: { borderColor: '#8899AA' },
  devToolText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  joystickWrap: { position: 'absolute', bottom: 30, left: 16, flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
  speedSliderWrap: { backgroundColor: 'rgba(10,22,40,0.95)', borderWidth: 1, borderColor: '#CC0000', borderRadius: 14, padding: 10, marginBottom: 8, width: 160 },
  speedLabel: { color: '#FFAAAA', fontSize: 11, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  sliderTrack: { width: 140, height: 24, justifyContent: 'center', position: 'relative' },
  sliderFill: { position: 'absolute', height: 4, borderRadius: 2, backgroundColor: '#CC0000', left: 0, top: 10 },
  sliderThumb: { position: 'absolute', width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFFFFF', borderWidth: 3, borderColor: '#CC0000', top: 2 },
  joystickFloat: { alignItems: 'center', justifyContent: 'center' },
  joystickBase: { width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(10,22,40,0.85)', borderWidth: 2, borderColor: 'rgba(204,0,0,0.9)', alignItems: 'center', justifyContent: 'center' },
  joystickStick: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#CC0000', borderWidth: 2, borderColor: '#FFFFFF' },
  carouselWrap: { position: 'absolute', bottom: 24, left: 0, right: 0 },
  carouselLabel: { color: '#FFFFFF', fontSize: 11, textAlign: 'center', marginBottom: 8, backgroundColor: 'rgba(10,22,40,0.85)', alignSelf: 'center', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  carousel: { paddingHorizontal: 16, gap: 10, alignItems: 'flex-end' },
  card: { backgroundColor: '#0A1628', borderRadius: 16, overflow: 'hidden' },
  cardPhotoWrap: { height: 80, position: 'relative' },
  cardPhotoImg: { width: '100%', height: '100%' },
  cardBadge: { position: 'absolute', top: 6, left: 6, borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2 },
  cardBadgeText: { color: '#FFFFFF', fontSize: 8, fontWeight: '700' },
  cardBody: { padding: 8 },
  cardPrice: { color: '#FFFFFF', fontWeight: '800' },
  cardTitle: { color: '#8899AA', marginTop: 1 },
  cardDist: { color: '#4A9EFF', marginTop: 2 },
  searchModal: { flex: 1, backgroundColor: '#0A1628' },
  searchModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#1E3050' },
  searchModalClose: { color: '#FFFFFF', fontSize: 20, width: 40 },
  searchModalTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  searchModalReset: { color: '#4A9EFF', fontSize: 13, fontWeight: '600', width: 40, textAlign: 'right' },
  searchModalContent: { padding: 20 },
  filterLabel: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', marginTop: 18, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  searchInputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111F35', borderWidth: 1, borderColor: '#1E3050', borderRadius: 12, paddingHorizontal: 14, gap: 8 },
  searchInput: { flex: 1, paddingVertical: 12, color: '#FFFFFF', fontSize: 14 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1, borderColor: '#1E3050', backgroundColor: '#111F35' },
  filterChipActive: { backgroundColor: '#4A9EFF', borderColor: '#4A9EFF' },
  filterChipText: { color: '#8899AA', fontSize: 13, fontWeight: '500' },
  filterChipTextActive: { color: '#FFFFFF', fontWeight: '700' },
  searchModalFooter: { padding: 16, borderTopWidth: 1, borderTopColor: '#1E3050' },
  applyBtn: { backgroundColor: '#4A9EFF', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  applyBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  modal: { flex: 1, backgroundColor: '#0A1628' },
  photoCarousel: { position: 'relative' },
  photo: { width, height: 260 },
  photoImg: { width: '100%', height: '100%' },
  photoDots: { position: 'absolute', bottom: 12, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { backgroundColor: '#FFFFFF', width: 18 },
  closeBtn: { position: 'absolute', top: 16, left: 16, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18 },
  closeBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  detailBadge: { position: 'absolute', top: 16, right: 16, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
  detailBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  detailBody: { padding: 20 },
  detailPrice: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  detailTitle: { fontSize: 16, color: '#8899AA', marginTop: 4 },
  detailAddr: { fontSize: 13, color: '#4A9EFF', marginTop: 6 },
  propTypeBadge: { alignSelf: 'flex-start', backgroundColor: '#111F35', borderWidth: 1, borderColor: '#1E3050', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginTop: 10 },
  propTypeText: { color: '#4A9EFF', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  detailTags: { flexDirection: 'row', gap: 8, marginTop: 14, flexWrap: 'wrap' },
  detailTag: { backgroundColor: '#111F35', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  detailTagText: { color: '#8899AA', fontSize: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 10, marginTop: 4 },
  detailDesc: { fontSize: 14, color: '#8899AA', lineHeight: 22 },
  divider: { height: 1, backgroundColor: '#1E3050', marginVertical: 20 },
  sellerRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  sellerAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#111F35', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1E3050' },
  sellerAvatarText: { color: '#4A9EFF', fontSize: 16, fontWeight: '700' },
  sellerName: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  sellerMember: { fontSize: 11, color: '#445566', marginTop: 2 },
  sellerRating: { fontSize: 11, color: '#8899AA' },
  reviewHeader: { marginBottom: 10 },
  reviewSummary: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 4 },
  reviewBig: { fontSize: 36, fontWeight: '800', color: '#FFFFFF' },
  reviewCount: { fontSize: 11, color: '#8899AA', marginTop: 4 },
  reviewItem: { paddingVertical: 14, borderTopWidth: 1, borderTopColor: '#1E3050' },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  reviewUser: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  reviewDate: { fontSize: 11, color: '#445566' },
  reviewText: { fontSize: 13, color: '#8899AA', lineHeight: 20, marginTop: 6 },
  ctaWrap: { padding: 16, paddingBottom: 24, borderTopWidth: 1, borderTopColor: '#1E3050' },
  messageBtn: { backgroundColor: '#185FA5', flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, gap: 14 },
  messageBtnEmoji: { fontSize: 24 },
  messageBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  messageBtnSub: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 },
});
