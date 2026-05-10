// src/context/ColorModeProvider.tsx
import React, { useMemo, useState } from 'react';
import { ThemeProvider, useMediaQuery, CssBaseline } from '@mui/material';
import type { PaletteMode } from '@mui/material';
import { ColorModeContext } from './ColorModeContext';
import { getAppTheme } from '../theme';

export const ColorModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    // We use 'undefined' to mean "user hasn't manually chosen yet"
    const [manualMode, setManualMode] = useState<PaletteMode | undefined>(undefined);

    // DERIVED STATE: No useEffect needed!
    // If manualMode is set, use it. Otherwise, use system preference.
    const mode = manualMode ?? (prefersDarkMode ? 'dark' : 'light');

    const colorMode = useMemo(() => ({
        toggleColorMode: () => {
            setManualMode((prev) => {
                // If they haven't toggled yet, the next step is the opposite of system
                const currentMode = prev ?? (prefersDarkMode ? 'dark' : 'light');
                return currentMode === 'light' ? 'dark' : 'light';
            });
        },
        mode,
    }), [prefersDarkMode, mode]);

    const theme = useMemo(() => getAppTheme(mode), [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline /> {/* Crucial for dark mode background colors */}
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};