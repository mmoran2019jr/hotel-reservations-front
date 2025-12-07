export interface Room {
  id: string;
  name: string;
  type: string;
  pricePerNight: number;
  capacity: number;
  amenities: string[];
  imageUrls: string[];
  active: boolean;
}
