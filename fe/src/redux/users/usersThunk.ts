import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export type User = {
    id: number;
    name: string;
    email: string;
    rol_id: string;
    status: boolean;
};

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

export const fetchRoles = createAsyncThunk(
    'roles/fetchRoles',
    async (_, thunkAPI) => {
        try {
            const response = await api.get('/roles');
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al obtener roles');
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

export const toggleUserStatus = createAsyncThunk(
    'users/toggleUserStatus',
    async (id: string | number, thunkAPI) => {
        try {
            const response = await api.delete(`/users/${id}`);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al cambiar el estado del usuario');
        }
    }
);