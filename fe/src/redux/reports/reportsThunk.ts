import { createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../services/api';
import { saveAs } from "file-saver";


export const fetchCommissions = createAsyncThunk(
    "reports/fetchCommissions",
    async ({ startDate, endDate, sellerId }: { startDate: string; endDate: string; sellerId: string }, thunkAPI) => {
        try {
            const res = await api.get(`/reports/commissions/${sellerId}`, {
                params: { start_date: startDate, end_date: endDate },
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
            const res = await api.get(`/reports/cartera-por-vendedor/${sellerId}`, {
                responseType: "blob",
            });

            // obtener filename del header
            const disposition = res.headers["content-disposition"];
            let filename = "carteraVendedor.xlsx";

            if (disposition) {
                const matches = /filename="?([^"]+)"?/.exec(disposition);
                if (matches && matches[1]) {
                    filename = matches[1].trim();
                }
            }

            // descargar con file-saver
            saveAs(new Blob([res.data]), filename);

            return true; // retorno simple para indicar éxito
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Error al obtener cartera por vendedor"
            );
        }
    }
);

export const fetchCarteraGeneral = createAsyncThunk(
    "reports/fetchCarteraGeneral",
    async (_, thunkAPI) => {
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
