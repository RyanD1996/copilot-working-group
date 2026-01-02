import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductDetail } from './index';

// Mock child components
vi.mock('../ProductNavigation', () => ({
  ProductNavigation: () => <div data-testid="product-navigation">Product Navigation</div>,
}));

vi.mock('../ProductImage', () => ({
  ProductImage: () => <div data-testid="product-image">Product Image</div>,
}));

vi.mock('../ProductInfo', () => ({
  ProductInfo: () => <div data-testid="product-info">Product Info</div>,
}));

vi.mock('../ProductMeta', () => ({
  ProductMeta: () => <div data-testid="product-meta">Product Meta</div>,
}));

vi.mock('../ProductActions', () => ({
  ProductActions: () => <div data-testid="product-actions">Product Actions</div>,
}));

describe('ProductDetail', () => {
  it('renders with correct layout structure', () => {
    const { container } = render(<ProductDetail />);
    
    // Check that the component renders
    expect(container.firstChild).toBeTruthy();
    
    // Verify the main container exists
    const mainContainer = container.querySelector('div');
    expect(mainContainer).toBeInTheDocument();
  });

  it('renders ProductNavigation component', () => {
    render(<ProductDetail />);
    
    const navigation = screen.getByTestId('product-navigation');
    expect(navigation).toBeInTheDocument();
    expect(navigation).toHaveTextContent('Product Navigation');
  });

  it('renders ProductImage component', () => {
    render(<ProductDetail />);
    
    const image = screen.getByTestId('product-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveTextContent('Product Image');
  });

  it('renders ProductInfo component in the info section', () => {
    render(<ProductDetail />);
    
    const info = screen.getByTestId('product-info');
    expect(info).toBeInTheDocument();
    expect(info).toHaveTextContent('Product Info');
  });

  it('renders ProductMeta component in the info section', () => {
    render(<ProductDetail />);
    
    const meta = screen.getByTestId('product-meta');
    expect(meta).toBeInTheDocument();
    expect(meta).toHaveTextContent('Product Meta');
  });

  it('renders ProductActions component in the info section', () => {
    render(<ProductDetail />);
    
    const actions = screen.getByTestId('product-actions');
    expect(actions).toBeInTheDocument();
    expect(actions).toHaveTextContent('Product Actions');
  });

  it('renders all child components together', () => {
    render(<ProductDetail />);
    
    // Verify all child components are present
    expect(screen.getByTestId('product-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('product-image')).toBeInTheDocument();
    expect(screen.getByTestId('product-info')).toBeInTheDocument();
    expect(screen.getByTestId('product-meta')).toBeInTheDocument();
    expect(screen.getByTestId('product-actions')).toBeInTheDocument();
  });
});
