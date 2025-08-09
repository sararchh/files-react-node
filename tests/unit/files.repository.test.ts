import filesRepository from '../../src/modules/files/files.repository'
import { User } from '../../src/entities/User'
import { Product } from '../../src/entities/Product'
import { Order } from '../../src/entities/Order'
import { OrderProduct } from '../../src/entities/OrderProduct'

jest.mock('../../src/entities/User')
jest.mock('../../src/entities/Product')
jest.mock('../../src/entities/Order')
jest.mock('../../src/entities/OrderProduct')

const mockedUser = User as jest.Mocked<typeof User>
const mockedProduct = Product as jest.Mocked<typeof Product>
const mockedOrder = Order as jest.Mocked<typeof Order>
const mockedOrderProduct = OrderProduct as jest.Mocked<typeof OrderProduct>

describe('FilesRepository', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('insertUser', () => {
        it('should call User.findOrCreate with correct parameters', async () => {
            mockedUser.findOrCreate.mockResolvedValue([{} as any, true])

            await filesRepository.insertUser(1, 'John Doe')

            expect(mockedUser.findOrCreate).toHaveBeenCalledWith({
                where: { id: 1 },
                defaults: { name: 'John Doe' },
            })
        })

        it('should handle existing user', async () => {
            mockedUser.findOrCreate.mockResolvedValue([{} as any, false])

            await filesRepository.insertUser(1, 'John Doe')

            expect(mockedUser.findOrCreate).toHaveBeenCalledWith({
                where: { id: 1 },
                defaults: { name: 'John Doe' },
            })
        })
    })

    describe('insertProduct', () => {
        it('should call Product.findOrCreate with correct parameters', async () => {
            mockedProduct.findOrCreate.mockResolvedValue([{} as any, true])

            await filesRepository.insertProduct(123)

            expect(mockedProduct.findOrCreate).toHaveBeenCalledWith({
                where: { id: 123 },
            })
        })
    })

    describe('insertOrder', () => {
        it('should call Order.findOrCreate with correct parameters', async () => {
            mockedOrder.findOrCreate.mockResolvedValue([{} as any, true])

            await filesRepository.insertOrder(456, 1, '2021-03-08')

            expect(mockedOrder.findOrCreate).toHaveBeenCalledWith({
                where: { id: 456 },
                defaults: { user_id: 1, total: 0, date: '2021-03-08' },
            })
        })
    })

    describe('insertOrderProduct', () => {
        it('should call OrderProduct.create with correct parameters', async () => {
            mockedOrderProduct.create.mockResolvedValue({} as any)

            await filesRepository.insertOrderProduct(456, 123, '100.50')

            expect(mockedOrderProduct.create).toHaveBeenCalledWith({
                order_id: 456,
                product_id: 123,
                value: '100.50',
            })
        })
    })

    describe('updateOrderTotals', () => {
        it('should update order totals correctly', async () => {
            const mockOrders = [{ id: 1 }, { id: 2 }]
            mockedOrder.findAll.mockResolvedValue(mockOrders as any)
            mockedOrderProduct.sum.mockResolvedValueOnce(150.75)
            mockedOrderProduct.sum.mockResolvedValueOnce(89.25)
            mockedOrder.update.mockResolvedValue([1] as any)

            await filesRepository.updateOrderTotals()

            expect(mockedOrder.findAll).toHaveBeenCalled()
            expect(mockedOrderProduct.sum).toHaveBeenCalledTimes(2)
            expect(mockedOrderProduct.sum).toHaveBeenNthCalledWith(1, 'value', {
                where: { order_id: 1 },
            })
            expect(mockedOrderProduct.sum).toHaveBeenNthCalledWith(2, 'value', {
                where: { order_id: 2 },
            })
            expect(mockedOrder.update).toHaveBeenCalledTimes(2)
            expect(mockedOrder.update).toHaveBeenNthCalledWith(
                1,
                { total: 150.75 },
                { where: { id: 1 } }
            )
            expect(mockedOrder.update).toHaveBeenNthCalledWith(
                2,
                { total: 89.25 },
                { where: { id: 2 } }
            )
        })

        it('should handle orders with no products (null total)', async () => {
            const mockOrders = [{ id: 1 }]
            mockedOrder.findAll.mockResolvedValue(mockOrders as any)
            mockedOrderProduct.sum.mockResolvedValue(null)
            mockedOrder.update.mockResolvedValue([1] as any)

            await filesRepository.updateOrderTotals()

            expect(mockedOrder.update).toHaveBeenCalledWith(
                { total: 0 },
                { where: { id: 1 } }
            )
        })
    })

    describe('getOrdersWithProducts', () => {
        it('should query orders with order_id filter', async () => {
            const mockUsers = [
                {
                    id: 1,
                    name: 'John Doe',
                    orders: '[{"order_id": 123, "total": "100.00", "date": "2021-03-08", "products": [{"product_id": 1, "value": "50.00"}]}]',
                },
            ]
            mockedUser.findAll.mockResolvedValue(mockUsers as any)

            const result = await filesRepository.getOrdersWithProducts({
                order_id: 123,
            })

            expect(mockedUser.findAll).toHaveBeenCalled()
            expect(result).toEqual([
                {
                    user_id: 1,
                    name: 'John Doe',
                    orders: [
                        {
                            order_id: 123,
                            total: '100.00',
                            date: '2021-03-08',
                            products: [{ product_id: 1, value: '50.00' }],
                        },
                    ],
                },
            ])
        })

        it('should query orders with date range filter', async () => {
            const mockUsers = []
            mockedUser.findAll.mockResolvedValue(mockUsers as any)

            const result = await filesRepository.getOrdersWithProducts({
                start_date: '2021-03-01',
                end_date: '2021-03-31',
            })

            expect(mockedUser.findAll).toHaveBeenCalled()
            expect(result).toEqual([])
        })

        it('should query orders with all filters', async () => {
            const mockUsers = []
            mockedUser.findAll.mockResolvedValue(mockUsers as any)

            const result = await filesRepository.getOrdersWithProducts({
                order_id: 123,
                start_date: '2021-03-01',
                end_date: '2021-03-31',
            })

            expect(mockedUser.findAll).toHaveBeenCalled()
            expect(result).toEqual([])
        })

        it('should query orders without filters', async () => {
            const mockUsers = []
            mockedUser.findAll.mockResolvedValue(mockUsers as any)

            const result = await filesRepository.getOrdersWithProducts({})

            expect(mockedUser.findAll).toHaveBeenCalled()
            expect(result).toEqual([])
        })

        it('should handle database errors', async () => {
            const dbError = new Error('Database connection failed')
            mockedUser.findAll.mockRejectedValue(dbError)

            await expect(
                filesRepository.getOrdersWithProducts({})
            ).rejects.toThrow('Database connection failed')
        })

        it('should handle users with null orders', async () => {
            const mockUsers = [
                {
                    id: 1,
                    name: 'John Doe',
                    orders: null,
                },
            ]
            mockedUser.findAll.mockResolvedValue(mockUsers as any)

            const result = await filesRepository.getOrdersWithProducts({})

            expect(result).toEqual([
                {
                    user_id: 1,
                    name: 'John Doe',
                    orders: [],
                },
            ])
        })

        it('should handle users with invalid JSON orders', async () => {
            const mockUsers = [
                {
                    id: 1,
                    name: 'John Doe',
                    orders: 'invalid json',
                },
            ]
            mockedUser.findAll.mockResolvedValue(mockUsers as any)

            const result = await filesRepository.getOrdersWithProducts({})

            expect(result).toEqual([
                {
                    user_id: 1,
                    name: 'John Doe',
                    orders: [],
                },
            ])
        })
    })
})
