import { normalizeOrders } from '../../src/utils/normalize-orders.util'

describe('normalizeOrders', () => {
    it('should return empty array when input is null', () => {
        const result = normalizeOrders(null)
        expect(result).toEqual([])
    })

    it('should return empty array when input is undefined', () => {
        const result = normalizeOrders(undefined)
        expect(result).toEqual([])
    })

    it('should return empty array when input is empty string', () => {
        const result = normalizeOrders('')
        expect(result).toEqual([])
    })

    it('should return empty array when input is false', () => {
        const result = normalizeOrders(false)
        expect(result).toEqual([])
    })

    it('should return empty array when input is 0', () => {
        const result = normalizeOrders(0)
        expect(result).toEqual([])
    })

    it('should parse valid JSON string as array', () => {
        const input = '[{"id": 1, "name": "test"}]'
        const result = normalizeOrders(input)
        expect(result).toEqual([{ id: 1, name: 'test' }])
    })

    it('should return empty array when JSON string is invalid', () => {
        const input = '{"invalid": json}'
        const result = normalizeOrders(input)
        expect(result).toEqual([])
    })

    it('should return empty array when valid JSON string is not an array', () => {
        const input = '{"id": 1, "name": "test"}'
        const result = normalizeOrders(input)
        expect(result).toEqual([])
    })

    it('should return the same array when input is already an array', () => {
        const input = [{ id: 1, name: 'test' }]
        const result = normalizeOrders(input)
        expect(result).toBe(input)
        expect(result).toEqual([{ id: 1, name: 'test' }])
    })

    it('should return empty array when input is object (not array)', () => {
        const input = { id: 1, name: 'test' }
        const result = normalizeOrders(input)
        expect(result).toEqual([])
    })

    it('should return empty array when input is number', () => {
        const input = 123
        const result = normalizeOrders(input)
        expect(result).toEqual([])
    })

    it('should return empty array when input is boolean true', () => {
        const input = true
        const result = normalizeOrders(input)
        expect(result).toEqual([])
    })

    it('should handle JSON string that is empty array', () => {
        const input = '[]'
        const result = normalizeOrders(input)
        expect(result).toEqual([])
    })

    it('should handle nested arrays', () => {
        const input = [
            [1, 2],
            [3, 4],
        ]
        const result = normalizeOrders(input)
        expect(result).toBe(input)
        expect(result).toEqual([
            [1, 2],
            [3, 4],
        ])
    })
})
