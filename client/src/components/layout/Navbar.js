import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Alumni Network
        </Typography>
        {isAuthenticated ? (
          <>
            <Button color="inherit" component={Link} to="/dashboard">
              Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/profiles">
              Profiles
            </Button>
            <Button color="inherit" component={Link} to="/matching">
              Matching
            </Button>
            <Button color="inherit" component={Link} to="/opportunities">
              Opportunities
            </Button>
            <Button color="inherit" component={Link} to="/events">
              Events
            </Button>
            {user?.role === 'admin' && (
              <Button color="inherit" component={Link} to="/admin">
                Admin
              </Button>
            )}
            <Box sx={{ ml: 2 }}>
              <Avatar
                sx={{ bgcolor: 'secondary.main', cursor: 'pointer' }}
                onClick={handleMenu}
              >
                {user?.email?.charAt(0).toUpperCase()}
              </Avatar>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem component={Link} to="/profile" onClick={handleClose}>
                  Profile
                </MenuItem>
                <MenuItem component={Link} to="/messages" onClick={handleClose}>
                  Messages
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;


