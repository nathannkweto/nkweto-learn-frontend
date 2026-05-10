import { useState } from 'react';
import { Box, Drawer } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Added useAuth

// Icons
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'; // Added Logout Icon
// import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
// import BuildRoundedIcon from '@mui/icons-material/BuildRounded';

// Components
import { NotificationsPanel } from '../components/NotificationsPanel';
import { DesktopSidebar } from './components/DesktopSidebar';
import { MobileBottomNav } from './components/MobileBottomNav';

import { useContext } from 'react';
import { ColorModeContext } from '../context/ColorModeContext'; // Adjust path
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import { useTheme } from '@mui/material/styles';

const NAV_WIDTH = 280;

export const AppLayout = () => {
    const { toggleColorMode } = useContext(ColorModeContext);
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth(); // Hook into your global auth
    const [notifOpen, setNotifOpen] = useState(false);

    const navItems = [
        { label: 'Home', path: '/', icon: <HomeRoundedIcon /> },
        { label: 'Programs', path: '/programs', icon: <ExploreRoundedIcon /> },
        // { label: 'Notifications', path: '#', icon: <NotificationsRoundedIcon /> },
        // { label: 'Tools', path: '/tools', icon: <BuildRoundedIcon /> },
        {
            label: isDark ? 'Light Mode' : 'Dark Mode',
            path: 'action:toggle-mode',
            icon: isDark ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />
        },
        // Added Logout as a special action item
        { label: 'Logout', path: 'action:logout', icon: <LogoutRoundedIcon /> },
    ];

    // Added a check to ignore 'action:' paths so Logout doesn't accidentally become the active tab
    const currentTab = navItems.findIndex(item =>
        !item.path.startsWith('action:') && item.path !== '#' && (item.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path))
    );

    const activeIndex = notifOpen ? 3 : (currentTab === -1 ? 0 : currentTab);

    const handleNavigation = (index: number) => {
        const item = navItems[index];

        if (item.path === 'action:toggle-mode') {
            toggleColorMode();
        } else if (item.label === 'Logout') {
            logout();
            navigate('/login');
        } else {
            setNotifOpen(false);
            navigate(item.path);
        }
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>

            <DesktopSidebar
                navWidth={NAV_WIDTH}
                navItems={navItems}
                activeIndex={activeIndex}
                notifOpen={notifOpen}
                handleNavigation={handleNavigation}
                closeNotifs={() => setNotifOpen(false)}
            />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    ml: { xs: 0, md: `${NAV_WIDTH}px` },
                    pb: { xs: '70px', md: 0 },
                    width: '100%',
                }}
            >
                <Outlet />
            </Box>

            <MobileBottomNav
                navItems={navItems}
                activeIndex={activeIndex}
                handleNavigation={handleNavigation}
            />

            <Drawer
                anchor="bottom"
                open={notifOpen && window.innerWidth < 900}
                onClose={() => setNotifOpen(false)}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: '16px 16px 0 0',
                            height: '60vh',
                            overflow: 'hidden',
                            backgroundImage: 'none',
                            borderTop: 1,
                            borderColor: 'divider'
                        }
                    }
                }}
            >
                <NotificationsPanel onClose={() => setNotifOpen(false)} />
            </Drawer>

        </Box>
    );
};