// src/context/ColorModeContext.ts
import { createContext, useContext } from 'react';

export interface ColorModeContextType {
    toggleColorMode: () => void;
    mode: 'light' | 'dark';
}

export const ColorModeContext = createContext<ColorModeContextType>({
    toggleColorMode: () => {},
    mode: 'light',
});

// Helper hook for easy access
export const useColorMode = () => useContext(ColorModeContext);