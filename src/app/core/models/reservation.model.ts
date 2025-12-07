export interface Reservation {
  id: string;
  userId: string;
  roomId: string;
  checkInDate: string;   // ISO string
  checkOutDate: string;  // ISO string
  totalPrice: number;
  status: string;
  archived: boolean;
}
