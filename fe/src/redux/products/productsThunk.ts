import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { FetchParams } from '../../pages/sales/Sales';

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (params: FetchParams = {}, thunkAPI) => {
        try {
            const response = await api.get('/products', { params }); 
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al obtener productos');
        }
    }
);

export const createProduct = createAsyncThunk(
    'products/createProduct',
    async (productData, thunkAPI) => {
        try {
            const response = await api.post('/products', productData);
            
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al crear producto');
        }
    }
);

export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async (
        payload: { id: string | number; [key: string]: any },
        thunkAPI
    ) => {
        const { id, ...productData } = payload;
        try {
            console.log(`Actualizando producto con ID: ${id}`, productData);
            
            const response = await api.put(`/products/${id}`, productData);
            console.log('Producto actualizado:', response.data);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al actualizar producto');
        }
    }
);