import { createSlice } from '@reduxjs/toolkit';
import { createProduct, fetchProducts, updateProduct } from './productsThunk';
import { Products } from '../../pages/products/Products';

const initialState = {
    products: [] as Products[],
    loading: false,
    error: null as string | null,
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Crear producto
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.push(action.payload); // Agrega el nuevo producto a la lista
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Editar producto
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                // Actualiza el producto en la lista
                const idx = state.products.findIndex((product: any) => product.id === action.payload.id);

                if (idx !== -1) {
                    state.products[idx] = action.payload;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default productsSlice.reducer;