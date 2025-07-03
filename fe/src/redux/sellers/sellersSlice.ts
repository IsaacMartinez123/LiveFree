import { createSlice } from '@reduxjs/toolkit';
import { createSeller, deleteSeller, fetchSellers, updateSeller } from './sellersThunk';
import { Seller } from '../../pages/users/Sellers';

const initialState = {
    sellers: [] as Seller[], // Cambia 'any' por el tipo adecuado si lo tienes definido
    loading: false,
    error: null as string | null,
};

const sellersSlice = createSlice({
    name: 'sellers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSellers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSellers.fulfilled, (state, action) => {
                state.loading = false;
                state.sellers = action.payload;
            })
            .addCase(fetchSellers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Crear vendedor
            .addCase(createSeller.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSeller.fulfilled, (state, action) => {
                state.loading = false;
                state.sellers.push(action.payload); // Agrega el nuevo vendedor a la lista
            })
            .addCase(createSeller.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Editar vendedor
            .addCase(updateSeller.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSeller.fulfilled, (state, action) => {
                state.loading = false;
                // Actualiza el vendedor en la lista
                const idx = state.sellers.findIndex((seller: any) => seller.id === action.payload.id);

                if (idx !== -1) {
                    state.sellers[idx] = action.payload;
                }
            })
            .addCase(updateSeller.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Eliminar vendedor
            .addCase(deleteSeller.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteSeller.fulfilled, (state, action) => {
                state.loading = false;
                state.sellers = state.sellers.filter((seller: any) => seller.id !== action.payload);
            })
            .addCase(deleteSeller.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default sellersSlice.reducer;