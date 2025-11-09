// src/app/lib/location-detection.ts

// Comprehensive list of Kenyan cities and towns
export const KENYAN_CITIES = [
  // Major Cities
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi',
  'Kitale', 'Garissa', 'Kakamega', 'Meru', 'Nyeri', 'Machakos', 'Kericho',
  'Embu', 'Migori', 'Bungoma', 'Kilifi', 'Voi', 'Kitui', 'Homa Bay',
  'Kisii', 'Lamu', 'Nanyuki', 
  
  // Additional Towns
  'Ruiru', 'Kikuyu', 'Ngong', 'Limuru', 'Kiambu', 'Athi River', 
  'Mtwapa', 'Diani Beach', 'Watamu', 'Nyahururu', 'Karatina',
  'Naivasha', 'Gilgil', 'Ol Kalou', 'Muranga', 'Kerugoya',
  'Kajiado', 'Isiolo', 'Marsabit', 'Wajir', 'Mandera',
  'Kapenguria', 'Lodwar', 'Moyale', 'Maralal', 'Mwingi',
  'Makueni', 'Wote', 'Sultan Hamud', 'Mtito Andei',
  'Taveta', 'Kwale', 'Msambweni', 'Ukunda', 'Mariakani',
]

// Known global cities (for auto-detection)
const GLOBAL_CITIES = [
  'london', 'new york', 'dubai', 'mumbai', 'delhi', 'tokyo', 
  'beijing', 'paris', 'sydney', 'toronto', 'lagos', 'cairo',
  'johannesburg', 'cape town', 'kampala', 'dar es salaam',
  'addis ababa', 'kigali', 'accra', 'dakar', 'abuja',
  'los angeles', 'chicago', 'singapore', 'hong kong', 'shanghai',
  'berlin', 'madrid', 'rome', 'amsterdam', 'brussels'
]

export type LocationContext = 'kenya' | 'other' | 'uncertain'

export interface LocationDetectionResult {
  context: LocationContext
  confidence: 'high' | 'medium' | 'low'
  reason: string
  needsUserConfirmation: boolean
}

/**
 * Smart location detection algorithm
 * Returns detection result with confidence level
 */
export function detectLocationContext(city: string): LocationDetectionResult {
  if (!city || city.trim() === '') {
    return {
      context: 'uncertain',
      confidence: 'low',
      reason: 'No city provided',
      needsUserConfirmation: true
    }
  }

  const normalizedCity = city.toLowerCase().trim()

  // Case 1: Exact match with known Kenyan cities
  if (KENYAN_CITIES.some(c => c.toLowerCase() === normalizedCity)) {
    return {
      context: 'kenya',
      confidence: 'high',
      reason: 'Exact match with known Kenyan city',
      needsUserConfirmation: false
    }
  }

  // Case 2: Exact match with known global cities
  if (GLOBAL_CITIES.some(c => c.toLowerCase() === normalizedCity)) {
    return {
      context: 'other',
      confidence: 'high',
      reason: 'Exact match with known international city',
      needsUserConfirmation: false
    }
  }

  // Case 3: Partial match with Kenyan cities
  if (KENYAN_CITIES.some(c => normalizedCity.includes(c.toLowerCase()) || c.toLowerCase().includes(normalizedCity))) {
    return {
      context: 'kenya',
      confidence: 'medium',
      reason: 'Partial match with Kenyan city',
      needsUserConfirmation: true
    }
  }

  // Case 4: Contains "Kenya" keyword
  if (normalizedCity.includes('kenya') || normalizedCity.includes('ke')) {
    return {
      context: 'kenya',
      confidence: 'medium',
      reason: 'Contains Kenya reference',
      needsUserConfirmation: true
    }
  }

  // Case 5: Contains county suffix (Kenyan pattern)
  if (normalizedCity.match(/\bcounty$/i)) {
    return {
      context: 'kenya',
      confidence: 'medium',
      reason: 'Kenyan county naming pattern',
      needsUserConfirmation: true
    }
  }

  // Case 6: Partial match with global cities
  if (GLOBAL_CITIES.some(c => normalizedCity.includes(c) || c.includes(normalizedCity))) {
    return {
      context: 'other',
      confidence: 'medium',
      reason: 'Partial match with international city',
      needsUserConfirmation: true
    }
  }

  // Case 7: Unknown - needs user confirmation
  return {
    context: 'uncertain',
    confidence: 'low',
    reason: 'Unknown location',
    needsUserConfirmation: true
  }
}

/**
 * Validate and process location data
 */
export interface ProcessedLocationData {
  isGlobal: boolean
  locationConfirmation: string | null
  locationVerified: boolean
  locationDetection: string
  needsAdminReview: boolean
}

export function processLocationData(
  city: string,
  userConfirmation?: 'kenya' | 'other'
): ProcessedLocationData {
  const detection = detectLocationContext(city)

  // If user provided confirmation, use it
  if (userConfirmation) {
    return {
      isGlobal: userConfirmation === 'other',
      locationConfirmation: userConfirmation,
      locationVerified: false,
      locationDetection: 'user_confirmed',
      needsAdminReview: detection.confidence !== 'high' // Review if not confident
    }
  }

  // Use auto-detection
  if (detection.confidence === 'high') {
    return {
      isGlobal: detection.context === 'other',
      locationConfirmation: null,
      locationVerified: true, // High confidence = auto-verified
      locationDetection: 'auto',
      needsAdminReview: false
    }
  }

  // Medium or low confidence
  return {
    isGlobal: detection.context === 'other',
    locationConfirmation: null,
    locationVerified: false,
    locationDetection: 'auto',
    needsAdminReview: true
  }
}