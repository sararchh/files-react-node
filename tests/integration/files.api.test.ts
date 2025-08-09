import request from 'supertest'
import { createTestApp } from '../helpers/app.helper'
import filesRepository from '../../src/modules/files/files.repository'
import fs from 'fs/promises'
import path from 'path'

jest.mock('../../src/modules/files/files.repository')

const mockedFilesRepository = filesRepository as jest.Mocked<
    typeof filesRepository
>

const app = createTestApp()

const cleanupUploadedFiles = async (): Promise<void> => {
    const uploadDir = path.resolve(__dirname, '..', '..', 'public', 'upload')
    try {
        const files = await fs.readdir(uploadDir)
        const deletePromises = files
            .filter((file) => file !== '_blank')
            .map(async (file) => {
                try {
                    await fs.unlink(path.join(uploadDir, file))
                } catch (error) {}
            })
        await Promise.allSettled(deletePromises)
    } catch (error) {}
}

describe('Files API Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    afterEach(async () => {
        await cleanupUploadedFiles()
    })

    describe('POST /api/v1/upload', () => {
        it('should upload file successfully', async () => {
            const fileContent = `0000000070                                     Palmer Prosacco00000007530000000003     947.19720210308`

            mockedFilesRepository.insertUser.mockResolvedValue(undefined)
            mockedFilesRepository.insertProduct.mockResolvedValue(undefined)
            mockedFilesRepository.insertOrder.mockResolvedValue(undefined)
            mockedFilesRepository.insertOrderProduct.mockResolvedValue(
                undefined
            )
            mockedFilesRepository.updateOrderTotals.mockResolvedValue(undefined)

            const response = await request(app)
                .post('/api/v1/upload')
                .attach('file', Buffer.from(fileContent), 'test.txt')
                .expect(200)

            expect(response.body).toEqual({
                message: 'File processed successfully',
            })
        })

        it('should return 401 error when file is not provided', async () => {
            const response = await request(app)
                .post('/api/v1/upload')
                .expect(401)

            expect(response.body).toHaveProperty('name')
            expect(response.body).toHaveProperty('message')
        })

        it('should return 400 error when processing fails', async () => {
            const fileContent = `0000000070                                     Palmer Prosacco00000007530000000003     947.19720210308`

            mockedFilesRepository.insertUser.mockResolvedValue(undefined)
            mockedFilesRepository.insertProduct.mockResolvedValue(undefined)
            mockedFilesRepository.insertOrder.mockResolvedValue(undefined)
            mockedFilesRepository.insertOrderProduct.mockResolvedValue(
                undefined
            )
            mockedFilesRepository.updateOrderTotals.mockRejectedValue(
                new Error('DB Error')
            )

            const response = await request(app)
                .post('/api/v1/upload')
                .attach('file', Buffer.from(fileContent), 'test.txt')
                .expect(400)

            expect(response.body).toHaveProperty('name')
            expect(response.body).toHaveProperty('message')
        })
    })

    describe('GET /api/v1/orders', () => {
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

            const response = await request(app)
                .get('/api/v1/orders')
                .query({
                    order_id: 123,
                    start_date: '2021-03-01',
                    end_date: '2021-03-31',
                })
                .expect(200)

            expect(response.body).toEqual(mockOrders)
        })

        it('should return 400 error when no orders are found', async () => {
            mockedFilesRepository.getOrdersWithProducts.mockResolvedValue([])

            const response = await request(app)
                .get('/api/v1/orders')
                .query({
                    order_id: 999,
                })
                .expect(400)

            expect(response.body).toHaveProperty('name')
            expect(response.body).toHaveProperty('message')
        })

        it('should validate required query parameters', async () => {
            mockedFilesRepository.getOrdersWithProducts.mockResolvedValue([])

            const response = await request(app)
                .get('/api/v1/orders')
                .expect(400)

            expect(response.body).toHaveProperty('name')
            expect(response.body).toHaveProperty('message')
        })

        it('should validate date format', async () => {
            const response = await request(app)
                .get('/api/v1/orders')
                .query({
                    start_date: 'invalid-date',
                    end_date: '2021-03-31',
                })
                .expect(422)

            expect(response.body).toHaveProperty('message')
        })

        it('should allow search by order_id only', async () => {
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

            const response = await request(app)
                .get('/api/v1/orders')
                .query({
                    order_id: 123,
                })
                .expect(200)

            expect(response.body).toEqual(mockOrders)
        })

        it('should allow search by date range', async () => {
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

            const response = await request(app)
                .get('/api/v1/orders')
                .query({
                    start_date: '2021-03-01',
                    end_date: '2021-03-31',
                })
                .expect(200)

            expect(response.body).toEqual(mockOrders)
        })
    })
})
