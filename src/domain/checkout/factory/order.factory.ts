import OrderItem from "../entity/order_item";
import Order from "../entity/order";

interface OrderFactoryProps {
    id: string;
    customerId: string;
    items: {
        id: string;
        name: string;
        productId: string;
        quantity: number;
        price: number;
    }[];
}

export default class OrderFactory {

    public static create(orderProps: OrderFactoryProps): Order {
        const items = orderProps.items.map( (items) => {
            return new OrderItem(
                items.id,
                items.name,
                items.price,
                items.productId,
                items.quantity
            )
        })

        return new Order(orderProps.id, orderProps.customerId, items)
    }
}