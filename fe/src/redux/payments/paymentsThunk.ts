import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { paymentDetailData } from '../../Components/sections/payments/AddPayment';
import { FetchParams } from '../sales/salesThunk';

export type PaymentDetail = {
    id: number;
    payment_id: number;
    amount: string;
    payment_method: string;
    date: string;
    observations: string | null;
    discount: boolean;
};

export type Client = {
    id: number;
    name: string;
};

export type Payment = {
    id: number;
    sales_id: number;
    client_id: number;
    invoice_number: string;
    total_debt: string;
    total_payment: string;
    status: string;
    client: Client;
    payment_details: PaymentDetail[];
};

export const fetchPayments = createAsyncThunk(
    'payments/fetchPayments',
    async (params: FetchParams = {}, thunkAPI) => {
        try {
            const response = await api.get('/payments', { params });
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
            console.log(id, paymentDetailData);

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
