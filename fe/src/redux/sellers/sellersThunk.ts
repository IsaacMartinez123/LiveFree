import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export type Seller = {
    id: number;
    name: string;
    document: string;
    phone: string;
    seller_code: string;
};

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
            
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al actualizar vendedor');
        }
    }
);

export const deleteSeller = createAsyncThunk(
    'sellers/deleteSeller',
    async (id: string | number, thunkAPI) => {
        try {
            await api.delete(`/sellers/${id}`);
            return id;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al eliminar vendedor');
        }
    }
);