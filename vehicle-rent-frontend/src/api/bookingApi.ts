import api from './axios';
import type { Booking } from '../types';
import type { CreateBookingPayload } from '../types';

export const createBooking = (data: CreateBookingPayload) =>
    api.post<Booking>('api/bookings', data);

export const getUserBookings = (userId: string) =>
    api.get<Booking[]>(`api/bookings/user/${userId}`);

export const getAllBookings = () =>
    api.get<Booking[]>('api/bookings');

export const confirmBooking = (id: string) =>
    api.put<Booking>(`api/bookings/${id}/confirm`);

export const rejectBooking = (id: string) =>
    api.put<Booking>(`api/bookings/${id}/reject`);

export const cancelBooking = (id: string) =>
    api.put<Booking>(`api/bookings/${id}/cancel`);
