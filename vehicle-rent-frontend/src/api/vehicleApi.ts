import api from './axios';
import type { Vehicle } from '../types';

export const getVehicles = () =>
    api.get<Vehicle[]>('/vehicles');

export const getVehicleById = (id: string) =>
    api.get<Vehicle>(`/vehicles/${id}`);
