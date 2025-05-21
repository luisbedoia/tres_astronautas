import { User } from '../entities/user.entity';

export interface IUsersRepository {
  save(user: User): Promise<string>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
