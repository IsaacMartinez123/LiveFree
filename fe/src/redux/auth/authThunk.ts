import { AppDispatch } from '../store';
import { loginStart, loginSuccess, loginFailure } from './authSlice';
import api from '../../services/api';
import { NavigateFunction } from 'react-router-dom';

export const loginUser = (email: string, password: string, navigate: NavigateFunction) => async (dispatch: AppDispatch) => {
    try {
        dispatch(loginStart());
        const res = await api.post('/login', { email, password });
        const { token, user } = res.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        dispatch(loginSuccess(user));

        navigate('/users');
    } catch (error: any) {
        const apiMsg = error.response?.data?.error || error.response?.data?.message || 'No se pudo iniciar sesión';
        dispatch(loginFailure(apiMsg));
    }
};