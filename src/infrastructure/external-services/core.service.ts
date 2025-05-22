import { Injectable } from '@nestjs/common';
import { ICoreService } from '../../domain/interfaces/core.service.interface';
import { ValidateProductResponse } from '../../domain/interfaces/validate-product-response.interface';
import { CustomLogger } from '../logger/logger.service';

@Injectable()
export class CoreService implements ICoreService {
  constructor(private readonly logger: CustomLogger) {}

  validateProduct(productId: number, price: number): Promise<boolean> {
    try {
      const response = this.simulateHttpCall(price);
      return Promise.resolve(response.isValid);
    } catch (error) {
      this.logger.error(
        'Error validating product',
        error instanceof Error ? error.stack : 'Unknown error',
        'CoreService',
      );
      return Promise.resolve(false);
    }
  }

  private simulateHttpCall(price: number): ValidateProductResponse {
    const isValid = price > 10;
    if (!isValid) {
      this.logger.error('Price must be greater than 10', 'CoreService');
    }
    return {
      isValid,
      message: isValid
        ? 'Product validation successful'
        : 'Price must be greater than 10',
    };
  }
}
