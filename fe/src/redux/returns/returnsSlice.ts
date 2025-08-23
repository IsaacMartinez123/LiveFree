import { createSlice } from '@reduxjs/toolkit';
import { fetchReturns, createReturn, updateReturn, toggleReturnStatus, Return } from './returnsThunk';


interface ReturnsState {
    returns: Return[];
    loading: boolean;
    error: string | null;
}

const initialState: ReturnsState = {
    returns: [],
    loading: false,
    error: null,
};

const returnsSlice = createSlice({
    name: 'returns',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchReturns.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReturns.fulfilled, (state, action) => {
                state.loading = false;
                state.returns = action.payload;
            })
            .addCase(fetchReturns.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Create
            .addCase(createReturn.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createReturn.fulfilled, (state, action) => {
                state.loading = false;
                state.returns.push(action.payload);
            })
            .addCase(createReturn.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Update
            .addCase(updateReturn.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateReturn.fulfilled, (state, action) => {
                state.loading = false;
                const idx = state.returns.findIndex((r) => r.id === action.payload.id);
                if (idx !== -1) {
                    state.returns[idx] = action.payload;
                }
            })
            .addCase(updateReturn.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Toggle status
            .addCase(toggleReturnStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleReturnStatus.fulfilled, (state, action) => {
                state.loading = false;
                const id = action.meta.arg;
                const idx = state.returns.findIndex((r) => r.id === id);
                if (idx !== -1) {
                    state.returns[idx].status = action.payload.status;
                }
            })
            .addCase(toggleReturnStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default returnsSlice.reducer;
