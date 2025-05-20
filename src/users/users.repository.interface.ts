import { User } from "./user";

export abstract class IUsersRepository {
    abstract save(fullName: string, email: string, password: string): Promise<string>;
    abstract getByEmail(email: string): Promise<User>
}