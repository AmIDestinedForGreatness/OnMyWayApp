import { createContext, useContext, useState } from 'react';

const condo1 = require('../assets/properties/condo1.jpg');
const condo2 = require('../assets/properties/condo2.jpg');
const condo3 = require('../assets/properties/condo3.jpg');
const condo4 = require('../assets/properties/condo4.jpg');
const condo5 = require('../assets/properties/condo5.jpg');
const condo6 = require('../assets/properties/condo6.jpg');
const condo7 = require('../assets/properties/condo7.jpg');
const condo8 = require('../assets/properties/condo8.jpg');
const condo9 = require('../assets/properties/condo9.jpg');

export const INITIAL_PROPERTIES = [
  {
    id: 1,
    title: 'Cozy Tagaytay Cabin with Taal View',
    price: '₱3,500/night',
    pricePerNight: 3500,
    type: 'staycation',
    propertyType: 'Cabin',
    latitude: 14.6558,
    longitude: 121.0540,
    bedrooms: 2,
    bathrooms: 1,
    sqm: 60,
    address: 'Tagaytay City, Cavite',
    description: 'Wake up to a stunning Taal Lake view from this cozy cabin. Perfect for couples or small groups looking for a cool mountain escape. Fireplace included. Just 2 hours from Manila.',
    amenities: ['WiFi', 'Fireplace', 'Kitchen', 'Parking', 'Taal View'],
    maxGuests: 4,
    minNights: 2,
    seller: { name: 'Juan Reyes', phone: '09171234567', member: 'Host since 2023', rating: 4.8, reviews: 23 },
    photos: [condo1, condo2, condo3],
  },
  {
    id: 2,
    title: 'BGC Condo with City Views — Weekend Escape',
    price: '₱4,200/night',
    pricePerNight: 4200,
    type: 'staycation',
    propertyType: 'Condo',
    latitude: 14.6572,
    longitude: 121.0558,
    bedrooms: 1,
    bathrooms: 1,
    sqm: 45,
    address: 'Bonifacio Global City, Taguig',
    description: 'Sleek BGC condo on the 28th floor. City skyline at night is unreal. Walking distance to Mercato, High Street, and BGC restaurants. Netflix + fast WiFi included.',
    amenities: ['WiFi', 'Netflix', 'Pool', 'Gym', 'City View', 'Parking'],
    maxGuests: 2,
    minNights: 1,
    seller: { name: 'Maria Santos', phone: '09229876543', member: 'Host since 2022', rating: 4.5, reviews: 11 },
    photos: [condo4, condo5, condo6, condo7],
  },
  {
    id: 3,
    title: 'Baguio Pine Forest Bungalow',
    price: '₱2,800/night',
    pricePerNight: 2800,
    type: 'staycation',
    propertyType: 'Bungalow',
    latitude: 14.6545,
    longitude: 121.0525,
    bedrooms: 3,
    bathrooms: 2,
    sqm: 90,
    address: 'Camp John Hay, Baguio City',
    description: 'Surrounded by pine trees inside Camp John Hay. Naturally cool all year round — no aircon needed! Big garden, outdoor grill, and a hammock area. Bring your barkada.',
    amenities: ['WiFi', 'Garden', 'BBQ Grill', 'Fireplace', 'Parking', 'Pet-friendly'],
    maxGuests: 8,
    minNights: 2,
    seller: { name: 'Carlo Mendoza', phone: '09351112233', member: 'Host since 2021', rating: 4.9, reviews: 38 },
    photos: [condo8, condo9, condo1],
  },
  {
    id: 4,
    title: 'La Union Beachfront Studio — Surf & Chill',
    price: '₱2,200/night',
    pricePerNight: 2200,
    type: 'staycation',
    propertyType: 'Beachfront',
    latitude: 14.6580,
    longitude: 121.0570,
    bedrooms: 1,
    bathrooms: 1,
    sqm: 35,
    address: 'San Juan, La Union',
    description: 'Steps from the famous La Union surf spot. Rustic beach studio with outdoor shower, hammock, and all the surf vibes. Surfboard rental next door. Sunsets are free.',
    amenities: ['WiFi', 'Beach Access', 'Outdoor Shower', 'Hammock', 'Surfboard Rental nearby'],
    maxGuests: 2,
    minNights: 2,
    seller: { name: 'Ana Dela Cruz', phone: '09178889999', member: 'Host since 2024', rating: 4.2, reviews: 6 },
    photos: [condo2, condo3, condo4],
  },
  {
    id: 5,
    title: 'Batangas Villa with Private Pool',
    price: '₱12,000/night',
    pricePerNight: 12000,
    type: 'staycation',
    propertyType: 'Villa',
    latitude: 14.6535,
    longitude: 121.0510,
    bedrooms: 4,
    bathrooms: 3,
    sqm: 200,
    address: 'Lipa City, Batangas',
    description: 'Luxurious private villa with a huge pool, outdoor BBQ area, and garden. Perfect for barkada trips or family celebrations. 30 mins from Taal, 1.5 hrs from Manila. Full kitchen stocked.',
    amenities: ['Private Pool', 'WiFi', 'BBQ Grill', 'Full Kitchen', 'Parking', 'Garden', 'Pet-friendly'],
    maxGuests: 12,
    minNights: 2,
    seller: { name: 'Ramon Garcia', phone: '09055554444', member: 'Host since 2020', rating: 5.0, reviews: 52 },
    photos: [condo5, condo6, condo7],
  },
  {
    id: 6,
    title: 'Antipolo Glamping Tent with Mountain View',
    price: '₱1,800/night',
    pricePerNight: 1800,
    type: 'staycation',
    propertyType: 'Glamping',
    latitude: 14.6590,
    longitude: 121.0490,
    bedrooms: 1,
    bathrooms: 1,
    sqm: 25,
    address: 'Antipolo City, Rizal',
    description: 'Luxury glamping tent on a Rizal hillside. Sleep under the stars without roughing it — real bed, fairy lights, fan, and private toilet. Breakfast included. City lights at night.',
    amenities: ['Breakfast included', 'WiFi', 'City View', 'Bonfire area', 'Stargazing'],
    maxGuests: 2,
    minNights: 1,
    seller: { name: 'Lisa Tan', phone: '09123334455', member: 'Host since 2023', rating: 4.6, reviews: 15 },
    photos: [condo8, condo9, condo1],
  },
  {
    id: 7,
    title: 'Boracay-Style Condo near Alabang',
    price: '₱3,800/night',
    pricePerNight: 3800,
    type: 'staycation',
    propertyType: 'Condo',
    latitude: 14.6600,
    longitude: 121.0535,
    bedrooms: 2,
    bathrooms: 1,
    sqm: 55,
    address: 'Alabang, Muntinlupa',
    description: 'Fully furnished condo that feels like a Boracay resort. Tropical decor, huge pool, and weekend markets nearby. Great for Southies who want a staycation without leaving town.',
    amenities: ['Pool', 'WiFi', 'Netflix', 'Gym', 'Parking', 'Balcony'],
    maxGuests: 4,
    minNights: 1,
    seller: { name: 'Emma Yu', phone: '09887776655', member: 'Host since 2022', rating: 4.7, reviews: 19 },
    photos: [condo2, condo4, condo6, condo8],
  },
  {
    id: 8,
    title: 'Whole House in Quezon City — Barkada Sleepover',
    price: '₱5,500/night',
    pricePerNight: 5500,
    type: 'staycation',
    propertyType: 'Whole House',
    latitude: 14.6525,
    longitude: 121.0555,
    bedrooms: 4,
    bathrooms: 2,
    sqm: 120,
    address: 'Project 4, Quezon City',
    description: 'Whole house rental — yours for the night! 4 bedrooms, videoke machine, billiard table, and a big kitchen. No neighbors to disturb. Minimum 6 guests. Great for birthdays and reunions.',
    amenities: ['WiFi', 'Videoke', 'Billiards', 'Full Kitchen', 'Parking', 'Garden'],
    maxGuests: 14,
    minNights: 1,
    seller: { name: 'David Cruz', phone: '09333344455', member: 'Host since 2024', rating: 4.3, reviews: 8 },
    photos: [condo3, condo5, condo7],
  },
  {
    id: 9,
    title: 'Siargao-Inspired Apartment in Makati',
    price: '₱3,200/night',
    pricePerNight: 3200,
    type: 'staycation',
    propertyType: 'Apartment',
    latitude: 14.6555,
    longitude: 121.0495,
    bedrooms: 2,
    bathrooms: 1,
    sqm: 65,
    address: 'Legazpi Village, Makati',
    description: 'Tropical island vibes in the middle of Makati. Rattan furniture, indoor plants, outdoor balcony with city view. Walking distance to Salcedo Market on weekends.',
    amenities: ['WiFi', 'Netflix', 'Balcony', 'Kitchen', 'Gym', 'Pool'],
    maxGuests: 4,
    minNights: 1,
    seller: { name: 'Grace Lim', phone: '09221110099', member: 'Host since 2023', rating: 4.6, reviews: 14 },
    photos: [condo1, condo9, condo4],
  },
];

