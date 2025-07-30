import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { paymentDetailData } from '../../Components/sections/payments/AddPayment';

export const fetchPayments = createAsyncThunk(
    'payments/fetchPayments',
    async (_, thunkAPI) => {
        try {
            const response = await api.get('/payments');
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al obtener pagos');
        }
    }
);

export const createPayment = createAsyncThunk(
    'payments/createPayment',
    async (paymentData, thunkAPI) => {
        try {
            const response = await api.post('/payments', paymentData);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al crear pago');
        }
    }
);

export const updatePayment = createAsyncThunk(
    'payments/updatePayment',
    async (
        payload: { id: number | undefined; paymentDetailData: paymentDetailData[] },
        thunkAPI
    ) => {
        const { id, ...paymentDetailData } = payload;
        
        try {
            const response = await api.put(`/payments/${id}`, paymentDetailData);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al actualizar pago');
        }
    }
);

export const changePaymentStatus = createAsyncThunk(
    'payments/changePaymentStatus',
    async (id: string | number, thunkAPI) => {
        try {
            const response = await api.delete(`/payments/${id}`);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al cambiar estado del pago');
        }
    }
);
