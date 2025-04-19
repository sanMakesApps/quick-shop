import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../ProductCard';

const mockProduct = {
  id: 1,
  title: 'Test Product',
  description: 'Test Description',
  price: 100,
  discountPercentage: 10,
  rating: 4.5,
  stock: 50,
  brand: 'Test Brand',
  category: 'Test Category',
  thumbnail: 'test-image.jpg',
};

describe('ProductCard Component', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  test('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} onClick={mockOnClick} />);

    // Check if basic product information is rendered
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Brand')).toBeInTheDocument();
    expect(screen.getByText('$90.00')).toBeInTheDocument(); // Discounted price
    expect(screen.getByText('$100')).toBeInTheDocument(); // Original price
    expect(screen.getByText('-10%')).toBeInTheDocument();
    expect(screen.getByText('In Stock')).toBeInTheDocument();
  });

  test('handles click events correctly', () => {
    render(<ProductCard product={mockProduct} onClick={mockOnClick} />);

    // Test image click
    fireEvent.click(screen.getByRole('img'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);

    // Test button click
    fireEvent.click(screen.getByRole('button', { name: /view details/i }));
    expect(mockOnClick).toHaveBeenCalledTimes(2);
  });

  test('displays out of stock status when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(<ProductCard product={outOfStockProduct} onClick={mockOnClick} />);

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  test('handles products without discount', () => {
    const noDiscountProduct = { ...mockProduct, discountPercentage: 0 };
    render(<ProductCard product={noDiscountProduct} onClick={mockOnClick} />);

    expect(screen.getByText('$100.00')).toBeInTheDocument();
    expect(screen.queryByText('$100')).not.toBeInTheDocument(); // Original price should not be shown
    expect(screen.queryByText('-0%')).not.toBeInTheDocument();
  });

  test('meets accessibility requirements', () => {
    const { container } = render(
      <ProductCard product={mockProduct} onClick={mockOnClick} />
    );

    // Check if image has alt text
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('title', 'Test Product');

    // Check if the button is accessible
    const button = screen.getByRole('button', { name: /view details/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type');

    // Check for color contrast (requires manual verification)
    // Check for proper heading hierarchy
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
  });

  // Snapshot test
  test('matches snapshot', () => {
    const { container } = render(
      <ProductCard product={mockProduct} onClick={mockOnClick} />
    );
    expect(container).toMatchSnapshot();
  });
}); 