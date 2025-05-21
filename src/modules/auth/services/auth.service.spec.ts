import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  const fullName = 'Some Name';
  const password = 'somepassword';
  const hashedPassword = 'hashedPassword';
  const email = 'some@email.com';
  const expectedUserId = 'user_id';
  const expectedToken = 'token-123';

  let mockRepo: {
    findByEmail: jest.Mock;
    save: jest.Mock;
  };
  let mockCrypto: {
    hashPassword: jest.Mock;
    checkPassword: jest.Mock;
  };

  let mockJwt: { sign: jest.Mock };

  beforeEach(async () => {
    mockRepo = {
      findByEmail: jest.fn(),
      save: jest.fn(),
    };
    mockCrypto = {
      hashPassword: jest.fn(),
      checkPassword: jest.fn(),
    };
    mockJwt = {
      sign: jest.fn().mockReturnValue(expectedToken),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: 'IUserRepository', useValue: mockRepo },
        { provide: 'ICrypto', useValue: mockCrypto },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    describe('when parameters are valid', () => {
      describe('and email does NOT exist yet', () => {
        beforeEach(() => {
          mockRepo.findByEmail.mockResolvedValue(null);
          mockCrypto.hashPassword.mockResolvedValue(hashedPassword);
          mockRepo.save.mockResolvedValue(expectedUserId);
        });

        it('should hash the password, save the user and return the new id', async () => {
          const result = await service.register({ fullName, email, password });

          expect(mockRepo.findByEmail).toHaveBeenCalledTimes(1);
          expect(mockRepo.findByEmail).toHaveBeenCalledWith(email);

          expect(mockCrypto.hashPassword).toHaveBeenCalledTimes(1);
          expect(mockCrypto.hashPassword).toHaveBeenCalledWith(password);

          expect(mockRepo.save).toHaveBeenCalledTimes(1);
          expect(mockRepo.save).toHaveBeenCalledWith(
            fullName,
            email,
            hashedPassword,
          );

          expect(result).toContain(expectedUserId);
        });
      });

      describe('and email ALREADY exists', () => {
        beforeEach(() => {
          mockRepo.findByEmail.mockResolvedValue({
            id: 'x',
            email,
            password: 'foo',
            fullName,
          });
        });

        it('should throw a ConflictException and not hash or save', async () => {
          await expect(
            service.register({ fullName, email, password }),
          ).rejects.toThrow(ConflictException);

          expect(mockRepo.findByEmail).toHaveBeenCalledTimes(1);
          expect(mockCrypto.hashPassword).not.toHaveBeenCalled();
          expect(mockRepo.save).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('login', () => {
    describe('when credentials are valid', () => {
      beforeEach(() => {
        mockRepo.findByEmail.mockResolvedValue({
          id: expectedUserId,
          email,
          password: hashedPassword,
          fullName,
        });
        mockCrypto.checkPassword.mockResolvedValue(true);
      });

      it('should validate password and return an accessToken', async () => {
        const result = await service.login({ email, password });

        expect(mockRepo.findByEmail).toHaveBeenCalledTimes(1);
        expect(mockRepo.findByEmail).toHaveBeenCalledWith(email);

        expect(mockCrypto.checkPassword).toHaveBeenCalledTimes(1);
        expect(mockCrypto.checkPassword).toHaveBeenCalledWith(
          password,
          hashedPassword,
        );

        expect(result.accessToken).toBe(expectedToken);
      });
    });

    describe('when email does NOT exist', () => {
      beforeEach(() => {
        mockRepo.findByEmail.mockResolvedValue(null);
      });

      it('should throw an UnauthorizedException', async () => {
        await expect(service.login({ email, password })).rejects.toThrow(
          UnauthorizedException,
        );

        expect(mockRepo.findByEmail).toHaveBeenCalledTimes(1);
        expect(mockCrypto.checkPassword).not.toHaveBeenCalled();
      });
    });

    describe('when password is incorrect', () => {
      beforeEach(() => {
        mockRepo.findByEmail.mockResolvedValue({
          id: expectedUserId,
          email,
          password: hashedPassword,
          fullName,
        });
        mockCrypto.checkPassword.mockResolvedValue(false);
      });

      it('should throw an UnauthorizedException', async () => {
        await expect(service.login({ email, password })).rejects.toThrow(
          UnauthorizedException,
        );

        expect(mockRepo.findByEmail).toHaveBeenCalledTimes(1);
        expect(mockCrypto.checkPassword).toHaveBeenCalledTimes(1);
      });
    });
  });
});
