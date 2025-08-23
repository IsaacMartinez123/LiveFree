import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { FetchParams } from '../sales/salesThunk';

export type ReturnDetail = {
    id: number;
    return_id: number;
    product_id: number;
    reference: string;
    product_name: string;
    price: string;
    color: string;
    amount: number;
    sub_total: number;
};

export type Client = {
    id: number;
    name: string;
    document: string;
};

export type User = {
    id: number;
    name: string;
};

export type Return = {
    id: number;
    user_id: number;
    client_id: number;
    return_number: string;
    refund_total: string;
    return_date: string; 
    refund_date: string; 
    reason: string;
    status: string;
    created_at: string | null;
    updated_at: string | null;
    client: Client;
    user: User;
    details: ReturnDetail[];
};

export const fetchReturns = createAsyncThunk(
    'returns/fetchReturns',
    async (params: FetchParams = {}, thunkAPI) => {
        try {
            const res = await api.get('/returns', { params });
            return res.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || 'Error al obtener devoluciones'
            );
        }
    }
);

export const createReturn = createAsyncThunk(
    'returns/createReturn',
    async (returnData: any, thunkAPI) => {
        try {
            const res = await api.post('/returns', returnData);
            return res.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || 'Error al crear devolución'
            );
        }
    }
);

export const updateReturn = createAsyncThunk(
    'returns/updateReturn',
    async (
        payload: {
            id: number | undefined;
            ReturnDetail: {
                items: ReturnDetail[];
            };
        },
        thunkAPI
    ) => {
        const { id, ReturnDetail } = payload;
        try {
            const res = await api.put(`/returns/${id}`, ReturnDetail);
            return res.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || 'Error al actualizar devolución'
            );
        }
    }
);

export const toggleReturnStatus = createAsyncThunk(
    'returns/toggleReturnStatus',
    async (id: string | number, thunkAPI) => {
        try {
            const res = await api.delete(`/returns/${id}`);
            return res.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || 'Error al cambiar el estado de la devolución'
            );
        }
    }
);
