import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export async function initDb() {
    const db = await open({
        filename: './db.sqlite',
        driver: sqlite3.Database,
    })

    await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY,
      user_id INTEGER NOT NULL,
      total DECIMAL(12,2) NOT NULL,
      date TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY
    );
    CREATE TABLE IF NOT EXISTS order_products (
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      value DECIMAL(12,2) NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    );
  `)

    return db
}
