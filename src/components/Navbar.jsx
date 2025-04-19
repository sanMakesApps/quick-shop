import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Container,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2, 0),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(3, 0),
  },
}));

const NavLinks = styled(Box)(({ theme }) => ({
  display: "none",
  alignItems: "center",
  gap: theme.spacing(4),
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
  textDecoration: "none",
  cursor: "pointer",
  fontSize: "1.5rem",
  [theme.breakpoints.up("md")]: {
    fontSize: "1.75rem",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 500,
  "&:hover": {
    backgroundColor: "transparent",
    color: theme.palette.primary.main,
  },
}));

const DrawerContent = styled(Box)(({ theme }) => ({
  width: 280,
  padding: theme.spacing(2),
}));

const Navbar = () => {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { text: "Home", path: "/" },
    { text: "Products", path: "/products" },
  ];

  const drawer = (
    <DrawerContent>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Logo
          variant="h6"
          onClick={() => {
            navigate("/");
            handleDrawerToggle();
          }}
        >
          QuickShop
        </Logo>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => {
              navigate(item.path);
              handleDrawerToggle();
            }}
            sx={{ py: 1 }}
          >
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                sx: { fontWeight: 500 },
              }}
            />
          </ListItem>
        ))}
      </List>
    </DrawerContent>
  );

  return (
    <AppBar position="sticky" color="inherit">
      <Container>
        <StyledToolbar>
          <Logo variant="h6" onClick={() => navigate("/")}>
          QuickShop
          </Logo>

          <NavLinks>
            {navItems.map((item) => (
              <StyledButton key={item.text} onClick={() => navigate(item.path)}>
                {item.text}
              </StyledButton>
            ))}
          </NavLinks>

          <Box display="flex" alignItems="center" gap={2}>
            <IconButton
              color="inherit"
              onClick={() => navigate("/cart")}
              sx={{
                color: "text.primary",
                "&:hover": { color: "primary.main" },
              }}
            >
              <Badge
                badgeContent={getTotalItems()}
                color="primary"
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "primary.main",
                    color: "white",
                  },
                }}
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ color: "text.primary" }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </StyledToolbar>
      </Container>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
