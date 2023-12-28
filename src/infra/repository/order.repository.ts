import OrderModel from "../db/sequelize/model/order.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import Order from "../../domain/entity/order";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import OrderItem from "../../domain/entity/order_item";

export default class OrderRepository implements OrderRepositoryInterface  {
    async create(entity: Order): Promise<void> {
      await OrderModel.create(
        {
          id: entity.id,
          customer_id: entity.customerId,
          total: entity.total(),
          items: entity.items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            product_id: item.productId,
            quantity: item.quantity,
          })),
        },
        {
          include: [{ model: OrderItemModel }],
        }
      );
    }

    async update(entity: Order): Promise<void> {
        await OrderModel.update(
            {
                id: entity.id,
                customerId: entity.customerId,
                items: entity.items
            },
            {
                where: {
                    id: entity.id,
                },
            }
        );
    }

    async find(id: string): Promise<Order> {
        const orderModel = await OrderModel.findOne({ where: {id}})

        return new Order(
            orderModel.id,
            orderModel.customer_id,
            orderModel.items.map((items) => new OrderItem(
                items.id,
                items.name,
                items.price,
                items.product_id,
                items.quantity
            ))
        );
    }

    async findAll(): Promise<Order[]> {
        const orderModels = await OrderModel.findAll()
        return orderModels.map((orderModels) => new Order(
            orderModels.id,
            orderModels.customer_id,
            orderModels.items.map((items) => new OrderItem(
                items.id,
                items.name,
                items.price,
                items.product_id,
                items.quantity
            )),
        ))
    }
  }