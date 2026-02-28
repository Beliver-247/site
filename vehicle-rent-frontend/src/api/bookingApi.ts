import api from './axios';
import type { Booking } from '../types';
import type { CreateBookingPayload } from '../types';

export const createBooking = (data: CreateBookingPayload) =>
    api.post<Booking>('/bookings', data);

export const getUserBookings = (userId: string) =>
    api.get<Booking[]>(`/bookings/user/${userId}`);

export const getAllBookings = () =>
    api.get<Booking[]>('/bookings');

export const confirmBooking = (id: string) =>
    api.put<Booking>(`/bookings/${id}/confirm`);

export const rejectBooking = (id: string) =>
    api.put<Booking>(`/bookings/${id}/reject`);

export const cancelBooking = (id: string) =>
    api.put<Booking>(`/bookings/${id}/cancel`);
