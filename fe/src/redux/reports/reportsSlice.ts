import { createSlice } from "@reduxjs/toolkit";
import { fetchCommissions, fetchCarteraPorVendedor, fetchCarteraGeneral } from "../reports/reportsThunk";

interface ReportsState {
    loading: boolean;
    error: string | null;
    commissions: any[];
    carteraPorVendedor: any[];
    carteraGeneral: any[];
}

const initialState: ReportsState = {
    loading: false,
    error: null,
    commissions: [],
    carteraPorVendedor: [],
    carteraGeneral: []
};

const reportsSlice = createSlice({
    name: "reports",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCommissions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCommissions.fulfilled, (state, action) => {
                state.loading = false;
                state.commissions = action.payload;
            })
            .addCase(fetchCommissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Error al cargar comisiones";
            })
            .addCase(fetchCarteraPorVendedor.fulfilled, (state, action) => {
                state.carteraPorVendedor = action.payload;
            })
            .addCase(fetchCarteraGeneral.fulfilled, (state, action) => {
                state.carteraGeneral = action.payload;
            });
    },
});

export default reportsSlice.reducer;
