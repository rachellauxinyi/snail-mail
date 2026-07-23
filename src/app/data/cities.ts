export interface CityEntry {
  name: string;
  lat: number;
  lng: number;
}

export const CITIES: CityEntry[] = [
  // North America — USA
  { name: 'Anchorage, USA', lat: 61.22, lng: -149.90 },
  { name: 'Atlanta, USA', lat: 33.75, lng: -84.39 },
  { name: 'Austin, USA', lat: 30.27, lng: -97.74 },
  { name: 'Baltimore, USA', lat: 39.29, lng: -76.61 },
  { name: 'Boston, USA', lat: 42.36, lng: -71.06 },
  { name: 'Charlotte, USA', lat: 35.23, lng: -80.84 },
  { name: 'Chicago, USA', lat: 41.88, lng: -87.63 },
  { name: 'Columbus, USA', lat: 39.96, lng: -83.00 },
  { name: 'Dallas, USA', lat: 32.78, lng: -96.80 },
  { name: 'Denver, USA', lat: 39.74, lng: -104.98 },
  { name: 'Detroit, USA', lat: 42.33, lng: -83.05 },
  { name: 'Hawaii, USA', lat: 21.31, lng: -157.86 },
  { name: 'Houston, USA', lat: 29.76, lng: -95.37 },
  { name: 'Indianapolis, USA', lat: 39.77, lng: -86.16 },
  { name: 'Jacksonville, USA', lat: 30.33, lng: -81.66 },
  { name: 'Kansas City, USA', lat: 39.10, lng: -94.58 },
  { name: 'Las Vegas, USA', lat: 36.17, lng: -115.14 },
  { name: 'Los Angeles, USA', lat: 34.05, lng: -118.24 },
  { name: 'Memphis, USA', lat: 35.15, lng: -90.05 },
  { name: 'Miami, USA', lat: 25.77, lng: -80.19 },
  { name: 'Minneapolis, USA', lat: 44.98, lng: -93.27 },
  { name: 'Nashville, USA', lat: 36.17, lng: -86.78 },
  { name: 'New Orleans, USA', lat: 29.95, lng: -90.07 },
  { name: 'New York, USA', lat: 40.71, lng: -74.01 },
  { name: 'Orlando, USA', lat: 28.54, lng: -81.38 },
  { name: 'Philadelphia, USA', lat: 39.95, lng: -75.17 },
  { name: 'Phoenix, USA', lat: 33.45, lng: -112.07 },
  { name: 'Pittsburgh, USA', lat: 40.44, lng: -79.99 },
  { name: 'Portland, USA', lat: 45.52, lng: -122.68 },
  { name: 'Salt Lake City, USA', lat: 40.76, lng: -111.89 },
  { name: 'San Antonio, USA', lat: 29.42, lng: -98.49 },
  { name: 'San Diego, USA', lat: 32.72, lng: -117.16 },
  { name: 'San Francisco, USA', lat: 37.77, lng: -122.42 },
  { name: 'Seattle, USA', lat: 47.61, lng: -122.33 },
  { name: 'St. Louis, USA', lat: 38.63, lng: -90.20 },
  { name: 'Tampa, USA', lat: 27.95, lng: -82.46 },
  { name: 'Washington DC, USA', lat: 38.91, lng: -77.04 },
  // North America — Canada
  { name: 'Calgary, Canada', lat: 51.05, lng: -114.07 },
  { name: 'Edmonton, Canada', lat: 53.55, lng: -113.49 },
  { name: 'Halifax, Canada', lat: 44.65, lng: -63.58 },
  { name: 'Montreal, Canada', lat: 45.51, lng: -73.57 },
  { name: 'Ottawa, Canada', lat: 45.42, lng: -75.69 },
  { name: 'Quebec City, Canada', lat: 46.81, lng: -71.21 },
  { name: 'Toronto, Canada', lat: 43.65, lng: -79.38 },
  { name: 'Vancouver, Canada', lat: 49.28, lng: -123.12 },
  { name: 'Winnipeg, Canada', lat: 49.90, lng: -97.14 },
  // North America — Mexico & Caribbean
  { name: 'Cancún, Mexico', lat: 21.16, lng: -86.85 },
  { name: 'Guadalajara, Mexico', lat: 20.66, lng: -103.35 },
  { name: 'Mexico City, Mexico', lat: 19.43, lng: -99.13 },
  { name: 'Monterrey, Mexico', lat: 25.67, lng: -100.31 },
  { name: 'Havana, Cuba', lat: 23.14, lng: -82.36 },
  { name: 'Kingston, Jamaica', lat: 17.99, lng: -76.79 },
  { name: 'Nassau, Bahamas', lat: 25.05, lng: -77.34 },
  { name: 'San José, Costa Rica', lat: 9.93, lng: -84.08 },
  { name: 'Guatemala City, Guatemala', lat: 14.64, lng: -90.51 },
  { name: 'Panama City, Panama', lat: 8.99, lng: -79.52 },
  // South America
  { name: 'Bogotá, Colombia', lat: 4.71, lng: -74.07 },
  { name: 'Buenos Aires, Argentina', lat: -34.60, lng: -58.38 },
  { name: 'Caracas, Venezuela', lat: 10.48, lng: -66.88 },
  { name: 'Cartagena, Colombia', lat: 10.39, lng: -75.51 },
  { name: 'Cusco, Peru', lat: -13.53, lng: -71.97 },
  { name: 'Lima, Peru', lat: -12.05, lng: -77.04 },
  { name: 'Medellín, Colombia', lat: 6.25, lng: -75.57 },
  { name: 'Montevideo, Uruguay', lat: -34.90, lng: -56.19 },
  { name: 'Quito, Ecuador', lat: -0.23, lng: -78.52 },
  { name: 'Rio de Janeiro, Brazil', lat: -22.91, lng: -43.17 },
  { name: 'Santiago, Chile', lat: -33.46, lng: -70.65 },
  { name: 'São Paulo, Brazil', lat: -23.55, lng: -46.63 },
  // Western Europe
  { name: 'Amsterdam, Netherlands', lat: 52.37, lng: 4.90 },
  { name: 'Athens, Greece', lat: 37.98, lng: 23.73 },
  { name: 'Barcelona, Spain', lat: 41.39, lng: 2.15 },
  { name: 'Belfast, UK', lat: 54.60, lng: -5.93 },
  { name: 'Berlin, Germany', lat: 52.52, lng: 13.41 },
  { name: 'Bern, Switzerland', lat: 46.95, lng: 7.45 },
  { name: 'Birmingham, UK', lat: 52.49, lng: -1.90 },
  { name: 'Bordeaux, France', lat: 44.84, lng: -0.58 },
  { name: 'Brussels, Belgium', lat: 50.85, lng: 4.35 },
  { name: 'Copenhagen, Denmark', lat: 55.68, lng: 12.57 },
  { name: 'Dublin, Ireland', lat: 53.33, lng: -6.25 },
  { name: 'Düsseldorf, Germany', lat: 51.23, lng: 6.77 },
  { name: 'Edinburgh, Scotland', lat: 55.95, lng: -3.19 },
  { name: 'Florence, Italy', lat: 43.77, lng: 11.26 },
  { name: 'Frankfurt, Germany', lat: 50.11, lng: 8.68 },
  { name: 'Geneva, Switzerland', lat: 46.20, lng: 6.14 },
  { name: 'Glasgow, Scotland', lat: 55.86, lng: -4.25 },
  { name: 'Hamburg, Germany', lat: 53.57, lng: 10.02 },
  { name: 'Helsinki, Finland', lat: 60.17, lng: 24.94 },
  { name: 'Lisbon, Portugal', lat: 38.72, lng: -9.14 },
  { name: 'Ljubljana, Slovenia', lat: 46.05, lng: 14.51 },
  { name: 'London, UK', lat: 51.51, lng: -0.13 },
  { name: 'Luxembourg City, Luxembourg', lat: 49.61, lng: 6.13 },
  { name: 'Lyon, France', lat: 45.75, lng: 4.84 },
  { name: 'Madrid, Spain', lat: 40.42, lng: -3.70 },
  { name: 'Manchester, UK', lat: 53.48, lng: -2.24 },
  { name: 'Marseille, France', lat: 43.30, lng: 5.37 },
  { name: 'Milan, Italy', lat: 45.47, lng: 9.19 },
  { name: 'Monaco', lat: 43.74, lng: 7.43 },
  { name: 'Munich, Germany', lat: 48.14, lng: 11.58 },
  { name: 'Naples, Italy', lat: 40.84, lng: 14.25 },
  { name: 'Nice, France', lat: 43.71, lng: 7.26 },
  { name: 'Oslo, Norway', lat: 59.91, lng: 10.75 },
  { name: 'Paris, France', lat: 48.85, lng: 2.35 },
  { name: 'Porto, Portugal', lat: 41.16, lng: -8.63 },
  { name: 'Reykjavík, Iceland', lat: 64.14, lng: -21.94 },
  { name: 'Rome, Italy', lat: 41.90, lng: 12.50 },
  { name: 'Rotterdam, Netherlands', lat: 51.92, lng: 4.48 },
  { name: 'Santorini, Greece', lat: 36.39, lng: 25.46 },
  { name: 'Seville, Spain', lat: 37.38, lng: -5.97 },
  { name: 'Stockholm, Sweden', lat: 59.33, lng: 18.07 },
  { name: 'Valencia, Spain', lat: 39.47, lng: -0.38 },
  { name: 'Venice, Italy', lat: 45.44, lng: 12.33 },
  { name: 'Vienna, Austria', lat: 48.21, lng: 16.37 },
  { name: 'Zurich, Switzerland', lat: 47.38, lng: 8.54 },
  // Eastern Europe
  { name: 'Belgrade, Serbia', lat: 44.80, lng: 20.46 },
  { name: 'Bratislava, Slovakia', lat: 48.15, lng: 17.11 },
  { name: 'Bucharest, Romania', lat: 44.43, lng: 26.10 },
  { name: 'Budapest, Hungary', lat: 47.50, lng: 19.04 },
  { name: 'Kraków, Poland', lat: 50.06, lng: 19.94 },
  { name: 'Kyiv, Ukraine', lat: 50.45, lng: 30.52 },
  { name: 'Minsk, Belarus', lat: 53.91, lng: 27.55 },
  { name: 'Moscow, Russia', lat: 55.75, lng: 37.62 },
  { name: 'Prague, Czech Republic', lat: 50.08, lng: 14.44 },
  { name: 'Riga, Latvia', lat: 56.95, lng: 24.11 },
  { name: 'Sofia, Bulgaria', lat: 42.70, lng: 23.32 },
  { name: 'St. Petersburg, Russia', lat: 59.95, lng: 30.32 },
  { name: 'Tallinn, Estonia', lat: 59.44, lng: 24.75 },
  { name: 'Vilnius, Lithuania', lat: 54.69, lng: 25.28 },
  { name: 'Warsaw, Poland', lat: 52.23, lng: 21.01 },
  { name: 'Zagreb, Croatia', lat: 45.81, lng: 15.98 },
  // Middle East
  { name: 'Abu Dhabi, UAE', lat: 24.47, lng: 54.37 },
  { name: 'Amman, Jordan', lat: 31.96, lng: 35.95 },
  { name: 'Beirut, Lebanon', lat: 33.89, lng: 35.50 },
  { name: 'Cairo, Egypt', lat: 30.04, lng: 31.24 },
  { name: 'Doha, Qatar', lat: 25.29, lng: 51.53 },
  { name: 'Dubai, UAE', lat: 25.20, lng: 55.27 },
  { name: 'Istanbul, Turkey', lat: 41.01, lng: 28.95 },
  { name: 'Jerusalem, Israel', lat: 31.77, lng: 35.22 },
  { name: 'Kuwait City, Kuwait', lat: 29.37, lng: 47.98 },
  { name: 'Muscat, Oman', lat: 23.61, lng: 58.59 },
  { name: 'Riyadh, Saudi Arabia', lat: 24.69, lng: 46.72 },
  { name: 'Tel Aviv, Israel', lat: 32.08, lng: 34.78 },
  { name: 'Tehran, Iran', lat: 35.69, lng: 51.42 },
  // Africa
  { name: 'Accra, Ghana', lat: 5.56, lng: -0.20 },
  { name: 'Addis Ababa, Ethiopia', lat: 9.02, lng: 38.75 },
  { name: 'Alexandria, Egypt', lat: 31.20, lng: 29.92 },
  { name: 'Algiers, Algeria', lat: 36.74, lng: 3.06 },
  { name: 'Cape Town, South Africa', lat: -33.93, lng: 18.42 },
  { name: 'Casablanca, Morocco', lat: 33.59, lng: -7.62 },
  { name: 'Dakar, Senegal', lat: 14.69, lng: -17.44 },
  { name: 'Dar es Salaam, Tanzania', lat: -6.80, lng: 39.29 },
  { name: 'Johannesburg, South Africa', lat: -26.20, lng: 28.04 },
  { name: 'Kampala, Uganda', lat: 0.32, lng: 32.58 },
  { name: 'Lagos, Nigeria', lat: 6.52, lng: 3.38 },
  { name: 'Luanda, Angola', lat: -8.84, lng: 13.23 },
  { name: 'Lusaka, Zambia', lat: -15.42, lng: 28.28 },
  { name: 'Marrakesh, Morocco', lat: 31.63, lng: -8.00 },
  { name: 'Nairobi, Kenya', lat: -1.29, lng: 36.82 },
  { name: 'Tunis, Tunisia', lat: 36.82, lng: 10.17 },
  // South Asia
  { name: 'Colombo, Sri Lanka', lat: 6.93, lng: 79.85 },
  { name: 'Dhaka, Bangladesh', lat: 23.72, lng: 90.41 },
  { name: 'Delhi, India', lat: 28.66, lng: 77.21 },
  { name: 'Islamabad, Pakistan', lat: 33.72, lng: 73.04 },
  { name: 'Karachi, Pakistan', lat: 24.86, lng: 67.01 },
  { name: 'Kathmandu, Nepal', lat: 27.71, lng: 85.32 },
  { name: 'Kolkata, India', lat: 22.57, lng: 88.36 },
  { name: 'Lahore, Pakistan', lat: 31.55, lng: 74.34 },
  { name: 'Mumbai, India', lat: 19.08, lng: 72.88 },
  { name: 'Bangalore, India', lat: 12.97, lng: 77.59 },
  { name: 'Chennai, India', lat: 13.08, lng: 80.27 },
  // East Asia
  { name: 'Beijing, China', lat: 39.91, lng: 116.39 },
  { name: 'Busan, South Korea', lat: 35.10, lng: 129.03 },
  { name: 'Chengdu, China', lat: 30.57, lng: 104.07 },
  { name: 'Fukuoka, Japan', lat: 33.59, lng: 130.40 },
  { name: 'Guangzhou, China', lat: 23.13, lng: 113.26 },
  { name: 'Hong Kong', lat: 22.32, lng: 114.17 },
  { name: 'Kyoto, Japan', lat: 35.01, lng: 135.77 },
  { name: 'Macao', lat: 22.20, lng: 113.54 },
  { name: 'Nara, Japan', lat: 34.69, lng: 135.83 },
  { name: 'Okinawa, Japan', lat: 26.21, lng: 127.68 },
  { name: 'Osaka, Japan', lat: 34.69, lng: 135.50 },
  { name: 'Sapporo, Japan', lat: 43.06, lng: 141.35 },
  { name: 'Seoul, South Korea', lat: 37.57, lng: 126.98 },
  { name: 'Shanghai, China', lat: 31.23, lng: 121.47 },
  { name: 'Shenzhen, China', lat: 22.54, lng: 114.06 },
  { name: 'Taipei, Taiwan', lat: 25.04, lng: 121.57 },
  { name: 'Tokyo, Japan', lat: 35.68, lng: 139.69 },
  { name: 'Ulaanbaatar, Mongolia', lat: 47.92, lng: 106.92 },
  { name: 'Yokohama, Japan', lat: 35.44, lng: 139.64 },
  // Southeast Asia
  { name: 'Bali, Indonesia', lat: -8.34, lng: 115.09 },
  { name: 'Bangkok, Thailand', lat: 13.75, lng: 100.52 },
  { name: 'Cebu, Philippines', lat: 10.32, lng: 123.90 },
  { name: 'Chiang Mai, Thailand', lat: 18.79, lng: 98.98 },
  { name: 'Da Nang, Vietnam', lat: 16.07, lng: 108.22 },
  { name: 'Hanoi, Vietnam', lat: 21.03, lng: 105.85 },
  { name: 'Ho Chi Minh City, Vietnam', lat: 10.82, lng: 106.63 },
  { name: 'Jakarta, Indonesia', lat: -6.21, lng: 106.85 },
  { name: 'Kuala Lumpur, Malaysia', lat: 3.14, lng: 101.69 },
  { name: 'Luang Prabang, Laos', lat: 19.89, lng: 102.13 },
  { name: 'Manila, Philippines', lat: 14.60, lng: 120.98 },
  { name: 'Penang, Malaysia', lat: 5.41, lng: 100.34 },
  { name: 'Phnom Penh, Cambodia', lat: 11.56, lng: 104.92 },
  { name: 'Phuket, Thailand', lat: 7.88, lng: 98.39 },
  { name: 'Siem Reap, Cambodia', lat: 13.36, lng: 103.86 },
  { name: 'Singapore', lat: 1.35, lng: 103.82 },
  { name: 'Yangon, Myanmar', lat: 16.87, lng: 96.15 },
  // Central Asia
  { name: 'Almaty, Kazakhstan', lat: 43.26, lng: 76.93 },
  { name: 'Ashgabat, Turkmenistan', lat: 37.95, lng: 58.38 },
  { name: 'Baku, Azerbaijan', lat: 40.41, lng: 49.87 },
  { name: 'Tashkent, Uzbekistan', lat: 41.30, lng: 69.24 },
  { name: 'Tbilisi, Georgia', lat: 41.69, lng: 44.83 },
  // Oceania
  { name: 'Auckland, New Zealand', lat: -36.86, lng: 174.77 },
  { name: 'Brisbane, Australia', lat: -27.47, lng: 153.02 },
  { name: 'Christchurch, New Zealand', lat: -43.53, lng: 172.64 },
  { name: 'Fiji', lat: -17.71, lng: 178.06 },
  { name: 'Melbourne, Australia', lat: -37.81, lng: 144.96 },
  { name: 'Perth, Australia', lat: -31.95, lng: 115.86 },
  { name: 'Sydney, Australia', lat: -33.87, lng: 151.21 },
  { name: 'Wellington, New Zealand', lat: -41.29, lng: 174.78 },
];

