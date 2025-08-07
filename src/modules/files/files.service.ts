import filesRepository from '@/modules/files/files.repository'
import {
    ILegacyLine,
    IUserOrders,
    OrdersQuery,
} from '@/modules/files/files.types'
import { fileProcessError } from './errors/files.errors'
import { orderNotFoundError } from './errors/order.error'

function parseLine(line: string): ILegacyLine {
    return {
        userId: Number(line.slice(0, 10)),
        userName: line.slice(10, 55).trim(),
        orderId: Number(line.slice(55, 65)),
        productId: Number(line.slice(65, 75)),
        value: Number(line.slice(75, 87)).toFixed(2),
        date: line.slice(87, 95).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'),
    }
}

async function processFileUpload(content: string) {
    try {
        const lines = content.split(/\r?\n/).filter(Boolean)
        const parsedLines = lines
            .map((line) => parseLine(line))
            .filter((parsed) => parsed.productId && parsed.productId !== 0)

        const uniqueUsers = new Map<number, { id: number; name: string }>()
        const uniqueProducts = new Set<number>()

        parsedLines.forEach((parsed) => {
            uniqueUsers.set(parsed.userId, {
                id: parsed.userId,
                name: parsed.userName,
            })
            uniqueProducts.add(parsed.productId)
        })

        await Promise.all([
            Promise.all(
                Array.from(uniqueUsers.values()).map((user) =>
                    filesRepository.insertUser(user.id, user.name)
                )
            ),
            Promise.all(
                Array.from(uniqueProducts).map((productId) =>
                    filesRepository.insertProduct(productId)
                )
            ),
        ])

        await Promise.all(
            parsedLines.map((parsed) =>
                Promise.all([
                    filesRepository.insertOrder(
                        parsed.orderId,
                        parsed.userId,
                        parsed.date
                    ),
                    filesRepository.insertOrderProduct(
                        parsed.orderId,
                        parsed.productId,
                        parsed.value
                    ),
                ])
            )
        )

        await filesRepository.updateOrderTotals()
    } catch (error) {
        throw fileProcessError()
    }
}

async function getNormalizedOrders({
    order_id,
    start_date,
    end_date,
}: OrdersQuery): Promise<IUserOrders[]> {
    try {
        const rows = await filesRepository.getOrdersWithProducts({
            order_id,
            start_date,
            end_date,
        })
        if (!rows || rows.length === 0) {
            throw orderNotFoundError(order_id)
        }
        return rows
    } catch (error) {
        throw error
    }
}

const filesService = {
    processFileUpload,
    getNormalizedOrders,
}

export default filesService
