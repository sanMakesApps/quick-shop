import React, { useState, useEffect, useMemo } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchProducts } from '../api/products';

// Carousel component
const ProductCarousel = ({ title, products, onProductClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    const scrollAmount = isMobile ? 300 : 400;
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Box sx={{ mb: 6 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Box>
          <IconButton onClick={() => scroll('left')} size="large">
            <ChevronLeftIcon />
          </IconButton>
          <IconButton onClick={() => scroll('right')} size="large">
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          pb: 2, // Add padding to bottom to prevent cut-off shadows
        }}
      >
        {products.map((product) => (
          <Box
            key={product.id}
            sx={{
              minWidth: {
                xs: '280px',
                sm: '300px',
                md: '320px'
              },
              flexShrink: 0
            }}
          >
            <ProductCard
              product={product}
              onClick={() => onProductClick(product.id)}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Memoized featured products (rating >= 4)
  const featuredProducts = useMemo(() => {
    return products
      .filter(product => product.rating >= 4)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
  }, [products]);

  // Memoized products by category
  const productsByCategory = useMemo(() => {
    const categories = [...new Set(products.map(product => product.category))];
    return categories.map(category => ({
      category,
      products: products
        .filter(product => product.category === category)
        .slice(0, 10)
    }));
  }, [products]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: 'background.default'
    }}>
      <Navbar />
      <Container 
        sx={{ 
          py: { xs: 4, md: 6 }, 
          flexGrow: 1 
        }}
      >
        {/* Hero Section */}
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 2
            }}
          >
            Welcome to QuickShop
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Discover our curated collection of top-rated products
          </Typography>
        </Box>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <ProductCarousel
            title="Featured Products"
            products={featuredProducts}
            onProductClick={handleProductClick}
          />
        )}

        {/* Category-based Products */}
        {productsByCategory.map(({ category, products }) => (
          <ProductCarousel
            key={category}
            title={category}
            products={products}
            onProductClick={handleProductClick}
          />
        ))}
      </Container>
      <Footer />
    </Box>
  );
};

export default Home; 