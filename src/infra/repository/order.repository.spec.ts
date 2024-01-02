import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../db/sequelize/model/customer.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import ProductRepository from "./product.repository";
import Product from "../../domain/entity/product";
import OrderItem from "../../domain/entity/order_item";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import Order from "../../domain/entity/order";
import OrderRepository from "./order.repository";
import OrderModel from "../db/sequelize/model/order.model";


describe("Order repository test", () => {
    let sequelize: Sequelize;
  
    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });
  
      await sequelize.addModels([
        CustomerModel,
        OrderModel,
        OrderItemModel,
        ProductModel,
      ]);
      await sequelize.sync();
    });
  
    afterEach(async () => {
      await sequelize.close();
    });
  
    it("should create a new order", async () => {
      const customerRepository = new CustomerRepository();
      const customer = new Customer("123", "Customer 1");
      const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
      customer.changeAddress(address);
      await customerRepository.create(customer);
  
      const productRepository = new ProductRepository();
      const product = new Product("123", "Product 1", 10);
      await productRepository.create(product);
  
      const orderItem = new OrderItem(
        "1",
        product.name,
        product.price,
        product.id,
        2
      );
  
      const order = new Order("123", "123", [orderItem]);
  
      const orderRepository = new OrderRepository();
      await orderRepository.create(order);
  
      const orderModel = await OrderModel.findOne({
        where: { id: order.id },
        include: ["items"],
      });
  
      expect(orderModel.toJSON()).toStrictEqual({
        id: "123",
        customer_id: "123",
        total: order.total(),
        items: [
          {
            id: orderItem.id,
            name: orderItem.name,
            price: orderItem.price,
            quantity: orderItem.quantity,
            order_id: "123",
            product_id: "123",
          },
        ],
      });
    });

    it("should update an order", async() => {
      const customerRepository = new CustomerRepository();
      const customer = new Customer("123", "Customer 1");
      const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
      customer.changeAddress(address);
      await customerRepository.create(customer);
  
      const productRepository = new ProductRepository();
      const product = new Product("123", "Product 1", 10);
      await productRepository.create(product);
  
      const orderItem = new OrderItem(
        "1",
        product.name,
        product.price,
        product.id,
        2
      );
  
      let order = new Order("123", "123", [orderItem]);
  
      const orderRepository = new OrderRepository();
      await orderRepository.create(order);
  
      let orderModel = await OrderModel.findOne({
        where: { id: order.id },
        include: ["items"],
      });
  
      expect(orderModel.toJSON()).toStrictEqual({
        id: "123",
        customer_id: "123",
        total: order.total(),
        items: [
          {
            id: orderItem.id,
            name: orderItem.name,
            price: orderItem.price,
            quantity: orderItem.quantity,
            order_id: "123",
            product_id: "123",
          },
        ],
      });

      const product2 = new Product("536", "Boneca de pano", 10);
      await productRepository.create(product2);

      const orderItem2 = new OrderItem(
        "2",
        product2.name,
        product2.price,
        product2.id,
        1
      );

      order = new Order("123", "123", [orderItem, orderItem2]);

      await orderRepository.update(order);

      orderModel = await OrderModel.findOne({
        where: { id: order.id },
        include: ["items"],
      });
  
      expect(orderModel.toJSON()).toStrictEqual({
        id: "123",
        customer_id: "123",
        total: order.total(),
        items: [
          {
            id: orderItem.id,
            name: orderItem.name,
            price: orderItem.price,
            quantity: orderItem.quantity,
            order_id: "123",
            product_id: "123",
          },
          {
            id: orderItem2.id,
            name: orderItem2.name,
            price: orderItem2.price,
            quantity: orderItem2.quantity,
            order_id: "123",
            product_id: "536"
          }
        ],
      });

    })
  });