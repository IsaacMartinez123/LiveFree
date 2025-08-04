import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { FetchSalesParams, SaleDetail } from '../../pages/sales/Sales';


export const fetchSales = createAsyncThunk(
    'sales/fetchSales',
    async (params: FetchSalesParams = {}, thunkAPI) => {
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

        console.log('saleDetailData', saleDetailData);
        

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