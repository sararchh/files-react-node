import { initDb } from '../database/init'

async function insertUser(id: number, name: string) {
    const db = await initDb()
    await db.run('INSERT OR IGNORE INTO users (id, name) VALUES (?, ?)', [
        id,
        name,
    ])
}

async function insertProduct(id: number) {
    const db = await initDb()
    await db.run('INSERT OR IGNORE INTO products (id) VALUES (?)', [id])
}

async function insertOrder(id: number, userId: number, date: string) {
    const db = await initDb()
    await db.run(
        'INSERT OR IGNORE INTO orders (id, user_id, total, date) VALUES (?, ?, 0, ?)',
        [id, userId, date]
    )
}

async function insertOrderProduct(
    orderId: number,
    productId: number,
    value: string
) {
    const db = await initDb()
    await db.run(
        'INSERT INTO order_products (order_id, product_id, value) VALUES (?, ?, ?)',
        [orderId, productId, value]
    )
}

async function updateOrderTotals() {
    const db = await initDb()
    await db.run(`UPDATE orders SET total = (
        SELECT SUM(value) FROM order_products WHERE order_products.order_id = orders.id
    )`)
}

async function getOrdersWithProducts({ order_id, start_date, end_date }: any) {
    const db = await initDb()
    let query = `SELECT o.id as order_id, o.user_id, o.total, o.date, u.name,
    op.product_id, op.value
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN order_products op ON op.order_id = o.id
    WHERE 1=1`
    const params: any[] = []
    if (order_id) {
        query += ' AND o.id = ?'
        params.push(order_id)
    }
    if (start_date) {
        query += ' AND o.date >= ?'
        params.push(start_date)
    }
    if (end_date) {
        query += ' AND o.date <= ?'
        params.push(end_date)
    }
    return db.all(query, params)
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
