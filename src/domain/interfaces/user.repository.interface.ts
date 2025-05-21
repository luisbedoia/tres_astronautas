import { User } from '../entities/user.entity';

export interface IUserRepository {
  save(user: User): Promise<string>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
