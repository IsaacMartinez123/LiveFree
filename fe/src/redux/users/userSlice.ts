import { createSlice } from '@reduxjs/toolkit';
import { fetchUsers, createUser, updateUser, toggleUserStatus, User, fetchRoles } from './usersThunk';

const initialState = {
    users:  [] as User[], // Cambia 'any' por el tipo de usuario que estés utilizando
    roles: [] as { id: number; rol_name: string }[],
    loading: false,
    error: null as string | null,
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Obtener usuarios
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Obtener Roles
            .addCase(fetchRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.roles = action.payload;
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Crear usuario
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload); // Agrega el nuevo usuario a la lista
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Editar usuario
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                // Actualiza el usuario en la lista
                const idx = state.users.findIndex((user: any) => user.id === action.payload.id);
                
                if (idx !== -1) {
                    state.users[idx] = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(toggleUserStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleUserStatus.fulfilled, (state, action) => {
                state.loading = false;
                const { status } = action.payload;
                
                const id = action.meta.arg;
                const idx = state.users.findIndex((user: any) => user.id === id);
                if (idx !== -1) {
                    state.users[idx].status = status;
                }
            })
            .addCase(toggleUserStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

            
    },
});

export default usersSlice.reducer;