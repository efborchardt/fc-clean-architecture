import { Sequelize } from "sequelize-typescript";
import CreateProductUseCase from "./create.product.usecase";
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

const input = {
    name: "Test Product",
    price: 25.99,
    type: "a"
};

describe("Integration test create product use case", () => {
    it("should create a product", async () => {
        const productRepository = new ProductRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        const output = await productCreateUseCase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price
        });
    });

    it("should thrown an error when name is missing", async () => {
        const productRepository = new ProductRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        input.name = "";

        await expect(productCreateUseCase.execute(input)).rejects.toThrow(
            "Name is required"
        );
    });

    it("should return an error when the price is less than zero", async () => {
        const productRepository = new ProductRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        input.name = "Test Product";
        input.price = -20;

        await expect(productCreateUseCase.execute(input)).rejects.toThrow(
            "Price must be greater than zero"
        );
    });

    it("should return an error when Product type not supported", async () => {
        const productRepository = new ProductRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        input.type = "not supported type"

        await expect(productCreateUseCase.execute(input)).rejects.toThrow(
            "Product type not supported"
        );
    });
});
