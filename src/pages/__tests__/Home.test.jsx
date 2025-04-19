import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material';
import Home from '../Home';
import { server, http, HttpResponse } from '../../setupTests.cjs';

const theme = createTheme();

const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </BrowserRouter>
  );
};

const mockProducts = [
  {
    id: 1,
    title: 'Featured Product',
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
    title: 'Regular Product',
    description: 'Description 2',
    price: 200,
    discountPercentage: 20,
    rating: 3.5,
    stock: 30,
    brand: 'Brand 2',
    category: 'Category 1',
    thumbnail: 'image2.jpg',
  },
  {
    id: 3,
    title: 'Another Featured',
    description: 'Description 3',
    price: 300,
    discountPercentage: 15,
    rating: 4.8,
    stock: 20,
    brand: 'Brand 3',
    category: 'Category 2',
    thumbnail: 'image3.jpg',
  },
];

describe('Home Page', () => {
  beforeEach(() => {
    server.resetHandlers();
    server.use(
      http.get('*/api/products', () => {
        return HttpResponse.json(mockProducts);
      })
    );
  });

  test('renders loading state initially', () => {
    render(<Home />, { wrapper: AllTheProviders });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders welcome message', async () => {
    render(<Home />, { wrapper: AllTheProviders });
    
    await waitFor(() => {
      expect(screen.getByText(/welcome to quickcart/i)).toBeInTheDocument();
      expect(screen.getByText(/discover our curated collection/i)).toBeInTheDocument();
    });
  });

  test('renders featured products section', async () => {
    render(<Home />, { wrapper: AllTheProviders });

    await waitFor(() => {
      expect(screen.getByText(/featured products/i)).toBeInTheDocument();
      expect(screen.getByText('Featured Product')).toBeInTheDocument();
      expect(screen.getByText('Another Featured')).toBeInTheDocument();
      expect(screen.queryByText('Regular Product')).not.toBeInTheDocument();
    });
  });

  test('renders category sections', async () => {
    render(<Home />, { wrapper: AllTheProviders });

    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.getByText('Category 2')).toBeInTheDocument();
    });
  });

  test('carousel navigation works', async () => {
    render(<Home />, { wrapper: AllTheProviders });

    await waitFor(() => {
      expect(screen.getByText('Featured Product')).toBeInTheDocument();
    });

    const nextButtons = screen.getAllByRole('button', { name: /chevronright/i });
    const prevButtons = screen.getAllByRole('button', { name: /chevronleft/i });

    expect(nextButtons.length).toBeGreaterThan(0);
    expect(prevButtons.length).toBeGreaterThan(0);

    fireEvent.click(nextButtons[0]);
  });

  test('handles product click navigation', async () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    render(<Home />, { wrapper: AllTheProviders });

    await waitFor(() => {
      expect(screen.getByText('Featured Product')).toBeInTheDocument();
    });

    const productCard = screen.getByText('Featured Product').closest('div[role="button"]');
    fireEvent.click(productCard);

    expect(mockNavigate).toHaveBeenCalledWith('/product/1');
  });

  test('handles API error state', async () => {
    server.use(
      http.get('*/api/products', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<Home />, { wrapper: AllTheProviders });

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

    render(<Home />, { wrapper: AllTheProviders });

    await waitFor(() => {
      expect(screen.queryByText(/featured products/i)).not.toBeInTheDocument();
    });
  });

  test('renders correctly on mobile', async () => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    render(<Home />, { wrapper: AllTheProviders });

    await waitFor(() => {
      expect(screen.getByText('Featured Product')).toBeInTheDocument();
    });
  });

  test('matches snapshot', async () => {
    const { container } = render(<Home />, { wrapper: AllTheProviders });
    
    await waitFor(() => {
      expect(screen.getByText('Featured Product')).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });
}); 