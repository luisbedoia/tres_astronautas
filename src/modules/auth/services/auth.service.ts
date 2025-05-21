import {
  Injectable,
  UnauthorizedException,
  Inject,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../../../domain/interfaces/user.repository.interface';
import { ICrypto } from '../../../domain/interfaces/crypto.interface';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { User } from '../../../domain/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('ICrypto') private readonly crypto: ICrypto,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.userRepository.findByEmail(registerDto.email);
    if (user) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await this.crypto.hash(registerDto.password);
    const newUser = User.create(
      registerDto.fullName,
      registerDto.email,
      hashedPassword,
    );

    const userId = await this.userRepository.save(newUser);

    return { id: userId };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.crypto.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
