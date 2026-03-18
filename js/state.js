import { embeddedProducts } from './data.js';

export const state = {
    products: [...embeddedProducts],
    cart: [],
    filteredProducts: [...embeddedProducts]
};
