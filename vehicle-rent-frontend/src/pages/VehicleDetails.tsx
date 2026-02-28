import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getVehicleById } from '../api/vehicleApi';
import { createBooking } from '../api/bookingApi';
import { useAuth } from '../hooks/useAuth';
import type { Vehicle } from '../types';

const schema = z
    .object({
        startDate: z.string().min(1, 'Start date is required'),
        endDate: z.string().min(1, 'End date is required'),
    })
    .refine((d) => new Date(d.endDate) > new Date(d.startDate), {
        message: 'End date must be after start date',
        path: ['endDate'],
    });

type FormData = z.infer<typeof schema>;

export default function VehicleDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingError, setBookingError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const { data } = await getVehicleById(id);
                setVehicle(data);
            } catch {
                /* empty */
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const onSubmit = async (data: FormData) => {
        if (!id || !user) return;
        try {
            setBookingError('');
            await createBooking({
                userId: user.userId,
                vehicleId: id,
                startDate: new Date(data.startDate).getTime(),
                endDate: new Date(data.endDate).getTime(),
            });
            setBookingSuccess(true);
            setTimeout(() => navigate('/bookings'), 1500);
        } catch {
            setBookingError('Failed to create booking');
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-12 text-center">
                <p className="text-gray-500">Vehicle not found.</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
            {/* Vehicle info */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
                <div className="flex h-56 items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                    <span className="text-7xl">🚗</span>
                </div>

                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {vehicle.brand} {vehicle.model}
                    </h1>

                    <div className="mt-4 flex flex-wrap gap-4">
                        <div className="rounded-lg bg-gray-50 px-4 py-2">
                            <p className="text-xs text-gray-500">Price per day</p>
                            <p className="text-lg font-semibold text-indigo-600">${vehicle.pricePerDay}</p>
                        </div>
                        <div className="rounded-lg bg-gray-50 px-4 py-2">
                            <p className="text-xs text-gray-500">Availability</p>
                            <p
                                className={`text-lg font-semibold ${vehicle.available ? 'text-green-600' : 'text-red-600'
                                    }`}
                            >
                                {vehicle.available ? 'Available' : 'Unavailable'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking form */}
            {vehicle.available && (
                <div className="mt-8 rounded-2xl bg-white p-6 shadow-lg">
                    <h2 className="text-lg font-bold text-gray-900">Book this vehicle</h2>

                    {bookingSuccess && (
                        <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                            Booking confirmed! Redirecting…
                        </div>
                    )}
                    {bookingError && (
                        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {bookingError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="startDate" className="mb-1 block text-sm font-medium text-gray-700">
                                    Start Date
                                </label>
                                <input
                                    id="startDate"
                                    type="date"
                                    {...register('startDate')}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                />
                                {errors.startDate && (
                                    <p className="mt-1 text-xs text-red-500">{errors.startDate.message}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="endDate" className="mb-1 block text-sm font-medium text-gray-700">
                                    End Date
                                </label>
                                <input
                                    id="endDate"
                                    type="date"
                                    {...register('endDate')}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                />
                                {errors.endDate && (
                                    <p className="mt-1 text-xs text-red-500">{errors.endDate.message}</p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || bookingSuccess}
                            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Booking…' : 'Confirm Booking'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
