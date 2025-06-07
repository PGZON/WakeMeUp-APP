export interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  isFavorite: boolean;
  createdAt: string;
}

export interface Trip {
  id: string;
  destination: Location;
  alarmDistance: number; // in meters
  alarmType: 'sound' | 'vibration' | 'both';
  travelMode: 'train' | 'bus' | 'car' | 'walking';
  createdAt: string;
  completedAt?: string;
}

export interface AlarmSettings {
  sound: boolean;
  vibration: boolean;
  notification: boolean;
  ringtone: string;
  distance: number; // in meters
  volume: number; // 0-1
}

export type TravelMode = 'train' | 'bus' | 'car' | 'walking';