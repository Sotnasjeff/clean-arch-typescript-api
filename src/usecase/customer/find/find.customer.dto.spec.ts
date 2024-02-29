import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infra/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infra/customer/repository/sequelize/customer.repository";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/entity/address";
import FindCustomerUseCase from "./find.customer.usecase";

describe("Test Find customer use case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });
  
      await sequelize.addModels([CustomerModel]);
      await sequelize.sync();
    });
  
    afterEach(async () => {
      await sequelize.close();
    });

    it("should find a customer", async () => {
        const customer = new Customer("123", "John");
        const address = new Address("Street", 123, "Zip", "City");
        customer.changeAddress(address);

        const customerRepository = new CustomerRepository();
        const usecase = new FindCustomerUseCase(customerRepository);
        await customerRepository.create(customer);

        const input = {
            id: "123"
        }

        const output = {
            id: "123",
            name: "John",
            address: {
                street: "Street",
                city: "city",
                number: 123,
                zip: "zip"
            }
        }

        const result = usecase.execute(input);

        expect(result).toBe(output);
    });
});