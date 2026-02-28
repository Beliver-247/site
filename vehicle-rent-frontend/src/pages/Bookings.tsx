import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { fetchBookings, cancelBooking } from '../store/bookingSlice';
import BookingCard from '../components/BookingCard';

export default function Bookings() {
    const dispatch = useDispatch<AppDispatch>();
    const { bookings, loading, error } = useSelector(
        (state: RootState) => state.bookings,
    );
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        if (user?.userId) {
            dispatch(fetchBookings(user.userId));
        }
    }, [dispatch, user?.userId]);

    const handleCancel = (id: string) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            dispatch(cancelBooking(id));
        }
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
            <p className="mt-1 text-sm text-gray-500">View and manage your reservations</p>

            {loading && (
                <div className="mt-12 flex justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
                </div>
            )}

            {error && (
                <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
            )}

            {!loading && !error && bookings.length === 0 && (
                <p className="mt-12 text-center text-gray-400">No bookings yet.</p>
            )}

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {bookings.map((b) => (
                    <BookingCard key={b.id} booking={b} onCancel={handleCancel} />
                ))}
            </div>
        </div>
    );
}
