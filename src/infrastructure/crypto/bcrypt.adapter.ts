import { Injectable } from '@nestjs/common';
import { ICrypto } from '../../domain/interfaces/crypto.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptAdapter implements ICrypto {
  private readonly saltRounds = 10;

  async hash(data: string): Promise<string> {
    return bcrypt.hash(data, this.saltRounds);
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
