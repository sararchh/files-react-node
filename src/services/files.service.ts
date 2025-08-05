import filesRepository from '../repositories/files.repository'

interface LegacyLine {
    userId: number
    userName: string
    orderId: number
    productId: number
    value: string
    date: string
}

function parseLine(line: string): LegacyLine {
    return {
        userId: Number(line.slice(0, 10)),
        userName: line.slice(10, 55).trim(),
        orderId: Number(line.slice(55, 65)),
        productId: Number(line.slice(65, 75)),
        value: (Number(line.slice(75, 87)) / 100).toFixed(2),
        date: line.slice(87, 95).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'),
    }
}

async function processFileUpload(content: string) {
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
}

async function getNormalizedOrders({ order_id, start_date, end_date }: any) {
    const rows = await filesRepository.getOrdersWithProducts({
        order_id,
        start_date,
        end_date,
    })
    const users: any = {}
    for (const row of rows) {
        if (!users[row.user_id]) {
            users[row.user_id] = {
                user_id: row.user_id,
                name: row.name,
                orders: [],
            }
        }
        let order = users[row.user_id].orders.find(
            (o: any) => o.order_id === row.order_id
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
}

const filesService = {
    processFileUpload,
    getNormalizedOrders,
}

export default filesService
