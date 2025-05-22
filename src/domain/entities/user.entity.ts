export interface UserProps {
  id?: string;
  fullName?: string;
  email?: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export class User {
  private id: string;
  private fullName: string;
  private email: string;
  private password: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(partial: UserProps) {
    this.id = partial.id ?? '';
    this.fullName = partial.fullName ?? '';
    this.email = partial.email ?? '';
    this.password = partial.password ?? '';
    this.createdAt = partial.createdAt ?? new Date();
    this.updatedAt = partial.updatedAt ?? new Date();
  }

  static create(fullName: string, email: string, password: string): User {
    return new User({
      id: '',
      fullName,
      email,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromData(data: UserProps): User {
    return new User({
      id: data.id,
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  public getProps(): UserProps {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
