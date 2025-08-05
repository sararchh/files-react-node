import filesRepository from '@/modules/files/files.repository'
import { ILegacyLine, IUserOrders } from '@/modules/files/files.types'
import { fileProcessError } from '@/modules/files/files.errors'

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
        for (const line of lines) {
            const parsed = parseLine(line)
            if (!parsed.productId || parsed.productId === 0) {
                continue
            }
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
        console.log('🚀 ~ processFileUpload:', error)
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

        return rows
    } catch (error) {
        throw fileProcessError()
    }
}

const filesService = {
    processFileUpload,
    getNormalizedOrders,
}

export default filesService
