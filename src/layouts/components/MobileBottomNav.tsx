import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import type {JSX} from "react";

interface MobileBottomNavProps {
    navItems: Array<{ label: string; path: string; icon: JSX.Element }>;
    activeIndex: number;
    handleNavigation: (index: number) => void;
}

export const MobileBottomNav = ({ navItems, activeIndex, handleNavigation }: MobileBottomNavProps) => {
    return (
        <Paper
            elevation={0} // Removed shadow
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                display: { xs: 'block', md: 'none' },
                zIndex: 1000,
                borderTop: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
                borderRadius: 0 // Ensure it sits flush at the bottom
            }}
        >
            <BottomNavigation
                showLabels
                value={activeIndex}
                onChange={(_, newValue) => handleNavigation(newValue)}
                sx={{
                    height: 70,
                    bgcolor: 'transparent',
                    '& .MuiBottomNavigationAction-root': {
                        color: 'text.secondary',
                        minWidth: 'auto',
                        padding: '6px 0px 8px',
                    },
                    '& .Mui-selected': {
                        color: 'primary.main',
                    }
                }}
            >
                {navItems.map((item) => (
                    <BottomNavigationAction
                        key={item.label}
                        icon={item.icon}
                    />
                ))}
            </BottomNavigation>
        </Paper>
    );
};