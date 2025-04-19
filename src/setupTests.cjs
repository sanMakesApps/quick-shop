require('@testing-library/jest-dom');

// Add TextEncoder and TextDecoder polyfills
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Add fetch-related polyfills for MSW
const { Response, Request, Headers } = require('node-fetch');
global.Response = Response;
global.Request = Request;
global.Headers = Headers;
global.fetch = require('node-fetch');

const { http, HttpResponse } = require('msw');
const { setupServer } = require('msw/node');

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Setup MSW server for API mocking
const handlers = [
  http.get('*/api/products', () => {
    return HttpResponse.json([
      {
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
      },
    ]);
  }),
];

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
});

afterAll(() => {
  server.close();
});

module.exports = { server, http, HttpResponse }; 