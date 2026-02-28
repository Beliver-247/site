import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, BellIcon } from '@heroicons/react/24/outline';

const baseNavigation = [
    { name: 'Vehicles', href: '/vehicles' },
    { name: 'Bookings', href: '/bookings' },
    { name: 'Notifications', href: '/notifications' },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) return null;

    const navigation =
        user?.role === 'ADMIN'
            ? [...baseNavigation, { name: 'Admin', href: '/admin' }]
            : baseNavigation;

    return (
        <Disclosure as="nav" className="bg-gray-900 shadow-lg">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            {/* Logo */}
                            <div className="flex items-center gap-3">
                                <span className="text-xl font-bold tracking-tight text-white">
                                    🚗 VehicleRent
                                </span>
                            </div>

                            {/* Desktop nav */}
                            <div className="hidden md:flex md:items-center md:gap-1">
                                {navigation.map((item) => {
                                    const active = location.pathname.startsWith(item.href);
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className={classNames(
                                                active
                                                    ? 'bg-gray-800 text-white'
                                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                                            )}
                                        >
                                            {item.name === 'Notifications' ? (
                                                <span className="flex items-center gap-1.5">
                                                    <BellIcon className="h-4 w-4" />
                                                    {item.name}
                                                </span>
                                            ) : (
                                                item.name
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* User / logout */}
                            <div className="hidden md:flex md:items-center md:gap-4">
                                <span className="text-sm text-gray-400">
                                    Hi, <span className="font-semibold text-white">{user?.name}</span>
                                </span>
                                <button
                                    onClick={logout}
                                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
                                >
                                    Logout
                                </button>
                            </div>

                            {/* Mobile menu button */}
                            <DisclosureButton className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-700 hover:text-white">
                                {open ? (
                                    <XMarkIcon className="h-6 w-6" />
                                ) : (
                                    <Bars3Icon className="h-6 w-6" />
                                )}
                            </DisclosureButton>
                        </div>
                    </div>

                    {/* Mobile panel */}
                    <DisclosurePanel className="md:hidden">
                        <div className="space-y-1 px-4 pb-3 pt-2">
                            {navigation.map((item) => {
                                const active = location.pathname.startsWith(item.href);
                                return (
                                    <DisclosureButton
                                        key={item.name}
                                        as={Link}
                                        to={item.href}
                                        className={classNames(
                                            active
                                                ? 'bg-gray-800 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'block rounded-lg px-3 py-2 text-base font-medium',
                                        )}
                                    >
                                        {item.name}
                                    </DisclosureButton>
                                );
                            })}
                            <button
                                onClick={logout}
                                className="mt-2 w-full rounded-lg bg-red-600 px-3 py-2 text-base font-medium text-white hover:bg-red-500"
                            >
                                Logout
                            </button>
                        </div>
                    </DisclosurePanel>
                </>
            )}
        </Disclosure>
    );
}
