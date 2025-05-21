export class User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
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

  static fromData(data: User): User {
    return new User({
      id: data.id,
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
