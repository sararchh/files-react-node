export interface ILegacyLine {
    userId: number
    userName: string
    orderId: number
    productId: number
    value: string
    date: string
}

export type TProduct = {
    product_id: number
    value: string
}

export type TOrder = {
    order_id: number
    total: string
    date: string
    products: TProduct[]
}

export interface IUserOrders {
    user_id: number
    name: string
    orders: TOrder[]
}
