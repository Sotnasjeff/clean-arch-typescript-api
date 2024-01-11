import Address from "../entity/address";
import CustomerFactory from "./customer.factory";

describe("Customer Factory Unit Test", ()=> {
    it("should create a customer", ()=> {
        let customer = CustomerFactory.create("Customer 1");

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("Customer 1")
        expect(customer.address).toBeUndefined();

    })

    it("should create a customer with address", ()=> {
        const address = new Address("Whatever", 123, "06365999", "Paulo São") 
        let customer = CustomerFactory.createWithAddress("Customer 1", address);
    

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("Customer 1")
        expect(customer.address).toBe(address);

    })
})