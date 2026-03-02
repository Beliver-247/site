import { Link } from 'react-router-dom';
import type { Vehicle } from '../types';

interface Props {
    vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: Props) {
    return (
        <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg">
            {/* Placeholder image gradient */}
            <div className="flex h-44 items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                <span className="text-5xl">🚗</span>
            </div>

            <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900">
                    {vehicle.brand} {vehicle.model}
                </h3>

                <div className="mt-2 flex items-center justify-between">
                    <span className="text-xl font-semibold text-indigo-600">
                        ${vehicle.pricePerDay}
                        <span className="text-sm font-normal text-gray-500">/day</span>
                    </span>

                    <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${vehicle.available
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                            }`}
                    >
                        {vehicle.available ? 'Available' : 'Unavailable'}
                    </span>
                </div>

                <Link
                    to={`/${vehicle.id}`}
                    className="mt-4 block rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-indigo-500"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}
