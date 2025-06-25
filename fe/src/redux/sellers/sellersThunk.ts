import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchSellers = createAsyncThunk(
    'sellers/fetchSellers',
    async (_, thunkAPI) => {
        try {
            const response = await api.get('/sellers'); 
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al obtener vendedores');
        }
    }
);

export const createSeller = createAsyncThunk(
    'sellers/createSeller',
    async (sellerData, thunkAPI) => {
        try {
            const response = await api.post('/sellers', sellerData);
            console.log('Respuesta de creación de vendedor:', response.data);
            
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al crear vendedor');
        }
    }
);

export const updateSeller = createAsyncThunk(
    'sellers/updateSeller',
    async (
        payload: { id: string | number; [key: string]: any },
        thunkAPI
    ) => {
        const { id, ...sellerData } = payload;
        try {
            const response = await api.put(`/sellers/${id}`, sellerData);
            console.log('Respuesta de actualización de vendedor:', response.data);
            
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al actualizar vendedor');
        }
    }
);