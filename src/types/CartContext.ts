import {Product as ProductType} from '../types/Product'

export type CartContext = {
    products: ProductType[],
    addProduct: (product: ProductType) => void,
    removeProduct: (product: ProductType) => void,
    increment: (product: ProductType) => void,
    decrement: (product: ProductType) => void,
    clearCart: () => void
}