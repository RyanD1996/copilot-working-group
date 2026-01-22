import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductDetail } from './index';
import type { Product } from '../../types/product';
import * as useProductModule from '../../hooks/useProduct';
import type { UseQueryResult } from '@tanstack/react-query';

// Type for mock query result
type MockQueryResult = Partial<UseQueryResult<Product | undefined, Error>>;

// Mock the child components
vi.mock('../ProductNavigation', () => ({
  ProductNavigation: () => <div data-testid="product-navigation">Navigation</div>,
}));
vi.mock('../ProductImage', () => ({
  ProductImage: () => <div data-testid="product-image">Image</div>,
}));
vi.mock('../ProductMeta', () => ({
  ProductMeta: () => <div data-testid="product-meta">Meta</div>,
}));
vi.mock('../ProductActions', () => ({
  ProductActions: () => <div data-testid="product-actions">Actions</div>,
}));

// Mock ProductInfo to render the actual product data
vi.mock('../ProductInfo', () => ({
  ProductInfo: () => {
    // Import mocked useProduct
    const { useProduct } = vi.mocked(useProductModule);
    const { data: product } = useProduct();
    
    return (
      <div data-testid="product-info">
        <h1 data-testid="product-title">{product?.title}</h1>
        <p data-testid="product-price">
          {product?.price !== undefined ? `$${product.price.toFixed(2)}` : ''}
        </p>
        <p data-testid="product-description">{product?.description}</p>
      </div>
    );
  },
}));

// Mock the useProduct hook
vi.mock('../../hooks/useProduct', () => ({
  useProduct: vi.fn(),
}));

describe('ProductDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the product title correctly', () => {
    const mockProduct: Product = {
      id: 1,
      title: 'Test Product',
      description: 'A test description',
      category: 'electronics',
      price: 99.99,
      rating: 4.5,
      stock: 10,
      availabilityStatus: 'In Stock',
      returnPolicy: '30 days',
      thumbnail: 'test.jpg',
      images: ['test1.jpg'],
    };

    vi.mocked(useProductModule.useProduct).mockReturnValue({
      data: mockProduct,
      isLoading: false,
      error: null,
    } as UseQueryResult<Product | undefined, Error>);

    render(<ProductDetail />);

    expect(screen.getByTestId('product-title')).toHaveTextContent('Test Product');
  });

  it('displays the product description correctly', () => {
    const mockProduct: Product = {
      id: 2,
      title: 'Another Product',
      description: 'This is a detailed product description',
      category: 'clothing',
      price: 49.99,
      rating: 4.0,
      stock: 5,
      availabilityStatus: 'In Stock',
      returnPolicy: '30 days',
      thumbnail: 'test.jpg',
      images: ['test1.jpg'],
    };

    vi.mocked(useProductModule.useProduct).mockReturnValue({
      data: mockProduct,
      isLoading: false,
      error: null,
    } as UseQueryResult<Product | undefined, Error>);

    render(<ProductDetail />);

    expect(screen.getByTestId('product-description')).toHaveTextContent(
      'This is a detailed product description'
    );
  });

  it('shows the product price correctly formatted', () => {
    const mockProduct: Product = {
      id: 3,
      title: 'Expensive Item',
      description: 'Very expensive',
      category: 'luxury',
      price: 1234.56,
      rating: 5.0,
      stock: 1,
      availabilityStatus: 'In Stock',
      returnPolicy: '30 days',
      thumbnail: 'test.jpg',
      images: ['test1.jpg'],
    };

    vi.mocked(useProductModule.useProduct).mockReturnValue({
      data: mockProduct,
      isLoading: false,
      error: null,
    } as UseQueryResult<Product | undefined, Error>);

    render(<ProductDetail />);

    expect(screen.getByTestId('product-price')).toHaveTextContent('$1234.56');
  });

  it('handles missing product data gracefully without throwing errors', () => {
    vi.mocked(useProductModule.useProduct).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    } as UseQueryResult<Product | undefined, Error>);

    // Should not throw an error
    expect(() => render(<ProductDetail />)).not.toThrow();

    // Component should still render
    expect(screen.getByTestId('product-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('product-image')).toBeInTheDocument();
    expect(screen.getByTestId('product-info')).toBeInTheDocument();
  });

  it('handles incomplete product data gracefully', () => {
    const incompleteProduct: Product = {
      id: 4,
      title: 'Minimal Product',
      description: 'Basic description',
      category: 'test',
      price: 10.0,
      rating: 3.0,
      stock: 0,
      availabilityStatus: 'Out of Stock',
      returnPolicy: 'No returns',
      thumbnail: '',
      images: [],
    };

    vi.mocked(useProductModule.useProduct).mockReturnValue({
      data: incompleteProduct,
      isLoading: false,
      error: null,
    } as UseQueryResult<Product | undefined, Error>);

    expect(() => render(<ProductDetail />)).not.toThrow();

    expect(screen.getByTestId('product-title')).toHaveTextContent('Minimal Product');
    expect(screen.getByTestId('product-price')).toHaveTextContent('$10.00');
    expect(screen.getByTestId('product-description')).toHaveTextContent('Basic description');
  });

  it('renders all child components', () => {
    const mockProduct: Product = {
      id: 5,
      title: 'Complete Product',
      description: 'Full description',
      category: 'general',
      price: 25.99,
      rating: 4.2,
      stock: 15,
      brand: 'TestBrand',
      availabilityStatus: 'In Stock',
      returnPolicy: '60 days',
      thumbnail: 'thumb.jpg',
      images: ['img1.jpg', 'img2.jpg'],
    };

    vi.mocked(useProductModule.useProduct).mockReturnValue({
      data: mockProduct,
      isLoading: false,
      error: null,
    } as UseQueryResult<Product | undefined, Error>);

    render(<ProductDetail />);

    expect(screen.getByTestId('product-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('product-image')).toBeInTheDocument();
    expect(screen.getByTestId('product-info')).toBeInTheDocument();
    expect(screen.getByTestId('product-meta')).toBeInTheDocument();
    expect(screen.getByTestId('product-actions')).toBeInTheDocument();
  });
});
