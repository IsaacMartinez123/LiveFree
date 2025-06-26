import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
        logout(state) {
            state.user = null;
            state.loading = false;
            state.error = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
