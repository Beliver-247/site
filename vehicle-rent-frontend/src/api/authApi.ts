import api from './axios';
import type { AuthResponse, LoginPayload, RegisterPayload } from '../types';

export const registerUser = (data: RegisterPayload) =>
    api.post<AuthResponse>('api/users/register', data);

export const loginUser = (data: LoginPayload) =>
    api.post<AuthResponse>('api/users/login', data);
