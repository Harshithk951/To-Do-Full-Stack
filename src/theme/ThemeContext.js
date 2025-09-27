import React, { createContext, useState, useMemo, useContext } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { lightTheme } from './lightTheme'; // CORRECTED PATH
import { darkTheme } from './darkTheme';   // CORRECTED PATH

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const AppThemeProvider = ({ children }) => {
    const [themeMode, setThemeMode] = useState('light');

    const theme = useMemo(() => (themeMode === 'light' ? lightTheme : darkTheme), [themeMode]);

    return (
        <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
            <MuiThemeProvider theme={theme}>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};