import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import userReducer from "./users/userSlice";
import productsSlice from "./products/productsSlice";
import sellersSlice from "./sellers/sellersSlice";
import clientsSlice from "./clients/clientsSlice";
import salesSlice from "./sales/salesSlice";
import paymentsSlice from "./payments/paymentsSlice";
import returnsSlice from "./returns/returnsSlice";
import reportsSlice from "./reports/reportsSlice";


const rootReducer = combineReducers({
    auth: authReducer,
    users: userReducer,
    products: productsSlice,
    sellers: sellersSlice,
    clients: clientsSlice,
    sales: salesSlice,
    payments: paymentsSlice,
    returns: returnsSlice,
    reports: reportsSlice, 
    
});

export default rootReducer;