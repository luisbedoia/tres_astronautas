import {
  Injectable,
  UnauthorizedException,
  Inject,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUsersRepository } from '../../../domain/interfaces/users.repository.interface';
import { ICrypto } from '../../../domain/interfaces/crypto.interface';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { User } from '../../../domain/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUsersRepository')
    private readonly usersRepository: IUsersRepository,
    @Inject('ICrypto') private readonly crypto: ICrypto,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersRepository.findByEmail(registerDto.email);
    if (user) {
      throw new ConflictException([
        `email: ${registerDto.email} already exists`,
      ]);
    }

    const hashedPassword = await this.crypto.hash(registerDto.password);
    const newUser = User.create(
      registerDto.fullName,
      registerDto.email,
      hashedPassword,
    );

    const userId = await this.usersRepository.save(newUser);

    return { id: userId };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException(['Invalid credentials']);
    }

    const { id, password, email } = user.getProps();

    const isPasswordValid = await this.crypto.compare(
      loginDto.password,
      password!,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(['Invalid credentials']);
    }

    const payload = { sub: id!, email: email! };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
