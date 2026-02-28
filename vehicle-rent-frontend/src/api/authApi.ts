import api from './axios';
import type { AuthResponse, LoginPayload, RegisterPayload } from '../types';

export const registerUser = (data: RegisterPayload) =>
    api.post<AuthResponse>('/users/register', data);

export const loginUser = (data: LoginPayload) =>
    api.post<AuthResponse>('/users/login', data);
