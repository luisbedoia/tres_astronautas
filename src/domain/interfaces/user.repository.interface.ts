import { User } from '../entities/user.entity';

export interface IUserRepository {
    save(fullName: string, email: string, password: string): Promise<string>;
    findByEmail(email: string): Promise<User | null>;
} 