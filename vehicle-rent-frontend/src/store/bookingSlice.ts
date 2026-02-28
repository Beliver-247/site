import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Booking } from '../types';
import { getUserBookings, cancelBooking as cancelBookingApi } from '../api/bookingApi';

interface BookingState {
    bookings: Booking[];
    loading: boolean;
    error: string | null;
}

const initialState: BookingState = {
    bookings: [],
    loading: false,
    error: null,
};

export const fetchBookings = createAsyncThunk(
    'bookings/fetchBookings',
    async (userId: string) => {
        const { data } = await getUserBookings(userId);
        return data;
    },
);

export const cancelBooking = createAsyncThunk(
    'bookings/cancelBooking',
    async (id: string) => {
        const { data } = await cancelBookingApi(id);
        return data;
    },
);

const bookingSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload;
            })
            .addCase(fetchBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Failed to fetch bookings';
            })
            .addCase(cancelBooking.fulfilled, (state, action) => {
                const idx = state.bookings.findIndex((b) => b.id === action.payload.id);
                if (idx !== -1) state.bookings[idx] = action.payload;
            });
    },
});

export default bookingSlice.reducer;
