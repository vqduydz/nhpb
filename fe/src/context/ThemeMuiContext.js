import { createTheme, responsiveFontSizes, ThemeProvider, useTheme } from '@mui/material';
import { grey, lightBlue } from '@mui/material/colors';
import { createContext, useContext, useEffect, useState } from 'react';
import { purple } from '@mui/material/colors';

const ThemeMuiContext = createContext({
    showSidebar: null,
    backgroundColor: '',
    color: '',
    switchMode: () => {},
    switchSidebar: () => {},
    loading: null,
    setLoading: () => {},
});

export const useThemMui = () => useContext(ThemeMuiContext);

function ThemeMuiContextProvider({ children }) {
    const them = useTheme();
    localStorage.getItem('testObject');
    // const [mode, setMode] = useState(JSON.parse(localStorage.getItem('mode')) || 'light');
    const [showSidebar, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     localStorage.setItem('mode', JSON.stringify(mode));
    // }, [mode]);

    // const switchMode = () => {
    //     setMode(mode === 'light' ? 'dark' : 'light');
    // };
    const switchSidebar = () => {
        setShow(!showSidebar);
    };

    const breakpoints = them.breakpoints;

    let theme = createTheme({
        breakpoints: {
            values: {
                0: 0,
                240: 240,
                320: 320,
                400: 400,
                480: 480,
                560: 560,
                600: 600,
                640: 640,
                720: 720,
                768: 768,
                800: 800,
                834: 834,
                880: 880,
                960: 960,
                992: 992,
                999: 999,
                1040: 1040,
                1120: 1120,
                1199: 1199,
                1200: 1200,
                1280: 1280,
                1360: 1360,
                1439: 1439,
                1440: 1440,
                1520: 1520,
                1600: 1600,
                1680: 1680,
                1760: 1760,
                1840: 1840,
                1920: 1920,
            },
        },
        components: {
            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        maxWidth: '360px',
                        fontSize: '1.4rem',
                        backgroundColor: '#616161',
                    },
                    arrow: {
                        '::before': {
                            backgroundColor: '#616161',
                        },
                    },
                },
            },
        },
        spacing: 2,
        palette: {
            // mode,

            // ...(mode === 'light'
            //     ? {

            // palette values for light mode
            primary: {
                main: '#ffffff',
            },
            divider: lightBlue[700],
            background: {
                default: '#ffffff',
                paper: '#ffffff',
            },
            text: {
                primary: '#333',
            },
        },
        typography: {
            htmlFontSize: 10,
            fontFamily: '"Montserrat", sans-serif',
            fontSize: 14,
            fontWeightLight: 300,
            fontWeightRegular: 400,
            fontWeightMedium: 500,
            fontWeightBold: 700,
            vanban: {
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 400,
                fontSize: '1.4rem',
                lineHeight: 1.5,
                [breakpoints.up('769')]: {
                    fontSize: '1.6rem',
                },
                [breakpoints.up('1201')]: {
                    fontSize: '1.8rem',
                },
                [breakpoints.up('1801')]: {
                    fontSize: '2rem',
                },
            },
            tieude: {
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 'bold',
                fontSize: '1.8rem',
                lineHeight: 1.5,
                [breakpoints.up('769')]: {
                    fontSize: '2.2rem',
                },
                [breakpoints.up('1201')]: {
                    fontSize: '2.6rem',
                },
                [breakpoints.up('1801')]: {
                    fontSize: '3rem',
                },
                letterSpacing: '0.03333em',
            },
            phude: {
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                lineHeight: 1.5,
                [breakpoints.up('769')]: {
                    fontSize: '1.4rem',
                },
                [breakpoints.up('1201')]: {
                    fontSize: '1.6rem',
                },
                [breakpoints.up('1801')]: {
                    fontSize: '1.8rem',
                },
                letterSpacing: '0.0em',
            },
            caption: {
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 400,
                fontSize: '0.75rem',
                lineHeight: 1.66,
                letterSpacing: '0.03333em',
            },
        },
    });

    const backgroundColor = them.palette.background.default;
    const color = them.palette.text.primary;
    const value = {
        theme,
        backgroundColor,
        color,
        // switchMode,
        loading,
        setLoading,
        showSidebar,
        switchSidebar,
    };

    return (
        <ThemeMuiContext.Provider value={value}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </ThemeMuiContext.Provider>
    );
}

export default ThemeMuiContextProvider;
