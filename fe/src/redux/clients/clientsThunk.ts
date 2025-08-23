import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export type Client = {
    id: number;
    name: string;
    document: string;
    phone: string;
    store_name: string;
    address: string;
    city: string;
};

export const fetchClients = createAsyncThunk(
    'clients/fetchClients',
    async (_, thunkAPI) => {
        try {
            const response = await api.get('/clients'); 
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al obtener clientes');
        }
    }
);

export const createClient = createAsyncThunk(
    'clients/createClient',
    async (clientData, thunkAPI) => {
        try {
            const response = await api.post('/clients', clientData);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al crear cliente');
        }
    }
);

export const updateClient = createAsyncThunk(
    'clients/updateClient',
    async (
        payload: { id: string | number; [key: string]: any },
        thunkAPI
    ) => {
        const { id, ...clientData } = payload;
        try {
            const response = await api.put(`/clients/${id}`, clientData);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al actualizar cliente');
        }
    }
);

export const deleteClient = createAsyncThunk(
    'clients/deleteClient',
    async (id: string | number, thunkAPI) => {
        try {
            await api.delete(`/clients/${id}`);
            return id;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al eliminar cliente');
        }
    }
);