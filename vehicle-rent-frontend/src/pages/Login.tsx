import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginUser } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';

const schema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = async (data: FormData) => {
        try {
            setError('');
            const res = await loginUser(data);
            login(res.data.token, {
                userId: res.data.id,
                name: res.data.name,
                email: res.data.email,
                role: res.data.role,
            });
            navigate('/vehicles');
        } catch {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">🚗 VehicleRent</h1>
                    <p className="mt-2 text-gray-500">Sign in to your account</p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="rounded-2xl bg-white p-8 shadow-lg"
                >
                    {error && (
                        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register('email')}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                placeholder="you@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                {...register('password')}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-6 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Signing in…' : 'Sign In'}
                    </button>

                    <p className="mt-4 text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Register
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
