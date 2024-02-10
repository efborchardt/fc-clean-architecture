import { Sequelize } from "sequelize-typescript";
import ProductFactory from "../../../domain/product/factory/product.factory";
import UpdateProductUseCase from "./update.product.usecase";
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

const product = ProductFactory.create("a", "Product", 25.99);

const input = {
    id: product.id,
    name: "Product",
    price: 25.99,
    type: "a"
};

describe("Integration test for product update use case", () => {
    it("should update a product", async () => {
        const productRepository = new ProductRepository();

        productRepository.create(product);

        const productUpdateUseCase = new UpdateProductUseCase(productRepository);

        const output = await productUpdateUseCase.execute(input);

        expect(output).toEqual(input);
    });
});
