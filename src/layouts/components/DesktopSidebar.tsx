import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { NotificationsPanel } from '../../components/NotificationsPanel';
import type {JSX} from "react";

interface DesktopSidebarProps {
    navWidth: number;
    navItems: Array<{ label: string; path: string; icon: JSX.Element }>;
    activeIndex: number;
    notifOpen: boolean;
    handleNavigation: (index: number) => void;
    closeNotifs: () => void;
}

export const DesktopSidebar = ({ navWidth, navItems, activeIndex, notifOpen, handleNavigation, closeNotifs }: DesktopSidebarProps) => {
    return (
        <Box
            component="nav"
            sx={{
                width: navWidth,
                flexShrink: 0,
                display: { xs: 'none', md: 'block' },
                borderRight: 1, // Uses theme.components or 1px width
                borderColor: 'divider', // Uses the global theme divider color
                bgcolor: 'background.paper', // Uses theme pure white
                position: 'fixed',
                height: '100vh',
                zIndex: 1000
            }}
        >
            {notifOpen ? (
                <NotificationsPanel onClose={closeNotifs} />
            ) : (
                <>
                    <Box sx={{ p: 3, mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '-0.02em' }}>
                            Nkweto Learn
                        </Typography>
                    </Box>

                    <List sx={{ px: 2 }}>
                        {navItems.map((item, index) => {
                            const isActive = activeIndex === index;
                            return (
                                <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                                    <ListItemButton
                                        onClick={() => handleNavigation(index)}
                                        sx={{
                                            borderRadius: 1, // Squarer borders (4px based on theme)
                                            backgroundColor: isActive ? 'action.selected' : 'transparent',
                                            color: isActive ? 'primary.main' : 'text.secondary',
                                            '&:hover': {
                                                backgroundColor: isActive ? 'action.selected' : 'action.hover'
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.label}
                                            slotProps={{
                                                primary: { sx: { fontWeight: isActive ? 600 : 500 } }
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </>
            )}
        </Box>
    );
};