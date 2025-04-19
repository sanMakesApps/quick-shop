import React, { useState, useEffect, useMemo, useCallback, memo, Suspense } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Checkbox,
  FormGroup,
  FormControlLabel,
  TextField,
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
  Button,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import { Virtuoso } from 'react-virtuoso';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../api/products';

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const sortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'rating-low-high', label: 'Rating: Low to High' },
  { value: 'rating-high-low', label: 'Rating: High to Low' },
];

// Lazy loaded product card with loading skeleton
const LazyProductCard = memo(({ product, onClick }) => (
  <Suspense
    fallback={
      <Skeleton
        variant="rectangular"
        width="100%"
        height={300}
        sx={{ borderRadius: 2 }}
      />
    }
  >
    <ProductCard product={product} onClick={onClick} />
  </Suspense>
));

// Memoized Filter Section component
const FilterSection = memo(({ 
  searchQuery, 
  onSearchChange, 
  categories, 
  selectedCategories, 
  onCategoryChange,
  priceRange,
  onPriceChange,
  ratingFilter,
  onRatingChange,
  inStockOnly,
  onStockChange,
  isMobile 
}) => (
  <Box sx={{ width: isMobile ? 'auto' : 250 }}>
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Search
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Search products..."
          value={searchQuery}
          onChange={onSearchChange}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Categories
        </Typography>
        <FormGroup>
          {categories.map((category) => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox
                  checked={selectedCategories.includes(category)}
                  onChange={() => onCategoryChange(category)}
                />
              }
              label={category}
            />
          ))}
        </FormGroup>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Price Range
        </Typography>
        <Slider
          value={priceRange}
          onChange={onPriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={2000}
          sx={{ mt: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2">${priceRange[0]}</Typography>
          <Typography variant="body2">${priceRange[1]}</Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Minimum Rating
        </Typography>
        <Slider
          value={ratingFilter}
          onChange={onRatingChange}
          valueLabelDisplay="auto"
          min={0}
          max={5}
          step={0.5}
          sx={{ mt: 2 }}
        />
      </Box>

      <Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={inStockOnly}
              onChange={(e) => onStockChange(e.target.checked)}
            />
          }
          label="In Stock Only"
        />
      </Box>
    </Paper>
  </Box>
));

const Products = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  
  // Filter states
  const [sortBy, setSortBy] = useState('default');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(product => product.category))];
        setCategories(uniqueCategories);
        
        // Find max price for price range
        const maxPrice = Math.max(...data.map(product => product.price));
        setPriceRange([0, maxPrice]);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply search filter
    if (debouncedSearchQuery) {
      const searchLower = debouncedSearchQuery.toLowerCase();
      result = result.filter(product =>
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter(product => selectedCategories.includes(product.category));
    }

    // Apply price range filter
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply rating filter
    if (ratingFilter > 0) {
      result = result.filter(product => product.rating >= ratingFilter);
    }

    // Apply in stock filter
    if (inStockOnly) {
      result = result.filter(product => product.stock > 0);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low-high':
        return result.sort((a, b) => a.price - b.price);
      case 'price-high-low':
        return result.sort((a, b) => b.price - a.price);
      case 'rating-low-high':
        return result.sort((a, b) => a.rating - b.rating);
      case 'rating-high-low':
        return result.sort((a, b) => b.rating - a.rating);
      default:
        return result;
    }
  }, [products, selectedCategories, priceRange, ratingFilter, inStockOnly, sortBy, debouncedSearchQuery]);

  // Memoized handlers
  const handleCategoryChange = useCallback((category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      }
      return [...prev, category];
    });
  }, []);

  const handlePriceChange = useCallback((event, newValue) => {
    setPriceRange(newValue);
  }, []);

  const handleRatingChange = useCallback((event, newValue) => {
    setRatingFilter(newValue);
  }, []);

  const handleSortChange = useCallback((event) => {
    setSortBy(event.target.value);
  }, []);

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleProductClick = useCallback((productId) => {
    navigate(`/product/${productId}`);
  }, [navigate]);

  // Calculate number of rows needed for virtualization
  const rowCount = useMemo(() => {
    return Math.ceil(filteredProducts.length / 4);
  }, [filteredProducts.length]);

  // Memoized grid item renderer for virtualization
  const ItemRenderer = memo(({ items, index }) => {
    const rowItems = items.slice(index * 4, (index + 1) * 4);
    
    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {rowItems.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <LazyProductCard
              product={product}
              onClick={() => handleProductClick(product.id)}
            />
          </Grid>
        ))}
      </Grid>
    );
  });

  // Memoized empty state
  const EmptyState = memo(() => (
    <Box 
      sx={{ 
        width: '100%', 
        textAlign: 'center', 
        py: 8 
      }}
    >
      <Typography variant="h6" color="text.secondary" gutterBottom>
        No products found
      </Typography>
      <Typography color="text.secondary">
        Try adjusting your filters or search criteria
      </Typography>
    </Box>
  ));

  // Loading skeleton
  const LoadingSkeleton = memo(() => (
    <Grid container spacing={3}>
      {[...Array(8)].map((_, index) => (
        <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={300}
            sx={{ borderRadius: 2 }}
          />
        </Grid>
      ))}
    </Grid>
  ));

  if (loading) {
    return (
      <>
        <Navbar />
        <Container sx={{ py: 4, minHeight: '100vh' }}>
          <LoadingSkeleton />
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container sx={{ py: 4, minHeight: '100vh' }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Products
          </Typography>
          {isMobile && (
            <IconButton onClick={() => setMobileFiltersOpen(true)}>
              <FilterListIcon />
            </IconButton>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 4 }}>
          {!isMobile && (
            <FilterSection
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              priceRange={priceRange}
              onPriceChange={handlePriceChange}
              ratingFilter={ratingFilter}
              onRatingChange={handleRatingChange}
              inStockOnly={inStockOnly}
              onStockChange={setInStockOnly}
              isMobile={isMobile}
            />
          )}

          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography>
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </Typography>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Sort By</InputLabel>
                <Select value={sortBy} onChange={handleSortChange} label="Sort By">
                  {sortOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {filteredProducts.length > 0 ? (
              <Box sx={{ height: 'calc(100vh - 250px)', overflow: 'auto' }}>
                <Virtuoso
                  style={{ height: '100%' }}
                  totalCount={rowCount}
                  itemContent={index => (
                    <ItemRenderer 
                      items={filteredProducts} 
                      index={index}
                    />
                  )}
                  overscan={2}
                  components={{
                    List: React.forwardRef(({ style, children }, ref) => (
                      <Box ref={ref} style={{ ...style, padding: '0 8px' }}>
                        {children}
                      </Box>
                    ))
                  }}
                />
              </Box>
            ) : (
              <EmptyState />
            )}
          </Box>
        </Box>

        {isMobile && (
          <Drawer
            anchor="left"
            open={mobileFiltersOpen}
            onClose={() => setMobileFiltersOpen(false)}
          >
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Filters</Typography>
                <IconButton onClick={() => setMobileFiltersOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <FilterSection
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                categories={categories}
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
                priceRange={priceRange}
                onPriceChange={handlePriceChange}
                ratingFilter={ratingFilter}
                onRatingChange={handleRatingChange}
                inStockOnly={inStockOnly}
                onStockChange={setInStockOnly}
                isMobile={isMobile}
              />
            </Box>
          </Drawer>
        )}
      </Container>
      <Footer />
    </>
  );
};

// Export memoized component
export default memo(Products); 