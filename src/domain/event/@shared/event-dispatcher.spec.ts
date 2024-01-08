import Address from "../../entity/address";
import Customer from "../../entity/customer";
import CustomerAddressChangedEvent from "../customer/customer-address-changed.event";
import CustomerCreatedEvent from "../customer/customer-created.event";
import SendMessageWhenAddressHasChanged from "../customer/handler/send-message-when-address-has-changed.handler";
import SendMessageWhenCustomerIsCreated from "../customer/handler/send-message-when-customer-is-created.handler";
import SendSecondMessageWhenCustomerIsCreated from "../customer/handler/send-second-message-when-customer-is-created.handler";
import SendEmailWhenProductIsCreatedHandler from "../product/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../product/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain Events tests", () => {

    it("should register an event handler for Product aggregate", ()=> {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler)

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1)
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler)
    });

    it("should register an event handler for Customer aggregate", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendMessageWhenCustomerIsCreated();
        const eventHandler2 = new SendSecondMessageWhenCustomerIsCreated();
        const eventHandler3 = new SendMessageWhenAddressHasChanged();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler)
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2)
        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler3)

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler)
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2)
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]).toMatchObject(eventHandler3)
    }) 

    it("should unregister an event handler for Product Aggregate", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler)

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler)

        eventDispatcher.unregister("ProductCreatedEvent", eventHandler)

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0)
    });

    it("should unregister an event handler for Customer Aggregate", ()=>{
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendMessageWhenCustomerIsCreated();
        const eventHandler2 = new SendSecondMessageWhenCustomerIsCreated();
        const eventHandler3 = new SendMessageWhenAddressHasChanged();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler)
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2)
        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler3)

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler)
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2)
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]).toMatchObject(eventHandler3)

        eventDispatcher.unregister("CustomerCreatedEvent", eventHandler)
        eventDispatcher.unregister("CustomerCreatedEvent", eventHandler2)
        eventDispatcher.unregister("CustomerAddressChangedEvent", eventHandler3)

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(0)
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"].length).toBe(0)
    })

    it("should unregister all event handlers of Product Agreggate", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler)
        
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler)

        eventDispatcher.unregisterAll()

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();

    });

    it("should unregister all event handlers of Customer Aggregate", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendMessageWhenCustomerIsCreated();
        const eventHandler2 = new SendSecondMessageWhenCustomerIsCreated();
        const eventHandler3 = new SendMessageWhenAddressHasChanged();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler)
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2)
        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler3)

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler)
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2)
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]).toMatchObject(eventHandler3)

        eventDispatcher.unregisterAll()

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeUndefined();
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"]).toBeUndefined();
    })

    it("should notify all event handlers for Product Aggregate", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle")

        eventDispatcher.register("ProductCreatedEvent", eventHandler)
        
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler)

        const productCreatedEvent = new ProductCreatedEvent({
            name: "Product 1",
            description: "Product 1 Description",
            price: 10.0
        });

        eventDispatcher.notify(productCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    })

    it("should notify all event handlers for Customer Aggregate", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendMessageWhenCustomerIsCreated();
        const eventHandler2 = new SendSecondMessageWhenCustomerIsCreated();
        const eventHandler3 = new SendMessageWhenAddressHasChanged();
        const spyEventHandler = jest.spyOn(eventHandler, "handle")
        const spyEventHandler2 = jest.spyOn(eventHandler2, "handle")
        const spyEventHandler3 = jest.spyOn(eventHandler3, "handle")

        eventDispatcher.register("CustomerCreatedEvent", eventHandler)
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2)
        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler3)

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler)
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2)
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]).toMatchObject(eventHandler3)

        const customer  = new Customer("1", "Customer 1")
        customer.Address = new Address("Rua Jacaré", 123, "000000-000", "Jacarélandia")

        const customerCreatedEvent = new CustomerCreatedEvent({
            id: customer.id,
            name: customer.name,
            street: customer.Address.street,
            number: customer.Address.number,
            zip: customer.Address.zip,
            city: customer.Address.city,
        })

        eventDispatcher.notify(customerCreatedEvent)

        expect(spyEventHandler).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();

        const newAddress = new Address("Avenida Girafa", 555, "1111111", "Girafópolis")

        customer.changeAddress(newAddress)

        const customerAddressChanged = new CustomerAddressChangedEvent({
            id: customer.id,
            name: customer.name,
            address: customer.Address
        });

        eventDispatcher.notify(customerAddressChanged);

        expect(spyEventHandler3).toHaveBeenCalledWith(customerAddressChanged);
        expect(spyEventHandler3).toHaveBeenCalled();
    })
})