export function orderNotFoundError(orderId?: string | number) {
    return {
        name: 'orderNotFoundError',
        message: orderId
            ? `Order with id ${orderId} not found`
            : 'Order not found',
        statusCode: 400,
        error: 'Bad Request',
    }
}
