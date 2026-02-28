/* ── Auth ───────────────────────────────────────────── */

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface User {
    userId: string;
    name: string;
    email: string;
    role: string;
}

/* ── Vehicle ───────────────────────────────────────── */

export interface Vehicle {
    id: string;
    brand: string;
    model: string;
    pricePerDay: number;
    available: boolean;
    imageUrl?: string;
}

/* ── Booking ───────────────────────────────────────── */

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
    id: string;
    vehicleId: string;
    userId: string;
    startDate: number;
    endDate: number;
    totalAmount: number;
    status: BookingStatus;
    createdAt: number;
    updatedAt: number;
}

export interface CreateBookingPayload {
    userId: string;
    vehicleId: string;
    startDate: number;
    endDate: number;
}

/* ── Notification ──────────────────────────────────── */

export type NotificationStatus = 'READ' | 'UNREAD';

export interface Notification {
    id: string;
    userId: string;
    message: string;
    createdAt: string;
    status: NotificationStatus;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}
