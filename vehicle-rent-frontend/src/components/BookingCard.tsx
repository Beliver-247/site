import type { Booking } from '../types';

interface Props {
    booking: Booking;
    onCancel: (id: string) => void;
}

const statusColors: Record<string, string> = {
    CONFIRMED: 'bg-green-100 text-green-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    CANCELLED: 'bg-red-100 text-red-700',
    COMPLETED: 'bg-blue-100 text-blue-700',
};

export default function BookingCard({ booking, onCancel }: Props) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-lg">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500">Vehicle ID</p>
                    <p className="font-mono text-sm font-medium text-gray-900">
                        {booking.vehicleId}
                    </p>
                </div>

                <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[booking.status] ?? 'bg-gray-100 text-gray-700'
                        }`}
                >
                    {booking.status}
                </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-gray-500">Start Date</p>
                    <p className="font-medium text-gray-900">{booking.startDate}</p>
                </div>
                <div>
                    <p className="text-gray-500">End Date</p>
                    <p className="font-medium text-gray-900">{booking.endDate}</p>
                </div>
                <div className="col-span-2">
                    <p className="text-gray-500">Total Amount</p>
                    <p className="text-lg font-semibold text-indigo-600">
                        ${booking.totalAmount.toFixed(2)}
                    </p>
                </div>
            </div>

            {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                <button
                    onClick={() => onCancel(booking.id)}
                    className="mt-4 w-full rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                    Cancel Booking
                </button>
            )}
        </div>
    );
}
