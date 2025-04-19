import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  IconButton,
  Button,
  Grid,
  Divider,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const navigate = useNavigate();

  if (cart.items.length === 0) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <Navbar />
        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 4, md: 8 },
        }}>
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/products')}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: 'background.default'
    }}>
      <Navbar />
      <Container 
        sx={{ 
          flexGrow: 1,
          py: { xs: 4, md: 8 },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            mb: { xs: 3, md: 4 },
            fontWeight: 600
          }}
        >
          Shopping Cart
        </Typography>

        <Grid container spacing={{ xs: 3, md: 4 }}>
          <Grid item xs={12} md={8}>
            <Stack spacing={{ xs: 2, md: 3 }}>
              {cart.items.map((item) => (
                <Card 
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} 
                  sx={{ 
                    p: { xs: 2, md: 3 },
                    transition: 'box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    },
                  }}
                >
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <Box
                        sx={{
                          position: 'relative',
                          paddingTop: '100%',
                          borderRadius: 1,
                          overflow: 'hidden',
                          bgcolor: 'background.paper',
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={item.images[0]}
                          alt={item.title}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                          <Box>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 600,
                                mb: 0.5
                              }}
                            >
                              {item.title}
                            </Typography>
                            {(item.selectedSize || item.selectedColor) && (
                              <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                sx={{ mb: 1 }}
                              >
                                {item.selectedSize && `Size: ${item.selectedSize}`}
                                {item.selectedColor && ` | Color: ${item.selectedColor}`}
                              </Typography>
                            )}
                            <Typography 
                              variant="h6" 
                              color="primary"
                              sx={{ fontWeight: 600 }}
                            >
                              ${item.price.toFixed(2)}
                            </Typography>
                          </Box>
                          <IconButton
                            color="error"
                            onClick={() => removeFromCart(item)}
                            sx={{ 
                              '&:hover': { 
                                bgcolor: 'error.light',
                                color: 'white'
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                        <Box 
                          display="flex" 
                          alignItems="center" 
                          gap={2} 
                          mt="auto"
                          pt={2}
                        >
                          <Box 
                            display="flex" 
                            alignItems="center" 
                            border="1px solid" 
                            borderColor="divider" 
                            borderRadius={1}
                          >
                            <IconButton
                              size="small"
                              onClick={() => updateQuantity(item, Math.max(1, item.quantity - 1))}
                              disabled={item.quantity <= 1}
                            >
                              <RemoveIcon />
                            </IconButton>
                            <Typography sx={{ px: 2, minWidth: '40px', textAlign: 'center' }}>
                              {item.quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => updateQuantity(item, Math.min(item.stock, item.quantity + 1))}
                              disabled={item.quantity >= item.stock}
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                          <Typography 
                            variant="h6" 
                            color="primary"
                            sx={{ fontWeight: 600 }}
                          >
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                p: { xs: 2, md: 3 },
                position: { md: 'sticky' },
                top: { md: 24 },
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                Order Summary
              </Typography>
              <Box sx={{ my: 3 }}>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography fontWeight={500}>${getTotalPrice().toFixed(2)}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography color="text.secondary">Shipping</Typography>
                  <Typography fontWeight={500}>Free</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between" mb={3}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Total</Typography>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                    ${getTotalPrice().toFixed(2)}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => {
                  // Handle checkout
                  console.log('Proceeding to checkout...');
                }}
              >
                Proceed to Checkout
              </Button>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={() => navigate('/products')}
                sx={{ mt: 2 }}
              >
                Continue Shopping
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
};

export default Cart; 