export interface ICoreService {
  validateProduct(productId: number, price: number): Promise<boolean>;
}
