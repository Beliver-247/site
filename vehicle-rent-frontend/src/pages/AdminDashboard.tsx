import { useEffect, useState } from 'react';
import { getAllBookings, confirmBooking, rejectBooking } from '../api/bookingApi';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import type { Booking, BookingStatus } from '../types';

const statusColors: Record<BookingStatus, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    CANCELLED: 'bg-gray-100 text-gray-600',
    COMPLETED: 'bg-blue-100 text-blue-700',
};

const tabs: { label: string; value: BookingStatus | 'ALL' }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Rejected', value: 'REJECTED' },
    { label: 'Cancelled', value: 'CANCELLED' },
];

export default function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<BookingStatus | 'ALL'>('ALL');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        if (user?.role !== 'ADMIN') {
            navigate('/vehicles');
            return;
        }
        fetchBookings();
    }, [user, navigate]);

    const fetchBookings = async () => {
        try {
            const { data } = await getAllBookings();
            setBookings(data);
        } catch {
            /* empty */
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (id: string) => {
        setActionLoading(id);
        try {
            await confirmBooking(id);
            await fetchBookings();
        } catch {
            /* empty */
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id: string) => {
        setActionLoading(id);
        try {
            await rejectBooking(id);
            await fetchBookings();
        } catch {
            /* empty */
        } finally {
            setActionLoading(null);
        }
    };

    const filtered =
        activeTab === 'ALL'
            ? bookings
            : bookings.filter((b) => b.status === activeTab);

    const pendingCount = bookings.filter((b) => b.status === 'PENDING').length;

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage all booking requests
                    </p>
                </div>
                {pendingCount > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
                        {pendingCount} pending
                    </span>
                )}
            </div>

            {/* Tabs */}
            <div className="mb-6 flex gap-2 overflow-x-auto border-b border-gray-200 pb-px">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`whitespace-nowrap rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.value
                                ? 'border-b-2 border-indigo-600 text-indigo-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab.label}
                        {tab.value === 'PENDING' && pendingCount > 0 && (
                            <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">
                                {pendingCount}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Table */}
            {filtered.length === 0 ? (
                <div className="rounded-xl bg-gray-50 py-12 text-center">
                    <p className="text-gray-500">No bookings found.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Booking ID
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    User ID
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Vehicle ID
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Dates
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Total
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="whitespace-nowrap px-4 py-3 text-sm font-mono text-gray-700">
                                        {booking.id.slice(-6)}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm font-mono text-gray-500">
                                        {booking.userId.slice(-6)}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm font-mono text-gray-500">
                                        {booking.vehicleId.slice(-6)}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                        {new Date(booking.startDate).toLocaleDateString()} –{' '}
                                        {new Date(booking.endDate).toLocaleDateString()}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900">
                                        ${booking.totalAmount.toFixed(2)}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[booking.status] || 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-right">
                                        {booking.status === 'PENDING' && (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleConfirm(booking.id)}
                                                    disabled={actionLoading === booking.id}
                                                    className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-500 disabled:opacity-50"
                                                >
                                                    {actionLoading === booking.id ? '…' : 'Confirm'}
                                                </button>
                                                <button
                                                    onClick={() => handleReject(booking.id)}
                                                    disabled={actionLoading === booking.id}
                                                    className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-500 disabled:opacity-50"
                                                >
                                                    {actionLoading === booking.id ? '…' : 'Reject'}
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
