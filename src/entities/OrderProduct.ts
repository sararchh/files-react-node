import {
    Table,
    Model,
    Column,
    DataType,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript'
import { Order } from './Order'
import { Product } from './Product'

@Table({ tableName: 'order_products', timestamps: false })
export class OrderProduct extends Model {
    @ForeignKey(() => Order)
    @Column({ type: DataType.INTEGER, allowNull: false })
    order_id!: number

    @ForeignKey(() => Product)
    @Column({ type: DataType.INTEGER, allowNull: false })
    product_id!: number

    @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
    value!: number

    @BelongsTo(() => Product)
    product!: Product
}
