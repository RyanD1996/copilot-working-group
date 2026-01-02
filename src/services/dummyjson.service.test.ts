import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { dummyJSONService } from './dummyjson.service';
import type { ProductsResponse, Product } from '../types/product';

const BASE_URL = 'https://dummyjson.com';

// MSW server (black-box: intercept real network to dummyjson.com)
const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('DummyJSONService (black-box via MSW)', () => {
  it('getProducts returns a ProductsResponse', async () => {
    const mock: ProductsResponse = {
      products: [
        {
          id: 1,
          title: 'Phone',
          description: 'A smart phone',
          category: 'smartphones',
          price: 799,
          rating: 4.5,
          stock: 10,
          brand: 'BrandX',
          availabilityStatus: 'In Stock',
          returnPolicy: '30 days',
          thumbnail: 'https://example.com/thumb.jpg',
          images: ['https://example.com/image1.jpg'],
        },
      ],
      total: 1,
      skip: 0,
      limit: 30,
    };

    server.use(
      http.get(`${BASE_URL}/products`, ({ request }) => {
        const url = new URL(request.url);
        const limit = url.searchParams.get('limit');
        const skip = url.searchParams.get('skip');
        // Optional: verify query params are forwarded
        expect(limit).toBeDefined();
        expect(skip).toBeDefined();
        return HttpResponse.json(mock, { status: 200 });
      }),
    );

    const res = await dummyJSONService.getProducts(30, 0);
    expect(res).toEqual(mock);
    expect(res.products).toHaveLength(1);
  });

  it('getProducts throws on non-OK responses', async () => {
    server.use(
      http.get(`${BASE_URL}/products`, () =>
        HttpResponse.text('Server error', { status: 500 }),
      ),
    );

    await expect(dummyJSONService.getProducts(10, 0)).rejects.toThrow(
      'Failed to fetch products',
    );
  });

  it('getProduct returns a Product', async () => {
    const productId = 123;
    const mock: Product = {
      id: productId,
      title: 'Laptop',
      description: 'A fast laptop',
      category: 'laptops',
      price: 1299,
      rating: 4.7,
      stock: 5,
      brand: 'BrandY',
      availabilityStatus: 'In Stock',
      returnPolicy: '30 days',
      thumbnail: 'https://example.com/laptop-thumb.jpg',
      images: ['https://example.com/laptop1.jpg'],
    };

    server.use(
      http.get(`${BASE_URL}/products/${productId}`, () =>
        HttpResponse.json(mock, { status: 200 }),
      ),
    );

    const res = await dummyJSONService.getProduct(productId);
    expect(res).toEqual(mock);
    expect(res.id).toBe(productId);
  });

  it('getProduct throws on non-OK responses', async () => {
    const productId = 404;

    server.use(
      http.get(`${BASE_URL}/products/${productId}`, () =>
        HttpResponse.text('Not found', { status: 404 }),
      ),
    );

    await expect(dummyJSONService.getProduct(productId)).rejects.toThrow(
      `Failed to fetch product ${productId}`,
    );
  });

  it('getCategories returns category list', async () => {
    const mock = ['smartphones', 'laptops', 'fragrances'];

    server.use(
      http.get(`${BASE_URL}/products/category-list`, () =>
        HttpResponse.json(mock, { status: 200 }),
      ),
    );

    const res = await dummyJSONService.getCategories();
    expect(res).toEqual(mock);
    expect(Array.isArray(res)).toBe(true);
  });

  it('getCategories throws on non-OK responses', async () => {
    server.use(
      http.get(`${BASE_URL}/products/category-list`, () =>
        HttpResponse.text('Server error', { status: 500 }),
      ),
    );

    await expect(dummyJSONService.getCategories()).rejects.toThrow(
      'Failed to fetch categories',
    );
  });

  it('getProductsByCategory returns ProductsResponse', async () => {
    const category = 'laptops';
    const mock: ProductsResponse = {
      products: [
        {
          id: 2,
          title: 'Laptop Pro',
          description: 'High-end laptop',
          category,
          price: 2199,
          rating: 4.8,
          stock: 3,
          brand: 'BrandZ',
          availabilityStatus: 'Limited',
          returnPolicy: '14 days',
          thumbnail: 'https://example.com/laptop-pro-thumb.jpg',
          images: ['https://example.com/laptop-pro1.jpg'],
        },
      ],
      total: 1,
      skip: 0,
      limit: 30,
    };

    server.use(
      http.get(`${BASE_URL}/products/category/:category`, ({ params }) => {
        expect(params.category).toBe(category);
        return HttpResponse.json(mock, { status: 200 });
      }),
    );

    const res = await dummyJSONService.getProductsByCategory(category);
    expect(res).toEqual(mock);
    expect(res.products[0].category).toBe(category);
  });

  it('getProductsByCategory throws on non-OK responses', async () => {
    const category = 'unknown';

    server.use(
      http.get(`${BASE_URL}/products/category/:category`, () =>
        HttpResponse.text('Not found', { status: 404 }),
      ),
    );

    await expect(
      dummyJSONService.getProductsByCategory(category),
    ).rejects.toThrow(`Failed to fetch products for category ${category}`);
  });
});
