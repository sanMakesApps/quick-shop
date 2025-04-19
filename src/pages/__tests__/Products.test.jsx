import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test-utils';
import Products from '../Products';
import { server, http, HttpResponse } from '../../setupTests.cjs';

const mockProducts = [
  {
    id: 1,
    title: 'Product 1',
    description: 'Description 1',
    price: 100,
    discountPercentage: 10,
    rating: 4.5,
    stock: 50,
    brand: 'Brand 1',
    category: 'Category 1',
    thumbnail: 'image1.jpg',
  },
  {
    id: 2,
    title: 'Product 2',
    description: 'Description 2',
    price: 200,
    discountPercentage: 20,
    rating: 3.5,
    stock: 0,
    brand: 'Brand 2',
    category: 'Category 2',
    thumbnail: 'image2.jpg',
  },
];

describe('Products Page', () => {
  beforeEach(() => {
    // Reset MSW handlers before each test
    server.resetHandlers();
    
    // Setup default handler
    server.use(
      http.get('*/api/products', () => {
        return HttpResponse.json(mockProducts);
      })
    );
  });

  test('renders loading state initially', () => {
    render(<Products />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders products after loading', async () => {
    render(<Products />);

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });
  });

  test('filters products by search query', async () => {
    render(<Products />);

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search products/i);
    await userEvent.type(searchInput, 'Product 1');

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.queryByText('Product 2')).not.toBeInTheDocument();
    });
  });

  test('filters products by category', async () => {
    render(<Products />);

    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
    });

    const categoryCheckbox = screen.getByRole('checkbox', { name: /category 1/i });
    fireEvent.click(categoryCheckbox);

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.queryByText('Product 2')).not.toBeInTheDocument();
    });
  });

  test('filters products by price range', async () => {
    render(<Products />);

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    const priceSlider = screen.getByRole('slider', { name: /price/i });
    fireEvent.change(priceSlider, { target: { value: 150 } });

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.queryByText('Product 2')).not.toBeInTheDocument();
    });
  });

  test('sorts products correctly', async () => {
    render(<Products />);

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    const sortSelect = screen.getByLabelText(/sort by/i);
    fireEvent.mouseDown(sortSelect);
    
    const priceHighToLowOption = screen.getByText(/price: high to low/i);
    fireEvent.click(priceHighToLowOption);

    const products = screen.getAllByRole('heading', { level: 2 });
    expect(products[0]).toHaveTextContent('Product 2');
    expect(products[1]).toHaveTextContent('Product 1');
  });

  test('handles API error state', async () => {
    server.use(
      http.get('*/api/products', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<Products />);

    await waitFor(() => {
      expect(screen.getByText(/error loading products/i)).toBeInTheDocument();
    });
  });

  test('handles empty product list', async () => {
    server.use(
      http.get('*/api/products', () => {
        return HttpResponse.json([]);
      })
    );

    render(<Products />);

    await waitFor(() => {
      expect(screen.getByText(/no products found/i)).toBeInTheDocument();
    });
  });

  test('renders mobile filters drawer', async () => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    render(<Products />);

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    const filterButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterButton);

    expect(screen.getByRole('presentation')).toBeInTheDocument();
  });

  test('matches snapshot', async () => {
    const { container } = render(<Products />);
    
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });
}); 