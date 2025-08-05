import filesRepository from '@/modules/files/files.repository'
import { ILegacyLine, IUserOrders } from '@/modules/files/files.types'

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

import { fileProcessError } from '@/modules/files/files.errors'

async function processFileUpload(content: string) {
    try {
        const lines = content.split(/\r?\n/).filter(Boolean)
        for (const line of lines) {
            const parsed = parseLine(line)
            await filesRepository.insertUser(parsed.userId, parsed.userName)
            await filesRepository.insertProduct(parsed.productId)
            await filesRepository.insertOrder(
                parsed.orderId,
                parsed.userId,
                parsed.date
            )
            await filesRepository.insertOrderProduct(
                parsed.orderId,
                parsed.productId,
                parsed.value
            )
        }
        await filesRepository.updateOrderTotals()
    } catch (error) {
        throw fileProcessError()
    }
}

async function getNormalizedOrders({
    order_id,
    start_date,
    end_date,
}: any): Promise<IUserOrders[]> {
    try {
        const rows = await filesRepository.getOrdersWithProducts({
            order_id,
            start_date,
            end_date,
        })
        const users: Record<number, IUserOrders> = {}
        for (const row of rows) {
            if (!users[row.user_id]) {
                users[row.user_id] = {
                    user_id: row.user_id,
                    name: row.name,
                    orders: [],
                }
            }
            let order = users[row.user_id].orders.find(
                (o) => o.order_id === row.order_id
            )
            if (!order) {
                order = {
                    order_id: row.order_id,
                    total: Number(row.total).toFixed(2),
                    date: row.date,
                    products: [],
                }
                users[row.user_id].orders.push(order)
            }
            order.products.push({
                product_id: row.product_id,
                value: Number(row.value).toFixed(2),
            })
        }
        return Object.values(users)
    } catch (error) {
        throw fileProcessError()
    }
}

const filesService = {
    processFileUpload,
    getNormalizedOrders,
}

export default filesService
