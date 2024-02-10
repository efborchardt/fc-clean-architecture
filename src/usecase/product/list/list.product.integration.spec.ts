import { Sequelize } from "sequelize-typescript";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ListProductUseCase from "./list.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";

let sequelize: Sequelize;

beforeEach(async () => {
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
});

afterEach(async () => {
    await sequelize.close();
});

const product1 = ProductFactory.create(
    "a",
    "Product 1",
    25.99
);

const product2 = ProductFactory.create(
    "b",
    "Product 1",
    25.99
);

describe("Integration test for listing product use case", () => {
    it("should list a product", async () => {
        const repository = new ProductRepository();

        await repository.create(product1);
        await repository.create(product2);

        const useCase = new ListProductUseCase(repository);

        const output = await useCase.execute({});

        expect(output.products.length).toBe(2);
        expect(output.products[0].id).toBe(product1.id);
        expect(output.products[0].name).toBe(product1.name);
        expect(output.products[0].type).toBe(product1.type);
        expect(output.products[1].id).toBe(product2.id);
        expect(output.products[1].name).toBe(product2.name);
        expect(output.products[1].type).toBe(product2.type);
    });
});
