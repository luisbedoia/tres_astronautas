import { ICoreService } from '../../domain/interfaces/core.service.interface';

interface ValidateProductResponse {
  isValid: boolean;
  message: string;
}

export class CoreService implements ICoreService {
  async validateProduct(productId: number, price: number): Promise<boolean> {
    try {
      const response = await this.simulateHttpCall(price);
      return response.isValid;
    } catch (error) {
      console.error('Error validating product:', error);
      return false;
    }
  }

  private async simulateHttpCall(
    price: number,
  ): Promise<ValidateProductResponse> {
    const isValid = price > 10;
    return await Promise.resolve({
      isValid,
      message: isValid
        ? 'Product validation successful'
        : 'Price must be greater than 10',
    });
  }
}
