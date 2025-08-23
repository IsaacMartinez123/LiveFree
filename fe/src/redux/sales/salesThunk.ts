import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export type SaleDetail = {
    id: number;
    sale_id: number;
    product_id: number;
    reference: string;
    product_name: string;
    price: string;
    color: string;
    size_S: number;
    size_M: number;
    size_L: number;
    size_XL: number;
    size_2XL: number;
    size_3XL: number;
    size_4XL: number;
    sub_total: number;
};

export type Sales = {
    id: number;
    invoice_number: string;
    client_id: number;
    seller_id: number;
    user_id: number;
    date_dispatch: string | null;
    total: string;
    client: { id: number; name: string };
    seller: { id: number; name: string, seller_code: string };
    user: { id: number; name: string };
    sales_details: SaleDetail[];
    date: string;
    status: string;
    created_at: string;
};

export type FetchParams = {
    status?: string;
};

export const fetchSales = createAsyncThunk(
    'sales/fetchSales',
    async (params: FetchParams = {}, thunkAPI) => {
        try {
            const res = await api.get('/sales', { params });
            return res.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al obtener ventas');
        }
    }
);


export const createSale = createAsyncThunk(
    'sales/createSale',
    async (saleData, thunkAPI) => {
        try {
            const res = await api.post('/sales', saleData);
            return res.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al crear venta');
        }
    }
);

export const updateSale = createAsyncThunk(
    'sales/updateSale',
    async (
        payload: {
            id: number | undefined;
            saleDetailData: {
                seller_id: number;
                client_id: number;
                items: SaleDetail[];
            };
        },
        thunkAPI
    ) => {
        const { id, saleDetailData } = payload;        
        try {
            const response = await api.put(`/sales/${id}`, saleDetailData); // 👈 directamente el contenido
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || 'Error al actualizar venta'
            );
        }
    }
);


export const toggleSaleStatus = createAsyncThunk(
    'sales/toggleSaleStatus',
    async (id: string | number, thunkAPI) => {
        try {
            const response = await api.delete(`/sales/${id}`);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al cambiar el estado de la venta');
        }
    }
);

export const dispatchSale = createAsyncThunk(
    'sales/dispatchSale',
    async (id: string | number, thunkAPI) => {
        try {
            const response = await api.patch(`/sales/dispatch/${id}`);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al despachar la venta');
        }
    }
);