export const CITY_NAMES = CITIES.map(c => c.name);

const coordMap = new Map(CITIES.map(c => [
  c.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''),
  c
]));

function haversineKm(a: CityEntry, b: CityEntry): number {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLon = (b.lng - a.lng) * Math.PI / 180;
  const h = Math.sin(dLat / 2) ** 2
    + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function estimateDelivery(from: string, to: string): string {
  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const fromKey = norm(from.split(',')[0].trim());
  const toKey = norm(to.split(',')[0].trim());

  // try exact city key, then first word of city
  const findCity = (key: string): CityEntry | undefined => {
    if (coordMap.has(key)) return coordMap.get(key);
    for (const [k, v] of coordMap) {
      if (k.startsWith(key + ',') || k === key) return v;
    }
    return undefined;
  };

  const a = findCity(fromKey);
  const b = findCity(toKey);
  if (!a || !b) return '';

  const km = haversineKm(a, b);
  if (km < 50) return 'same day';

  // tiered speed: domestic short → regional → long-haul air
  let days: number;
  if (km < 500) days = Math.round(km / 150);
  else if (km < 3000) days = Math.round(km / 400);
  else days = Math.round(km / 900);

  days = Math.max(1, days);
  return `~${days} day${days !== 1 ? 's' : ''}`;
}
