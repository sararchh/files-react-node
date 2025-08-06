import {
    Table,
    Model,
    Column,
    DataType,
    PrimaryKey,
    AutoIncrement,
    ForeignKey,
    BelongsTo,
    HasMany,
} from 'sequelize-typescript'
import { User } from './User'
import { OrderProduct } from './OrderProduct'

@Table({ tableName: 'orders', timestamps: false })
export class Order extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    user_id!: number

    @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
    total!: number

    @Column({ type: DataType.STRING, allowNull: false })
    date!: string

    @BelongsTo(() => User)
    user!: User

    @HasMany(() => OrderProduct)
    order_products!: OrderProduct[]
}
