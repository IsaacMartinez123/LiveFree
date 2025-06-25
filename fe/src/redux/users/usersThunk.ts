import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (_, thunkAPI) => {
        try {
            const response = await api.get('/users');
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al obtener usuarios');
        }
    }
);

export const createUser = createAsyncThunk(
    'users/createUser',
    async (userData, thunkAPI) => {
        try {            
            const response = await api.post('/users', userData);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al crear usuario');
        }
    }
);

export const updateUser = createAsyncThunk(
    'users/updateUser',
    async (
        payload: { id: string | number; [key: string]: any },
        thunkAPI
    ) => {
        const { id, ...userData } = payload;
        try {            
            const response = await api.put(`/users/${id}`, userData);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al actualizar usuario');
        }
    }
);