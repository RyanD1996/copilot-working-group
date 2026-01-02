import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductDetail } from './index';
import type { Product } from '../../types/product';
import * as useProductModule from '../../hooks/useProduct';

// Create a mock product with all required fields (including optional brand for testing)
const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  description: 'Test Description',
  category: 'Test Category',
  price: 99.99,
  rating: 4.5,
  stock: 10,
  brand: 'Test Brand', // Optional field, provided to test brand display
  availabilityStatus: 'In Stock',
  returnPolicy: '30 days',
  thumbnail: 'https://example.com/thumb.jpg',
  images: ['https://example.com/image.jpg'],
};

const mockAddToCart = vi.fn();

// Mock only the hooks instead of all child components
vi.mock('../../hooks/useProduct', () => ({
  useProduct: vi.fn(() => ({
    data: mockProduct,
    isLoading: false,
    error: null,
  })),
}));

vi.mock('../../contexts/CartContext', () => ({
  useCartContext: () => ({
    items: [],
    addToCart: mockAddToCart,
    removeFromCart: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
    totalItems: 0,
    totalPrice: 0,
  }),
}));

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router');
  return {
    ...actual,
    Link: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => <a {...props}>{children}</a>,
    useParams: () => ({ productId: '1' }),
  };
});

describe('ProductDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the navigation link', () => {
    render(<ProductDetail />);
    
    const backLink = screen.getByText('← Back to Products');
    expect(backLink).toBeInTheDocument();
  });

  it('displays product information correctly', () => {
    render(<ProductDetail />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('displays product metadata correctly', () => {
    render(<ProductDetail />);
    
    expect(screen.getByText('Test Brand')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText(/4\.5/)).toBeInTheDocument();
  });

  it('renders the product image with correct attributes', () => {
    render(<ProductDetail />);
    
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(image).toHaveAttribute('alt', 'Test Product');
  });

  it('renders the add to cart button and fires callback when clicked', async () => {
    const user = userEvent.setup();
    render(<ProductDetail />);
    
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    expect(addToCartButton).toBeInTheDocument();
    
    await user.click(addToCartButton);
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('uses thumbnail when images array is empty', () => {
    vi.spyOn(useProductModule, 'useProduct').mockReturnValueOnce({
      data: {
        ...mockProduct,
        images: [],
      },
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      status: 'success',
    } as ReturnType<typeof useProductModule.useProduct>);

    render(<ProductDetail />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://example.com/thumb.jpg');
  });
});
