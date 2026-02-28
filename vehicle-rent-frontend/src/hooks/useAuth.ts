import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { setCredentials, logout as logoutAction } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';

export function useAuth() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { token, user, isAuthenticated } = useSelector(
        (state: RootState) => state.auth,
    );

    const login = (token: string, user: User) => {
        dispatch(setCredentials({ token, user }));
    };

    const logout = () => {
        dispatch(logoutAction());
        navigate('/login');
    };

    return { token, user, isAuthenticated, login, logout };
}
