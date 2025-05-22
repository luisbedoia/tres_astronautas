import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  Product,
  ProductStatus,
} from '../../../domain/entities/product.entity';
import { User } from '../../../domain/entities/user.entity';

describe('ProductsService', () => {
  let service: ProductsService;

  const productId = 1;
  const name = 'Test Product';
  const price = 100;
  const ownerId = 'user_123';
  const productDbId = 'product_123';

  let mockProductsRepo: {
    findByProductIdAndOwnerId: jest.Mock;
    save: jest.Mock;
  };
  let mockUsersRepo: {
    findById: jest.Mock;
  };
  let mockCoreService: {
    validateProduct: jest.Mock;
  };

  beforeEach(async () => {
    mockProductsRepo = {
      findByProductIdAndOwnerId: jest.fn(),
      save: jest.fn(),
    };
    mockUsersRepo = {
      findById: jest.fn(),
    };
    mockCoreService = {
      validateProduct: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: 'IProductsRepository', useValue: mockProductsRepo },
        { provide: 'IUsersRepository', useValue: mockUsersRepo },
        { provide: 'ICoreService', useValue: mockCoreService },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  describe('create', () => {
    describe('when parameters are valid', () => {
      describe('and product does NOT exist yet', () => {
        beforeEach(() => {
          mockUsersRepo.findById.mockResolvedValue(
            User.fromData({ id: ownerId, email: 'test@test.com' }),
          );
          mockProductsRepo.findByProductIdAndOwnerId.mockResolvedValue(null);
          mockCoreService.validateProduct.mockResolvedValue(true);
          mockProductsRepo.save.mockResolvedValue(productDbId);
        });

        it('should validate the product, save it and return the new product', async () => {
          const result = await service.create(productId, name, price, ownerId);

          expect(mockUsersRepo.findById).toHaveBeenCalledWith(ownerId);
          expect(
            mockProductsRepo.findByProductIdAndOwnerId,
          ).toHaveBeenCalledWith(productId, ownerId);
          expect(mockCoreService.validateProduct).toHaveBeenCalledWith(
            productId,
            price,
          );
          expect(mockProductsRepo.save).toHaveBeenCalledWith(
            expect.objectContaining({
              productId,
              name,
              price,
              ownerId,
            }),
          );

          expect(result.getProps()).toEqual(
            expect.objectContaining({
              id: productDbId,
              productId,
              name,
              price,
              ownerId,
              status: ProductStatus.ACTIVE,
            }),
          );
        });
      });

      describe('and product ALREADY exists', () => {
        beforeEach(() => {
          mockUsersRepo.findById.mockResolvedValue(
            User.fromData({ id: ownerId, email: 'test@test.com' }),
          );
          mockProductsRepo.findByProductIdAndOwnerId.mockResolvedValue(
            Product.fromData({
              id: productDbId,
              productId,
              name,
              price,
              ownerId,
            }),
          );
        });

        it('should throw a ConflictException', async () => {
          await expect(
            service.create(productId, name, price, ownerId),
          ).rejects.toThrow(ConflictException);

          expect(mockUsersRepo.findById).toHaveBeenCalledWith(ownerId);
          expect(
            mockProductsRepo.findByProductIdAndOwnerId,
          ).toHaveBeenCalledWith(productId, ownerId);
          expect(mockCoreService.validateProduct).not.toHaveBeenCalled();
          expect(mockProductsRepo.save).not.toHaveBeenCalled();
        });
      });

      describe('and product validation fails', () => {
        beforeEach(() => {
          mockUsersRepo.findById.mockResolvedValue(
            User.fromData({ id: ownerId, email: 'test@test.com' }),
          );
          mockProductsRepo.findByProductIdAndOwnerId.mockResolvedValue(null);
          mockCoreService.validateProduct.mockResolvedValue(false);
        });

        it('should throw a BadRequestException', async () => {
          await expect(
            service.create(productId, name, price, ownerId),
          ).rejects.toThrow(BadRequestException);

          expect(mockUsersRepo.findById).toHaveBeenCalledWith(ownerId);
          expect(
            mockProductsRepo.findByProductIdAndOwnerId,
          ).toHaveBeenCalledWith(productId, ownerId);
          expect(mockCoreService.validateProduct).toHaveBeenCalledWith(
            productId,
            price,
          );
          expect(mockProductsRepo.save).not.toHaveBeenCalled();
        });
      });
    });

    describe('when user does not exist', () => {
      beforeEach(() => {
        mockUsersRepo.findById.mockResolvedValue(null);
      });

      it('should throw an UnauthorizedException', async () => {
        await expect(
          service.create(productId, name, price, ownerId),
        ).rejects.toThrow(UnauthorizedException);

        expect(mockUsersRepo.findById).toHaveBeenCalledWith(ownerId);
        expect(
          mockProductsRepo.findByProductIdAndOwnerId,
        ).not.toHaveBeenCalled();
        expect(mockCoreService.validateProduct).not.toHaveBeenCalled();
        expect(mockProductsRepo.save).not.toHaveBeenCalled();
      });
    });
  });

  describe('edit', () => {
    describe('when product exists', () => {
      const existingProduct = Product.fromData({
        id: productDbId,
        productId,
        name,
        price,
        ownerId,
      });

      beforeEach(() => {
        mockProductsRepo.findByProductIdAndOwnerId.mockResolvedValue(
          existingProduct,
        );
      });

      describe('and validation passes', () => {
        const newName = 'Updated Product';
        const newPrice = 200;

        beforeEach(() => {
          mockCoreService.validateProduct.mockResolvedValue(true);
        });

        it('should update and return the product', async () => {
          const result = await service.edit(
            productId,
            newName,
            newPrice,
            ownerId,
          );

          expect(
            mockProductsRepo.findByProductIdAndOwnerId,
          ).toHaveBeenCalledWith(productId, ownerId);
          expect(mockCoreService.validateProduct).toHaveBeenCalledWith(
            productId,
            newPrice,
          );
          expect(mockProductsRepo.save).toHaveBeenCalledWith(
            expect.objectContaining({
              id: productDbId,
              productId,
              name: newName,
              price: newPrice,
              ownerId,
            }),
          );

          expect(result.getProps()).toEqual(
            expect.objectContaining({
              id: productDbId,
              productId,
              name: newName,
              price: newPrice,
              ownerId,
            }),
          );
        });
      });

      describe('and validation fails', () => {
        beforeEach(() => {
          mockCoreService.validateProduct.mockResolvedValue(false);
        });

        it('should throw a BadRequestException', async () => {
          await expect(
            service.edit(productId, 'New Name', 5, ownerId),
          ).rejects.toThrow(BadRequestException);

          expect(
            mockProductsRepo.findByProductIdAndOwnerId,
          ).toHaveBeenCalledWith(productId, ownerId);
          expect(mockCoreService.validateProduct).toHaveBeenCalledWith(
            productId,
            5,
          );
          expect(mockProductsRepo.save).not.toHaveBeenCalled();
        });
      });
    });

    describe('when product does not exist', () => {
      beforeEach(() => {
        mockProductsRepo.findByProductIdAndOwnerId.mockResolvedValue(null);
      });

      it('should throw a NotFoundException', async () => {
        await expect(
          service.edit(productId, 'New Name', 200, ownerId),
        ).rejects.toThrow(NotFoundException);

        expect(mockProductsRepo.findByProductIdAndOwnerId).toHaveBeenCalledWith(
          productId,
          ownerId,
        );
        expect(mockCoreService.validateProduct).not.toHaveBeenCalled();
        expect(mockProductsRepo.save).not.toHaveBeenCalled();
      });
    });
  });

  describe('deactivate', () => {
    describe('when product exists', () => {
      const existingProduct = Product.fromData({
        id: productDbId,
        productId,
        name,
        price,
        ownerId,
        status: ProductStatus.ACTIVE,
      });

      beforeEach(() => {
        mockProductsRepo.findByProductIdAndOwnerId.mockResolvedValue(
          existingProduct,
        );
      });

      it('should deactivate and return the product', async () => {
        const result = await service.deactivate(productId, ownerId);

        expect(mockProductsRepo.findByProductIdAndOwnerId).toHaveBeenCalledWith(
          productId,
          ownerId,
        );
        expect(mockProductsRepo.save).toHaveBeenCalledWith(
          expect.objectContaining({
            id: productDbId,
            productId,
            name,
            price,
            ownerId,
            status: ProductStatus.INACTIVE,
          }),
        );

        expect(result.getProps()).toEqual(
          expect.objectContaining({
            id: productDbId,
            productId,
            name,
            price,
            ownerId,
            status: ProductStatus.INACTIVE,
          }),
        );
      });
    });

    describe('when product does not exist', () => {
      beforeEach(() => {
        mockProductsRepo.findByProductIdAndOwnerId.mockResolvedValue(null);
      });

      it('should throw a NotFoundException', async () => {
        await expect(service.deactivate(productId, ownerId)).rejects.toThrow(
          NotFoundException,
        );

        expect(mockProductsRepo.findByProductIdAndOwnerId).toHaveBeenCalledWith(
          productId,
          ownerId,
        );
        expect(mockProductsRepo.save).not.toHaveBeenCalled();
      });
    });
  });
});
