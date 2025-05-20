import { Injectable } from '@nestjs/common';

@Injectable()
export class ProducsService {
  createProduct(): string[] {
    return ['product1', 'product2', 'product3'];
  }
}
