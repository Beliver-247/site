import { useEffect, useState } from 'react';
import { getVehicles } from '../api/vehicleApi';
import type { Vehicle } from '../types';
import VehicleCard from '../components/VehicleCard';

export default function Vehicles() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const { data } = await getVehicles();
                setVehicles(data);
            } catch {
                setError('Failed to load vehicles');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">Available Vehicles</h1>
            <p className="mt-1 text-sm text-gray-500">Browse and book your next ride</p>

            {loading && (
                <div className="mt-12 flex justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
                </div>
            )}

            {error && (
                <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
            )}

            {!loading && !error && vehicles.length === 0 && (
                <p className="mt-12 text-center text-gray-400">No vehicles found.</p>
            )}

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {vehicles.map((v) => (
                    <VehicleCard key={v.id} vehicle={v} />
                ))}
            </div>
        </div>
    );
}
