import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Rating,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  MobileStepper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import CategoryIcon from '@mui/icons-material/Category';
import DiscountIcon from '@mui/icons-material/Discount';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchProductById } from '../api/products';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeStep, setActiveStep] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      const data = await fetchProductById(id);
      setProduct(data);
    };
    loadProduct();
  }, [id]);

  if (!product) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Container sx={{ py: 8, flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography>Loading...</Typography>
        </Container>
        <Footer />
      </Box>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const maxSteps = product.images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Container sx={{ py: { xs: 4, md: 8 }, flexGrow: 1 }}>
        <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
          <Grid container spacing={{ xs: 2, md: 4 }}>
            {/* Product Images */}
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                bgcolor: 'background.paper',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 1,
                position: 'relative'
              }}>
                <Box
                  component="img"
                  src={product.images[activeStep]}
                  alt={`${product.title} - ${activeStep + 1}`}
                  sx={{
                    width: '100%',
                    height: { xs: 300, sm: 400, md: 500 },
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
                <MobileStepper
                  steps={maxSteps}
                  position="static"
                  activeStep={activeStep}
                  sx={{
                    bgcolor: 'transparent',
                    '& .MuiMobileStepper-dot': {
                      bgcolor: 'rgba(0, 0, 0, 0.26)',
                    },
                    '& .MuiMobileStepper-dotActive': {
                      bgcolor: 'primary.main',
                    },
                  }}
                  nextButton={
                    <IconButton
                      size="small"
                      onClick={handleNext}
                      disabled={activeStep === maxSteps - 1}
                      sx={{
                        bgcolor: 'background.paper',
                        '&:hover': { bgcolor: 'background.paper' },
                        boxShadow: 1,
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    >
                      <KeyboardArrowRight />
                    </IconButton>
                  }
                  backButton={
                    <IconButton
                      size="small"
                      onClick={handleBack}
                      disabled={activeStep === 0}
                      sx={{
                        bgcolor: 'background.paper',
                        '&:hover': { bgcolor: 'background.paper' },
                        boxShadow: 1,
                        position: 'absolute',
                        left: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    >
                      <KeyboardArrowLeft />
                    </IconButton>
                  }
                />
              </Box>
            </Grid>

            {/* Product Info */}
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box>
                  <Typography 
                    variant="h4" 
                    gutterBottom
                    sx={{ 
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                      fontWeight: 600
                    }}
                  >
                    {product.title}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {product.brand}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <Rating value={product.rating} precision={0.1} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    ({product.rating})
                  </Typography>
                </Box>

                <Box>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography 
                      variant="h4" 
                      color="primary"
                      sx={{ 
                        fontSize: { xs: '1.5rem', sm: '2rem' }
                      }}
                    >
                      ${discountedPrice.toFixed(2)}
                    </Typography>
                    {product.discountPercentage > 0 && (
                      <Box>
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          sx={{
                            textDecoration: 'line-through',
                            fontSize: { xs: '1rem', sm: '1.25rem' }
                          }}
                        >
                          ${product.price.toFixed(2)}
                        </Typography>
                        <Chip
                          icon={<DiscountIcon />}
                          label={`${product.discountPercentage}% OFF`}
                          color="error"
                          size="small"
                        />
                      </Box>
                    )}
                  </Stack>
                </Box>

                <Typography variant="body1">
                  {product.description}
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    icon={<CategoryIcon />}
                    label={`Category: ${product.category}`}
                    variant="outlined"
                  />
                  <Chip
                    icon={<LocalShippingIcon />}
                    label={product.shippingInformation}
                    variant="outlined"
                  />
                  <Chip
                    icon={<AssignmentReturnIcon />}
                    label={product.returnPolicy}
                    variant="outlined"
                  />
                </Stack>

                <Box>
                  <Chip 
                    label={product.stock > 0 ? `${product.stock} units in stock` : 'Out of Stock'} 
                    color={product.stock > 0 ? 'success' : 'error'}
                    sx={{ mb: 2 }}
                  />
                </Box>

                {/* Quantity Selection */}
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography>Quantity:</Typography>
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    border="1px solid" 
                    borderColor="divider" 
                    borderRadius={1}
                  >
                    <IconButton
                      size="small"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={!product.stock}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography sx={{ px: 2 }}>{quantity}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={!product.stock}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Box>

                {/* Action Buttons */}
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2}
                  sx={{ mt: 2 }}
                >
                  <Button
                    variant="contained"
                    startIcon={<ShoppingCartIcon />}
                    onClick={handleAddToCart}
                    disabled={!product.stock}
                    fullWidth
                    size="large"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleBuyNow}
                    disabled={!product.stock}
                    fullWidth
                    size="large"
                  >
                    Buy Now
                  </Button>
                </Stack>

                {/* Additional Info */}
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Product Details
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    • Brand: {product.brand}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Category: {product.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • SKU: {product.sku}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Warranty: {product.warrantyInformation}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Minimum Order: {product.minimumOrderQuantity} units
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default ProductDetails; 