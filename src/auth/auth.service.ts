import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../users/user.repository.interface';
import { ICrypto } from '../utils/crypto/crypto.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserRepository') private readonly userRepo: IUserRepository,
    @Inject('ICrypto') private readonly crypto: ICrypto,
    private readonly jwtService: JwtService
  ) {}

  async register(fullName: string, email: string, password: string) {
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(email);
    }
    const hashedPassword = await this.crypto.hashPassword(password);
    return await this.userRepo.save(fullName, email, hashedPassword);
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid Credentials');
    const valid = await this.crypto.checkPassword(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid Credentials');

    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
