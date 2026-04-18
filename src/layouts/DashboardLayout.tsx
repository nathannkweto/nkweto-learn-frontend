import { useState } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    IconButton,
    useTheme,
    useMediaQuery,
    List,
    ListItem,
    ListItemButton,
    ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const drawerWidth = 240;

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Learning Platform
                    </Typography>
                    <Typography variant="body2" sx={{ mr: 2 }}>
                        {user?.name} ({user?.role})
                    </Typography>
                    <ListItemButton onClick={handleLogout} sx={{ flexGrow: 0, width: 'auto' }}>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => navigate('/dashboard')}>
                                <ListItemText primary="Dashboard" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => navigate('/topics')}>
                                <ListItemText primary="Topics" />
                            </ListItemButton>
                        </ListItem>
                        {user?.role === 'TEACHER' && (
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => navigate('/teacher/topics/new')}>
                                    <ListItemText primary="Create Topic" />
                                </ListItemButton>
                            </ListItem>
                        )}
                    </List>
                </Box>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Outlet /> {/* Child routes render here */}
            </Box>
        </Box>
    );
}