import filesService from '../../src/modules/files/files.service'
import filesRepository from '../../src/modules/files/files.repository'
import { fileProcessError } from '../../src/modules/files/errors/files.errors'
import { orderNotFoundError } from '../../src/modules/files/errors/order.error'

jest.mock('../../src/modules/files/files.repository')

const mockedFilesRepository = filesRepository as jest.Mocked<
    typeof filesRepository
>

describe('FilesService', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('processFileUpload', () => {
        it('should process a valid file successfully', async () => {
            const mockContent = `0000000070                             Palmer Prosacco00000007530000000003     947.19720210308
0000000075                               Bobbie Batz00000007980000000002     954.71220210308`

            mockedFilesRepository.insertUser.mockResolvedValue(undefined)
            mockedFilesRepository.insertProduct.mockResolvedValue(undefined)
            mockedFilesRepository.insertOrder.mockResolvedValue(undefined)
            mockedFilesRepository.insertOrderProduct.mockResolvedValue(
                undefined
            )
            mockedFilesRepository.updateOrderTotals.mockResolvedValue(undefined)

            await expect(
                filesService.processFileUpload(mockContent)
            ).resolves.not.toThrow()

            expect(mockedFilesRepository.insertUser).toHaveBeenCalledTimes(2)
            expect(mockedFilesRepository.insertProduct).toHaveBeenCalledTimes(2)
            expect(mockedFilesRepository.insertOrder).toHaveBeenCalledTimes(2)
            expect(
                mockedFilesRepository.insertOrderProduct
            ).toHaveBeenCalledTimes(2)
            expect(
                mockedFilesRepository.updateOrderTotals
            ).toHaveBeenCalledTimes(1)
        })

        it('should throw error when repository fails', async () => {
            const mockContent = `0000000070                             Palmer Prosacco00000007530000000003     947.19720210308`

            mockedFilesRepository.insertUser.mockRejectedValue(
                new Error('DB Error')
            )

            await expect(
                filesService.processFileUpload(mockContent)
            ).rejects.toEqual(fileProcessError())
        })

        it('should process empty file without error', async () => {
            const mockContent = ''

            mockedFilesRepository.updateOrderTotals.mockResolvedValue(undefined)

            await expect(
                filesService.processFileUpload(mockContent)
            ).resolves.not.toThrow()

            expect(mockedFilesRepository.insertUser).not.toHaveBeenCalled()
            expect(mockedFilesRepository.insertProduct).not.toHaveBeenCalled()
            expect(
                mockedFilesRepository.updateOrderTotals
            ).toHaveBeenCalledTimes(1)
        })
    })

    describe('getNormalizedOrders', () => {
        it('should return orders when found', async () => {
            const mockOrders = [
                {
                    user_id: 1,
                    name: 'Test User',
                    orders: [
                        {
                            order_id: 123,
                            total: '100.00',
                            date: '2021-03-08',
                            products: [
                                {
                                    product_id: 1,
                                    value: '50.00',
                                },
                            ],
                        },
                    ],
                },
            ]

            mockedFilesRepository.getOrdersWithProducts.mockResolvedValue(
                mockOrders
            )

            const result = await filesService.getNormalizedOrders({
                order_id: 123,
                start_date: '2021-03-01',
                end_date: '2021-03-31',
            })

            expect(result).toEqual(mockOrders)
            expect(
                mockedFilesRepository.getOrdersWithProducts
            ).toHaveBeenCalledWith({
                order_id: 123,
                start_date: '2021-03-01',
                end_date: '2021-03-31',
            })
        })

        it('should throw error when no orders are found', async () => {
            mockedFilesRepository.getOrdersWithProducts.mockResolvedValue([])

            await expect(
                filesService.getNormalizedOrders({
                    order_id: 123,
                    start_date: '2021-03-01',
                    end_date: '2021-03-31',
                })
            ).rejects.toEqual(orderNotFoundError(123))
        })

        it('should throw error when repository returns null', async () => {
            mockedFilesRepository.getOrdersWithProducts.mockResolvedValue(null)

            await expect(
                filesService.getNormalizedOrders({
                    order_id: 123,
                    start_date: '2021-03-01',
                    end_date: '2021-03-31',
                })
            ).rejects.toEqual(orderNotFoundError(123))
        })

        it('should propagate repository errors', async () => {
            const dbError = new Error('Database connection failed')
            mockedFilesRepository.getOrdersWithProducts.mockRejectedValue(
                dbError
            )

            await expect(
                filesService.getNormalizedOrders({
                    order_id: 123,
                    start_date: '2021-03-01',
                    end_date: '2021-03-31',
                })
            ).rejects.toThrow('Database connection failed')
        })
    })
})
