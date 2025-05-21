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
    hash: jest.Mock;
    compare: jest.Mock;
  };

  let mockJwt: { sign: jest.Mock };

  beforeEach(async () => {
    mockRepo = {
      findByEmail: jest.fn(),
      save: jest.fn(),
    };
    mockCrypto = {
      hash: jest.fn(),
      compare: jest.fn(),
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
          mockCrypto.hash.mockResolvedValue(hashedPassword);
          mockRepo.save.mockResolvedValue(expectedUserId);
        });

        it('should hash the password, save the user and return the new id', async () => {
          const result = await service.register({ fullName, email, password });

          expect(mockRepo.findByEmail).toHaveBeenCalledTimes(1);
          expect(mockRepo.findByEmail).toHaveBeenCalledWith(email);

          expect(mockCrypto.hash).toHaveBeenCalledTimes(1);
          expect(mockCrypto.hash).toHaveBeenCalledWith(password);

          expect(mockRepo.save).toHaveBeenCalledTimes(1);
          expect(mockRepo.save).toHaveBeenCalledWith(
            expect.objectContaining({
              fullName,
              email,
              password: hashedPassword,
            }),
          );

          expect(result.id).toContain(expectedUserId);
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
          expect(mockCrypto.hash).not.toHaveBeenCalled();
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
        mockCrypto.compare.mockResolvedValue(true);
      });

      it('should validate password and return an accessToken', async () => {
        const result = await service.login({ email, password });

        expect(mockRepo.findByEmail).toHaveBeenCalledTimes(1);
        expect(mockRepo.findByEmail).toHaveBeenCalledWith(email);

        expect(mockCrypto.compare).toHaveBeenCalledTimes(1);
        expect(mockCrypto.compare).toHaveBeenCalledWith(
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
        expect(mockCrypto.compare).not.toHaveBeenCalled();
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
        mockCrypto.compare.mockResolvedValue(false);
      });

      it('should throw an UnauthorizedException', async () => {
        await expect(service.login({ email, password })).rejects.toThrow(
          UnauthorizedException,
        );

        expect(mockRepo.findByEmail).toHaveBeenCalledTimes(1);
        expect(mockCrypto.compare).toHaveBeenCalledTimes(1);
      });
    });
  });
});
