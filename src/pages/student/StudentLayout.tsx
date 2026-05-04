import { Box, Paper, BottomNavigation, BottomNavigationAction, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

const NAV_WIDTH = 280; // Desktop sidebar width

export const StudentLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Navigation items configuration
    const navItems = [
        { label: 'Dashboard', path: '/student/dashboard', icon: <HomeRoundedIcon /> },
        { label: 'Topics', path: '/student/topics', icon: <MenuBookRoundedIcon /> },
        { label: 'Profile', path: '/student/profile', icon: <PersonRoundedIcon /> },
    ];

    // Determine which tab is currently active based on the URL
    const currentTab = navItems.findIndex(item => location.pathname.startsWith(item.path));
    const activeIndex = currentTab === -1 ? 0 : currentTab;

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>

            {/* ========================================== */}
            {/* DESKTOP SIDEBAR (Hidden on mobile/tablet)  */}
            {/* ========================================== */}
            <Box
                component="nav"
                sx={{
                    width: NAV_WIDTH,
                    flexShrink: 0,
                    display: { xs: 'none', md: 'block' }, // Hide on extra-small, show on medium+
                    borderRight: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    position: 'fixed',
                    height: '100vh',
                    zIndex: 1000
                }}
            >
                <Box sx={{ p: 3, mb: 2 }}>
                    {/* Your Logo or App Name Here */}
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em' }}>
                        LearnApp.
                    </Typography>
                </Box>

                <List sx={{ px: 2 }}>
                    {navItems.map((item, index) => {
                        const isActive = activeIndex === index;
                        return (
                            <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                                <ListItemButton
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        borderRadius: 3,
                                        backgroundColor: isActive ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                                        color: isActive ? 'primary.main' : '#64748b',
                                        '&:hover': {
                                            backgroundColor: isActive ? 'rgba(25, 118, 210, 0.12)' : '#f1f5f9'
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        sx={{
                                            '& .MuiListItemText-primary': {
                                                fontWeight: isActive ? 700 : 500
                                            }
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>

            {/* ========================================== */}
            {/* MAIN CONTENT AREA                          */}
            {/* ========================================== */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    // Margin left on desktop to make room for sidebar
                    ml: { xs: 0, md: `${NAV_WIDTH}px` },
                    // Padding bottom on mobile to make room for bottom nav
                    pb: { xs: '70px', md: 0 },
                    width: '100%',
                }}
            >
                {/* The current page component renders here */}
                <Outlet />
            </Box>

            {/* ========================================== */}
            {/* MOBILE BOTTOM NAV (Hidden on desktop)      */}
            {/* ========================================== */}
            <Paper
                elevation={8}
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    display: { xs: 'block', md: 'none' }, // Show on extra-small, hide on medium+
                    zIndex: 1000
                }}
            >
                <BottomNavigation
                    showLabels
                    value={activeIndex}
                    onChange={(_, newValue) => {
                        navigate(navItems[newValue].path);
                    }}
                    sx={{
                        height: 70, // Slightly taller for easier tapping
                        '& .MuiBottomNavigationAction-root': {
                            color: '#94a3b8',
                        },
                        '& .Mui-selected': {
                            color: 'primary.main',
                        }
                    }}
                >
                    {navItems.map((item) => (
                        <BottomNavigationAction
                            key={item.label}
                            label={item.label}
                            icon={item.icon}
                        />
                    ))}
                </BottomNavigation>
            </Paper>

        </Box>
    );
};