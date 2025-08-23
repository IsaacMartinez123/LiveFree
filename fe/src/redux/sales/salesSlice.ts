import { createSlice } from '@reduxjs/toolkit';
import { fetchSales, createSale, toggleSaleStatus, dispatchSale, Sales } from './salesThunk';

const initialState = {
    sales: [] as Sales[],
    loading: false,
    error: null as string | null,
};

const salesSlice = createSlice({
    name: 'sales',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSales.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSales.fulfilled, (state, action) => {
                state.loading = false;
                state.sales = action.payload;
            })
            .addCase(fetchSales.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(createSale.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSale.fulfilled, (state, action) => {
                state.loading = false;
                state.sales.push(action.payload);
            })
            .addCase(createSale.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(toggleSaleStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleSaleStatus.fulfilled, (state, action) => {
                state.loading = false;
                const { status } = action.payload;

                const id = action.meta.arg;
                const idx = state.sales.findIndex((sale: any) => sale.id === id);
                if (idx !== -1) {
                    state.sales[idx].status = status;
                }
            })
            .addCase(toggleSaleStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(dispatchSale.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(dispatchSale.fulfilled, (state, action) => {
                state.loading = false;
                const id = action.meta.arg;
                const idx = state.sales.findIndex((sale: any) => sale.id === id);
                if (idx !== -1) {
                    state.sales[idx].status = 'despachada';
                }
            })
            .addCase(dispatchSale.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default salesSlice.reducer;