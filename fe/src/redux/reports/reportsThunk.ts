import { createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../services/api';


export const fetchCommissions = createAsyncThunk(
    "reports/fetchCommissions",
    async ({ startDate, endDate, sellerId }: { startDate: string; endDate: string; sellerId: string }, thunkAPI) => {
        try {
            const res = await api.get("/reports/commissions", {
                params: { start_date: startDate, end_date: endDate, vendedor_id: sellerId },
                responseType: "blob"
            });
            return res.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || 'Error al obtener comisiones'
            );
        }
    }
);

export const fetchCarteraPorVendedor = createAsyncThunk(
    "reports/fetchCarteraPorVendedor",
    async ({ sellerId }: { sellerId: number }, thunkAPI) => {
        try {
            const res = await api.get("/reports/cartera-por-vendedor", {
                params: { vendedor_id: sellerId },
                responseType: "blob"
            });
            return res.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || 'Error al obtener cartera por vendedor'
            );
        }
    }
);

export const fetchCarteraGeneral = createAsyncThunk(
    "reports/fetchCarteraGeneral",
    async (_,thunkAPI) => {
        try {
            const res = await api.get("/reports/cartera-general", { responseType: "blob" });
            return res.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || 'Error al obtener cartera general'
            );
        }
    }
);
