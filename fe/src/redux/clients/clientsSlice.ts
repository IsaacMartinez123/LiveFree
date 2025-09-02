import { createSlice } from '@reduxjs/toolkit';
import { Client, createClient, fetchClients, fetchLabels, Label, updateClient } from './clientsThunk';

const initialState = {
    clients: [] as Client[],
    labels: [] as Label[],
    loading: false,
    error: null as string | null,
};

const clientsSlice = createSlice({
    name: 'clients',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchClients.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClients.fulfilled, (state, action) => {
                state.loading = false;
                state.clients = action.payload;
            })
            .addCase(fetchClients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            
            //Obtener rótulos
            .addCase(fetchLabels.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLabels.fulfilled, (state, action) => {
                state.loading = false;
                state.labels = action.payload;
            })
            .addCase(fetchLabels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Crear cliente
            .addCase(createClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createClient.fulfilled, (state, action) => {
                state.loading = false;
                state.clients.push(action.payload); // Agrega el nuevo cliente a la lista
            })
            .addCase(createClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Editar cliente
            .addCase(updateClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateClient.fulfilled, (state, action) => {
                state.loading = false;
                // Actualiza el cliente en la lista
                const idx = state.clients.findIndex((client: any) => client.id === action.payload.id);

                if (idx !== -1) {
                    state.clients[idx] = action.payload;
                }
            })
            .addCase(updateClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
},
});

export default clientsSlice.reducer;