import api from './axios';
import type { Notification, PaginatedResponse } from '../types';

export const getUserNotifications = (userId: string, page = 0, size = 10) =>
    api.get<PaginatedResponse<Notification>>(
        `/notifications/user/${userId}?page=${page}&size=${size}`,
    );

export const markAsRead = (id: string) =>
    api.put<Notification>(`/notifications/${id}/read`);
