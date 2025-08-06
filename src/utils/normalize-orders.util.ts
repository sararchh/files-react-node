/**
 * Normalizes orders data to ensure it's always returned as an array
 * Handles cases where orders might be a JSON string, null, undefined, or other types
 */
export function normalizeOrders(orders: any): any[] {
    if (!orders) return []

    if (typeof orders === 'string') {
        try {
            const parsed = JSON.parse(orders)
            return Array.isArray(parsed) ? parsed : []
        } catch {
            return []
        }
    }

    return Array.isArray(orders) ? orders : []
}
