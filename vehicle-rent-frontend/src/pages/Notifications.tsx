import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { getUserNotifications, markAsRead } from '../api/notificationApi';
import type { Notification } from '../types';
import NotificationItem from '../components/NotificationItem';

export default function Notifications() {
    const user = useSelector((state: RootState) => state.auth.user);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user?.userId) return;
        (async () => {
            try {
                const { data } = await getUserNotifications(user.userId);
                setNotifications(data.content);
            } catch {
                setError('Failed to load notifications');
            } finally {
                setLoading(false);
            }
        })();
    }, [user?.userId]);

    const handleMarkRead = async (id: string) => {
        try {
            const { data } = await markAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? data : n)),
            );
        } catch {
            /* silently fail */
        }
    };

    return (
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="mt-1 text-sm text-gray-500">Stay updated on your bookings</p>

            {loading && (
                <div className="mt-12 flex justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
                </div>
            )}

            {error && (
                <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
            )}

            {!loading && !error && notifications.length === 0 && (
                <p className="mt-12 text-center text-gray-400">No notifications.</p>
            )}

            <div className="mt-8 space-y-4">
                {notifications.map((n) => (
                    <NotificationItem key={n.id} notification={n} onMarkRead={handleMarkRead} />
                ))}
            </div>
        </div>
    );
}
