import { Op } from 'sequelize'
import { User } from '@/entities/User'
import { Product } from '@/entities/Product'
import { Order } from '@/entities/Order'
import { OrderProduct } from '@/entities/OrderProduct'
import type { OrdersQuery } from './files.types'

async function insertUser(id: number, name: string) {
    await User.findOrCreate({ where: { id }, defaults: { name } })
}

async function insertProduct(id: number) {
    await Product.findOrCreate({ where: { id } })
}

async function insertOrder(id: number, userId: number, date: string) {
    await Order.findOrCreate({
        where: { id },
        defaults: { user_id: userId, total: 0, date },
    })
}

async function insertOrderProduct(
    orderId: number,
    productId: number,
    value: string
) {
    await OrderProduct.create({
        order_id: orderId,
        product_id: productId,
        value,
    })
}

async function updateOrderTotals() {
    const orders = await Order.findAll()
    for (const order of orders) {
        const total = await OrderProduct.sum('value', {
            where: { order_id: order.id },
        })
        await Order.update({ total: total || 0 }, { where: { id: order.id } })
    }
}

async function getOrdersWithProducts({
    order_id,
    start_date,
    end_date,
}: OrdersQuery) {
    try {
        const where: any = {}
        if (order_id) where.id = order_id
        if (start_date || end_date) {
            where.date = {}
            if (start_date) where.date[Op.gte] = start_date
            if (end_date) where.date[Op.lte] = end_date
        }

        const orders = await Order.findAll({
            where,
            attributes: ['id', 'user_id', 'total', 'date'],
            order: [['user_id', 'ASC']],
        })

        const usersMap = new Map()

        for (const order of orders) {
            const userId = order.user_id

            if (!usersMap.has(userId)) {
                const user = await User.findByPk(userId, {
                    attributes: ['name'],
                })

                usersMap.set(userId, {
                    user_id: userId,
                    name: user?.name || `User ${userId}`,
                    orders: [],
                })
            }

            const orderProducts = await OrderProduct.findAll({
                where: { order_id: order.id },
                attributes: ['product_id', 'value'],
            })

            const orderToAdd = {
                order_id: order.id,
                total: order.total,
                date: order.date,
                products: orderProducts.map((op) => ({
                    product_id: op.product_id,
                    value: op.value,
                })),
            }

            usersMap.get(userId).orders.push(orderToAdd)
        }

        const data = Array.from(usersMap.values())
        return data
    } catch (error) {
        throw error
    }
}

const filesRepository = {
    insertUser,
    insertProduct,
    insertOrder,
    insertOrderProduct,
    updateOrderTotals,
    getOrdersWithProducts,
}

export default filesRepository
