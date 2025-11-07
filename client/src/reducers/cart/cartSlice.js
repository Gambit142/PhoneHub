import { createSlice } from '@reduxjs/toolkit';
import { calculatePrice } from '../../utils/priceUtils';

const calculateShipping = (itemsCount) => {
    if (itemsCount === 0) return 0;
    const baseFee = 5.99;
    const perItemFee = 1.50;
    return baseFee + (perItemFee * (itemsCount - 1));
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        shippingFee: 0,
        isOpen: false
    },
    reducers: {
        addToCart: (state, action) => {
            const { product, selectedColor, selectedStorage, selectedRam, compositeId } = action.payload;
            const existingItemIndex = state.items.findIndex(item => item.compositeId === compositeId);

            if (existingItemIndex >= 0) {
                const newQuantity = state.items[existingItemIndex].quantity + 1;
                if (newQuantity <= state.items[existingItemIndex].stock && newQuantity <= 10) {
                    state.items[existingItemIndex].quantity = newQuantity;
                }
            } else {
                const price = calculatePrice(
                    product.price,
                    product.discountPercentage,
                    product.storage,
                    selectedStorage,
                    product.ramSize,
                    selectedRam
                );

                state.items.push({
                    id: product._id,
                    compositeId,
                    name: product.model,
                    brand: product.brand,
                    image: product.image,
                    price: parseFloat(price),
                    originalPrice: product.price,
                    quantity: 1,
                    selectedColor,
                    selectedStorage,
                    selectedRam,
                    stock: product.stock,
                    discountPercentage: product.discountPercentage,
                    productDetails: {
                        colors: product.colors,
                        storage: product.storage,
                        ramSize: product.ramSize
                    }
                });
            }
            state.shippingFee = calculateShipping(state.items.reduce((total, item) => total + item.quantity, 0));
        },
        updateQuantity: (state, action) => {
            const { compositeId, quantity } = action.payload;
            const itemIndex = state.items.findIndex(item => item.compositeId === compositeId);

            if (itemIndex >= 0) {
                const item = state.items[itemIndex];
                const newQuantity = Math.max(0, Math.min(quantity, item.stock, 10));
                if (newQuantity === 0) {
                    state.items.splice(itemIndex, 1);
                } else {
                    state.items[itemIndex].quantity = newQuantity;
                }
                state.shippingFee = calculateShipping(state.items.reduce((total, item) => total + item.quantity, 0));
                console.log('Updated cart:', state.items, 'Total items:', state.items.reduce((total, item) => total + item.quantity, 0));
            }
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(item => item.compositeId !== action.payload);
            state.shippingFee = calculateShipping(state.items.reduce((total, item) => total + item.quantity, 0));
        },
        clearCart: (state) => {
            state.items = [];
            state.shippingFee = 0;
        },
        updateCartItem: (state, action) => {
            const { compositeId, newCompositeId, updates } = action.payload;
            const itemIndex = state.items.findIndex(item => item.compositeId === compositeId);

            if (itemIndex >= 0) {
                const existingItem = state.items[itemIndex];
                const newPrice = calculatePrice(
                    existingItem.originalPrice,
                    existingItem.discountPercentage,
                    existingItem.productDetails.storage,
                    updates.selectedStorage || existingItem.selectedStorage,
                    existingItem.productDetails.ramSize,
                    updates.selectedRam || existingItem.selectedRam
                );

                if (newCompositeId !== compositeId) {
                    state.items.splice(itemIndex, 1);
                    const existingNewItemIndex = state.items.findIndex(item => item.compositeId === newCompositeId);
                    if (existingNewItemIndex >= 0) {
                        const newQuantity = state.items[existingNewItemIndex].quantity + existingItem.quantity;
                        if (newQuantity <= state.items[existingNewItemIndex].stock && newQuantity <= 10) {
                            state.items[existingNewItemIndex].quantity = newQuantity;
                        }
                    } else {
                        state.items.push({
                            ...existingItem,
                            compositeId: newCompositeId,
                            selectedColor: updates.selectedColor || existingItem.selectedColor,
                            selectedStorage: updates.selectedStorage || existingItem.selectedStorage,
                            selectedRam: updates.selectedRam || existingItem.selectedRam,
                            price: parseFloat(newPrice)
                        });
                    }
                } else {
                    state.items[itemIndex] = {
                        ...existingItem,
                        selectedColor: updates.selectedColor || existingItem.selectedColor,
                        selectedStorage: updates.selectedStorage || existingItem.selectedStorage,
                        selectedRam: updates.selectedRam || existingItem.selectedRam,
                        price: parseFloat(newPrice)
                    };
                }
                state.shippingFee = calculateShipping(state.items.reduce((total, item) => total + item.quantity, 0));
            }
        },
        setIsOpen: (state, action) => {
            state.isOpen = action.payload;
        }
    },
});

export const {
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    updateCartItem,
    setIsOpen
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectShippingFee = (state) => state.cart.shippingFee;
export const selectCartTotal = (state) =>
    state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
export const selectCartItemsCount = (state) =>
    state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const selectCartItemByCompositeId = (compositeId) => (state) =>
    compositeId ? state.cart.items.find(item => item.compositeId === compositeId) : null;
export const selectIsCartOpen = (state) => state.cart.isOpen;

export default cartSlice.reducer;