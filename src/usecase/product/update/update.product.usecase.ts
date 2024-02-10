import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import {
  InputUpdateProductDto,
  OutputUpdateProductDto,
} from "./update.product.dto";
export default class UpdateProductUseCase {
  private productRepository: ProductRepositoryInterface;
  constructor(productRepository: ProductRepositoryInterface) {
    this.productRepository = productRepository;
  }

  async execute(
    input: InputUpdateProductDto
  ): Promise<OutputUpdateProductDto> {
    const product = await this.productRepository.find(input.id);

    await this.productRepository.update(product);

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      type: product.type
    };
  }
}
