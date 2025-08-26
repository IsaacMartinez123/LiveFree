import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logoutUser } from './authThunk';

interface AuthState {
    user: any;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart(state) {
            state.loading = true;
            state.error = null;
        },
        loginSuccess(state, action: PayloadAction<any>) {
            state.user = action.payload;
            state.loading = false;
            state.error = null;
        },
        loginFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        // Mueve la lógica del logout síncrono a los extraReducers
    },
    extraReducers: (builder) => {
        builder
            .addCase(logoutUser.fulfilled, (state, action) => {
                // Se ejecuta cuando el thunk de logout es exitoso
                state.user = null;
                state.loading = false;
                state.error = null;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            })
            .addCase(logoutUser.rejected, (state, action) => {
                // Se ejecuta si el thunk de logout falla
                state.loading = false;
                // No limpiamos el usuario porque el logout falló, el usuario sigue logueado
                // state.user = null; // Esto no es necesario aquí
                state.error = action.payload as string;
            })
            .addCase(logoutUser.pending, (state) => {
                // Se ejecuta mientras el thunk está en progreso
                state.loading = true;
                state.error = null;
            });
    },
});

// Ahora solo exportas las acciones que te quedaron
export const { loginStart, loginSuccess, loginFailure } = authSlice.actions;
export default authSlice.reducer;