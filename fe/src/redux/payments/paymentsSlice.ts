import { createSlice } from '@reduxjs/toolkit';
import {
    fetchPayments,
    createPayment,
    updatePayment,
    changePaymentStatus,
    Payment
} from './paymentsThunk';


const initialState = {
    payments: [] as Payment[],
    loading: false,
    error: null as string | null,
};

const paymentsSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Obtener pagos
            .addCase(fetchPayments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPayments.fulfilled, (state, action) => {
                state.loading = false;
                state.payments = action.payload;
            })
            .addCase(fetchPayments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Crear pago
            .addCase(createPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.payments.push(action.payload);
            })
            .addCase(createPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Actualizar pago
            .addCase(updatePayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePayment.fulfilled, (state, action) => {
                state.loading = false;
                const idx = state.payments.findIndex(p => p.id === action.payload.id);
                if (idx !== -1) {
                    state.payments[idx] = action.payload;
                }
            })
            .addCase(updatePayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Cambiar estado
            .addCase(changePaymentStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changePaymentStatus.fulfilled, (state, action) => {
                state.loading = false;
                const id = action.meta.arg;
                const idx = state.payments.findIndex(p => p.id === id);
                if (idx !== -1) {
                    state.payments[idx].status = action.payload.status;
                }
            })
            .addCase(changePaymentStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default paymentsSlice.reducer;
