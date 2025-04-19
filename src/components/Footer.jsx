import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import { styled } from '@mui/material/styles';

const FooterWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderTop: `1px solid ${theme.palette.divider}`,
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
  },
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  fontSize: '0.875rem',
  transition: 'color 0.2s ease',
  '&:hover': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
}));

const SocialIcons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const FooterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  [theme.breakpoints.up('md')]: {
    marginBottom: 0,
  },
}));

const Footer = () => {
  return (
    <FooterWrapper>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <FooterSection>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                QuickShop
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                Your one-stop shop for all your needs. Quality products, great prices, and excellent service.
              </Typography>
              <SocialIcons>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' } 
                  }}
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' } 
                  }}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' } 
                  }}
                >
                  <InstagramIcon />
                </IconButton>
              </SocialIcons>
            </FooterSection>
          </Grid>

          <Grid item xs={6} md={2}>
            <FooterSection>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Shop
              </Typography>
              <Box display="flex" flexDirection="column" gap={1.5}>
                <FooterLink href="/products">All Products</FooterLink>
                <FooterLink href="/new-arrivals">New Arrivals</FooterLink>
                <FooterLink href="/best-sellers">Best Sellers</FooterLink>
                <FooterLink href="/deals">Special Deals</FooterLink>
              </Box>
            </FooterSection>
          </Grid>

          <Grid item xs={6} md={2}>
            <FooterSection>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Support
              </Typography>
              <Box display="flex" flexDirection="column" gap={1.5}>
                <FooterLink href="/faq">FAQ</FooterLink>
                <FooterLink href="/shipping">Shipping Info</FooterLink>
                <FooterLink href="/returns">Returns</FooterLink>
                <FooterLink href="/contact">Contact Us</FooterLink>
              </Box>
            </FooterSection>
          </Grid>

          <Grid item xs={6} md={2}>
            <FooterSection>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Company
              </Typography>
              <Box display="flex" flexDirection="column" gap={1.5}>
                <FooterLink href="/about">About Us</FooterLink>
                <FooterLink href="/careers">Careers</FooterLink>
                <FooterLink href="/privacy">Privacy Policy</FooterLink>
                <FooterLink href="/terms">Terms of Service</FooterLink>
              </Box>
            </FooterSection>
          </Grid>

          <Grid item xs={6} md={2}>
            <FooterSection>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Resources
              </Typography>
              <Box display="flex" flexDirection="column" gap={1.5}>
                <FooterLink href="/blog">Blog</FooterLink>
                <FooterLink href="/size-guide">Size Guide</FooterLink>
                <FooterLink href="/store-locator">Store Locator</FooterLink>
                <FooterLink href="/gift-cards">Gift Cards</FooterLink>
              </Box>
            </FooterSection>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6 }} />

        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} QuickShop. All rights reserved.
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 3,
              '& > a': {
                fontSize: '0.75rem',
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                },
              }
            }}
          >
            <FooterLink href="/privacy">Privacy</FooterLink>
            <FooterLink href="/terms">Terms</FooterLink>
            <FooterLink href="/cookies">Cookies</FooterLink>
          </Box>
        </Box>
      </Container>
    </FooterWrapper>
  );
};

export default Footer; 