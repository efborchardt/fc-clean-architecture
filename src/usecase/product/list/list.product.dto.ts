export interface InputListProductDto {}

type Product = {
  id: string;
  name: string;
  price: number;
  type: string;
};

export interface OutputListProductDto {
  products: Product[];
}
