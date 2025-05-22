import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from '../services/products.service';
import {
  Product,
  ProductStatus,
} from '../../../domain/entities/product.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ProductsController', () => {
  let controller: ProductsController;
  let productsService: ProductsService;

  const mockProductsService = {
    create: jest.fn(),
    edit: jest.fn(),
    deactivate: jest.fn(),
    getProducts: jest.fn(),
  };

  const userId = 'user_123';
  const productId = 1;
  const productDbId = 'product_123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    const createProductDto = {
      productId: 1,
      name: 'Test Product',
      price: 100,
    };

    const mockUser = {
      sub: userId,
      email: 'test@test.com',
    };

    it('should create a product successfully', async () => {
      const expectedProduct = Product.fromData({
        id: productDbId,
        productId: createProductDto.productId,
        name: createProductDto.name,
        price: createProductDto.price,
        ownerId: userId,
        status: ProductStatus.ACTIVE,
      });

      mockProductsService.create.mockResolvedValue(expectedProduct);

      const result = await controller.createProduct(createProductDto, mockUser);

      expect(result).toEqual({
        id: productDbId,
        productId: createProductDto.productId,
        name: createProductDto.name,
        price: createProductDto.price,
        ownerId: userId,
        status: ProductStatus.ACTIVE,
      });

      expect(productsService.create).toHaveBeenCalledWith(
        createProductDto.productId,
        createProductDto.name,
        createProductDto.price,
        userId,
      );
    });

    it('should throw BadRequestException when service throws it', async () => {
      mockProductsService.create.mockRejectedValue(
        new BadRequestException('Invalid product'),
      );

      await expect(
        controller.createProduct(createProductDto, mockUser),
      ).rejects.toThrow(BadRequestException);

      expect(productsService.create).toHaveBeenCalledWith(
        createProductDto.productId,
        createProductDto.name,
        createProductDto.price,
        userId,
      );
    });
  });

  describe('editProduct', () => {
    const editProductDto = {
      name: 'Updated Product',
      price: 200,
    };

    const params = { id: productId };

    const mockUser = {
      sub: userId,
      email: 'test@test.com',
    };

    it('should edit a product successfully', async () => {
      const expectedProduct = Product.fromData({
        id: productDbId,
        productId,
        name: editProductDto.name,
        price: editProductDto.price,
        ownerId: userId,
        status: ProductStatus.ACTIVE,
      });

      mockProductsService.edit.mockResolvedValue(expectedProduct);

      const result = await controller.editProduct(
        params,
        editProductDto,
        mockUser,
      );

      expect(result).toEqual({
        id: productDbId,
        productId,
        name: editProductDto.name,
        price: editProductDto.price,
        ownerId: userId,
        status: ProductStatus.ACTIVE,
      });

      expect(productsService.edit).toHaveBeenCalledWith(
        productId,
        editProductDto.name,
        editProductDto.price,
        userId,
      );
    });

    it('should throw NotFoundException when service throws it', async () => {
      mockProductsService.edit.mockRejectedValue(
        new NotFoundException('Product not found'),
      );

      await expect(
        controller.editProduct(params, editProductDto, mockUser),
      ).rejects.toThrow(NotFoundException);

      expect(productsService.edit).toHaveBeenCalledWith(
        productId,
        editProductDto.name,
        editProductDto.price,
        userId,
      );
    });
  });

  describe('deactivateProduct', () => {
    const params = { id: productId };

    const mockUser = {
      sub: userId,
      email: 'test@test.com',
    };

    it('should deactivate a product successfully', async () => {
      const expectedProduct = Product.fromData({
        id: productDbId,
        productId,
        name: 'Test Product',
        price: 100,
        ownerId: userId,
        status: ProductStatus.INACTIVE,
      });

      mockProductsService.deactivate.mockResolvedValue(expectedProduct);

      const result = await controller.deactivateProduct(params, mockUser);

      expect(result).toEqual({
        id: productDbId,
        productId,
        name: 'Test Product',
        price: 100,
        ownerId: userId,
        status: ProductStatus.INACTIVE,
      });

      expect(productsService.deactivate).toHaveBeenCalledWith(
        productId,
        userId,
      );
    });

    it('should throw NotFoundException when service throws it', async () => {
      mockProductsService.deactivate.mockRejectedValue(
        new NotFoundException('Product not found'),
      );

      await expect(
        controller.deactivateProduct(params, mockUser),
      ).rejects.toThrow(NotFoundException);

      expect(productsService.deactivate).toHaveBeenCalledWith(
        productId,
        userId,
      );
    });
  });

  describe('getProducts', () => {
    const mockUser = {
      sub: userId,
      email: 'test@test.com',
    };

    const mockProducts = [
      Product.fromData({
        id: productDbId,
        productId: 1,
        name: 'Product 1',
        price: 100,
        ownerId: userId,
        status: ProductStatus.ACTIVE,
      }),
      Product.fromData({
        id: 'product_456',
        productId: 2,
        name: 'Product 2',
        price: 200,
        ownerId: userId,
        status: ProductStatus.ACTIVE,
      }),
    ];

    it('should return products list and total count', async () => {
      const page = 1;
      const limit = 10;
      const total = 2;

      mockProductsService.getProducts.mockResolvedValue({
        products: mockProducts,
        total,
      });

      const result = await controller.getProducts({ page, limit }, mockUser);

      expect(result).toEqual({
        products: mockProducts.map((product) => ({
          id: product.getProps().id,
          productId: product.getProps().productId,
          name: product.getProps().name,
          price: product.getProps().price,
          ownerId: product.getProps().ownerId,
          status: product.getProps().status,
        })),
        total,
        page,
        limit,
      });

      expect(productsService.getProducts).toHaveBeenCalledWith(
        page,
        limit,
        userId,
      );
    });

    it('should handle empty results', async () => {
      const page = 1;
      const limit = 10;
      const total = 0;

      mockProductsService.getProducts.mockResolvedValue({
        products: [],
        total,
      });

      const result = await controller.getProducts({ page, limit }, mockUser);

      expect(result).toEqual({
        products: [],
        total: 0,
        page,
        limit,
      });

      expect(productsService.getProducts).toHaveBeenCalledWith(
        page,
        limit,
        userId,
      );
    });
  });
});
