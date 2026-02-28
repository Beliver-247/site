import type { Notification } from '../types';

interface Props {
    notification: Notification;
    onMarkRead: (id: string) => void;
}

export default function NotificationItem({ notification, onMarkRead }: Props) {
    const isUnread = notification.status === 'UNREAD';

    return (
        <div
            className={`rounded-xl border p-4 transition ${isUnread
                    ? 'border-indigo-200 bg-indigo-50'
                    : 'border-gray-200 bg-white'
                }`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <p className={`text-sm ${isUnread ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                        {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        {new Date(notification.createdAt).toLocaleString()}
                    </p>
                </div>

                {isUnread && (
                    <button
                        onClick={() => onMarkRead(notification.id)}
                        className="shrink-0 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-500"
                    >
                        Mark read
                    </button>
                )}
            </div>
        </div>
    );
}
