import { Op, Sequelize } from 'sequelize'
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
        const orderConditions = []
        if (order_id) orderConditions.push(`o.id = ${order_id}`)
        if (start_date) orderConditions.push(`o.date >= '${start_date}'`)
        if (end_date) orderConditions.push(`o.date <= '${end_date}'`)

        const orderWhereClause =
            orderConditions.length > 0
                ? `AND ${orderConditions.join(' AND ')}`
                : ''

        const mainOrderConditions = []
        if (order_id) mainOrderConditions.push(`id = ${order_id}`)
        if (start_date) mainOrderConditions.push(`date >= '${start_date}'`)
        if (end_date) mainOrderConditions.push(`date <= '${end_date}'`)

        const users = await User.findAll({
            attributes: [
                'id',
                'name',
                [
                    Sequelize.literal(`
                        (SELECT JSON_ARRAYAGG(
                           JSON_OBJECT(
                             'order_id', o.id,
                             'total', o.total,
                             'date', o.date,
                             'products', (
                               SELECT JSON_ARRAYAGG(
                                 JSON_OBJECT(
                                   'product_id', op.product_id,
                                   'value', op.value
                                 )
                               )
                               FROM order_products op
                               WHERE op.order_id = o.id
                             )
                           )
                         )
                         FROM orders o
                         WHERE o.user_id = User.id ${orderWhereClause})
                    `),
                    'orders',
                ],
            ],
            where: {
                id: {
                    [Op.in]: Sequelize.literal(`
                        (SELECT DISTINCT user_id FROM orders ${
                            mainOrderConditions.length > 0
                                ? `WHERE ${mainOrderConditions.join(' AND ')}`
                                : ''
                        })
                    `),
                },
            },
            order: [['id', 'ASC']],
        })

        const data = users.map((user: any) => {
            let orders = user.orders || []

            if (typeof orders === 'string') {
                try {
                    orders = JSON.parse(orders)
                } catch (e) {
                    orders = []
                }
            }

            if (!Array.isArray(orders)) {
                orders = []
            }

            return {
                user_id: user.id,
                name: user.name,
                orders,
            }
        })

        return data
    } catch (error) {
        console.log('🚀 ~ getOrdersWithProducts ~ error:', error)
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
