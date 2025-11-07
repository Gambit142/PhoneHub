import { configureStore } from '@reduxjs/toolkit';
import phonesReducer from './reducers/phones/phonesSlice';
import phoneDetailsReducer from './reducers/phones/phoneDetailsSlice';
import cartReducer from './reducers/cart/cartSlice';
import authReducer from './reducers/auth/authSlice';
import orderReducer from './reducers/order/orderSlice';
import paymentReducer from './reducers/payment/paymentSlice';
import adminOrderReducer from './reducers/admin/adminOrderSlice';
import adminProductReducer from './reducers/admin/adminProductSlice';

export const store = configureStore({
  reducer: {
    phones: phonesReducer,
    phoneDetails: phoneDetailsReducer,
    cart: cartReducer,
    auth: authReducer,
    order: orderReducer,
    payment: paymentReducer,
    adminOrder: adminOrderReducer,
    adminProduct: adminProductReducer
  },
});