export const PROPERTY_TYPES = [
  'Whole House', 'Condo', 'Villa', 'Cabin', 'Beachfront', 'Glamping', 'Apartment', 'Bungalow',
];

export const AMENITIES_LIST = [
  'WiFi', 'Pool', 'Parking', 'Kitchen', 'BBQ Grill', 'Pet-friendly',
  'Beach Access', 'Netflix', 'Gym', 'Balcony', 'Garden', 'Fireplace',
  'Breakfast included', 'Videoke', 'Aircon',
];

const DEFAULT_USER = {
  displayName: 'Yujin',
  email: 'yujin@email.com',
  phone: '09171234567',
  bio: 'Always looking for the next staycation 🏖️',
  memberSince: 'Host since 2026',
  rating: 5.0,
  totalReviews: 0,
  avatarUri: null,
};

const PropertiesContext = createContext();

export function PropertiesProvider({ children }) {
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [adminMode, setAdminMode] = useState(false);
  const [spoofedLocation, setSpoofedLocation] = useState(null);
  const [user, setUser] = useState(DEFAULT_USER);
  const [reviewsReceived] = useState([]);
  const [reviewsGiven] = useState([]);

  const addProperty = (newProp) => {
    const id = Math.max(...properties.map(p => p.id), 0) + 1;
    const propWithUser = {
      ...newProp,
      id,
      seller: {
        name: user.displayName || 'You',
        phone: user.phone || '09000000000',
        member: user.memberSince,
        rating: user.rating,
        reviews: user.totalReviews,
      },
    };
    setProperties((prev) => [...prev, propWithUser]);
  };

  const updateUser = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const myListings = properties.filter(
    p => p.seller.name === user.displayName || p.seller.name === 'You'
  );

  return (
    <PropertiesContext.Provider value={{
      properties, addProperty,
      adminMode, setAdminMode,
      spoofedLocation, setSpoofedLocation,
      user, updateUser,
      reviewsReceived, reviewsGiven,
      myListings,
    }}>
      {children}
    </PropertiesContext.Provider>
  );
}

export function useProperties() {
  return useContext(PropertiesContext);
}
