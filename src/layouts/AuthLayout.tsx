import React from 'react';
import { Box, Paper, Typography, Container } from '@mui/material';

interface AuthLayoutProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
    return (
        <Box
            sx={{
                // background.default ensures the whole page canvas respects light/dark mode
                bgcolor: 'background.default',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={4}
                    sx={{
                        // background.paper gives the card a distinct surface color in both modes
                        bgcolor: 'background.paper',
                        p: { xs: 3, md: 5 }, // Less padding on mobile, more on desktop
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: 2,
                    }}
                >
                    <Typography
                        component="h1"
                        variant="h4"
                        color="text.primary"
                        sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 4, textAlign: 'center' }}
                    >
                        {subtitle}
                    </Typography>

                    {/* This is where your form (Login/Register) will be injected */}
                    <Box sx={{ width: '100%' }}>
                        {children}
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};