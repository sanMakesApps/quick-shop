import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Rating,
  Button,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const StyledCardMedia = styled(CardMedia)({
  height: 200,
  backgroundSize: 'contain',
  backgroundColor: '#f5f5f5',
});

const ProductCard = ({ product, onClick }) => {
  const {
    title,
    description,
    price,
    discountPercentage,
    rating,
    stock,
    brand,
    category,
    thumbnail,
  } = product;

  const discountedPrice = price - (price * (discountPercentage / 100));

  return (
    <StyledCard>
      <StyledCardMedia
        image={thumbnail}
        title={title}
        sx={{ cursor: 'pointer' }}
        onClick={onClick}
      />
      <CardContent 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 1.5,
          p: 2.5,
        }}
      >
        <Box sx={{ mb: 0.5 }}>
          <Typography 
            variant="subtitle2" 
            color="text.secondary"
            gutterBottom
            sx={{ 
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontSize: '0.75rem',
              mb: 0.5
            }}
          >
            {brand}
          </Typography>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.3,
              height: '2.6em',
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            {title}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Rating value={rating} precision={0.5} readOnly size="small" />
          <Typography variant="body2" color="text.secondary">
            ({rating})
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
            ${discountedPrice.toFixed(2)}
          </Typography>
          {discountPercentage > 0 && (
            <>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: 'line-through' }}
              >
                ${price}
              </Typography>
              <Chip
                label={`-${discountPercentage}%`}
                size="small"
                color="error"
                sx={{ height: 20 }}
              />
            </>
          )}
        </Box>

        <Chip
          label={stock > 0 ? 'In Stock' : 'Out of Stock'}
          size="small"
          color={stock > 0 ? 'success' : 'error'}
          variant="outlined"
          sx={{ alignSelf: 'flex-start', mt: 'auto' }}
        />

        <Button 
          variant="contained" 
          fullWidth
          onClick={onClick}
          sx={{ 
            mt: 1,
            py: 1,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          View Details
        </Button>
      </CardContent>
    </StyledCard>
  );
};

export default React.memo(ProductCard); 