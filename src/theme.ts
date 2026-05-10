import { createTheme } from '@mui/material';
import type { PaletteMode } from '@mui/material';

export const getAppTheme = (mode: PaletteMode) => {
    const isDark = mode === 'dark';

    // Borders: Google-gray for light, subtle white for dark
    const BORDER_COLOR = isDark ? 'rgba(255, 255, 255, 0.12)' : '#dadce0';

    return createTheme({
        palette: {
            mode,
            primary: {
                main: isDark ? '#90caf9' : '#1a73e8',
            },
            background: {
                default: isDark ? '#1e1e1e' : '#f8fafc', // Slate 900 vs Light Gray
                paper: isDark ? '#252525' : '#ffffff',
            },
            text: {
                primary: isDark ? '#f1f5f9' : '#202124',
                secondary: isDark ? '#94a3b8' : '#5f6368',
            },
            divider: BORDER_COLOR,
        },
        shape: {
            borderRadius: 4,
        },
        components: {
            MuiPaper: {
                defaultProps: {
                    elevation: 0,
                    variant: 'outlined',
                },
                styleOverrides: {
                    root: {
                        backgroundImage: 'none', // Removes MUI's default dark mode overlay
                    },
                    outlined: {
                        borderColor: BORDER_COLOR,
                    },
                },
            },
            MuiButton: {
                defaultProps: { disableElevation: true },
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        fontWeight: 600,
                    },
                    outlined: { borderColor: BORDER_COLOR }
                },
            },
            MuiAppBar: {
                defaultProps: { elevation: 0 },
                styleOverrides: {
                    root: {
                        borderBottom: `1px solid ${BORDER_COLOR}`,
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        color: isDark ? '#f1f5f9' : '#202124',
                    }
                }
            },
        },
    });
};