import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Vehicles from '../pages/Vehicles';
import VehicleDetails from '../pages/VehicleDetails';
import Bookings from '../pages/Bookings';
import Notifications from '../pages/Notifications';
import AdminDashboard from '../pages/AdminDashboard';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
                path="/vehicles"
                element={
                    <ProtectedRoute>
                        <Vehicles />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/vehicles/:id"
                element={
                    <ProtectedRoute>
                        <VehicleDetails />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/bookings"
                element={
                    <ProtectedRoute>
                        <Bookings />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/notifications"
                element={
                    <ProtectedRoute>
                        <Notifications />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/vehicles" replace />} />
        </Routes>
    );
}
