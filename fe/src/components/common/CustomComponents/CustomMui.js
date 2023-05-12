import {
    Alert,
    AppBar,
    Box,
    Slide,
    Snackbar,
    styled,
    TextField,
    Tooltip,
    useScrollTrigger,
    useTheme,
} from '@mui/material';
import { useAuth } from '_/context/AuthContext';
import { cloneElement } from 'react';

export const muiCustomStyles = {
    '&  a': {
        textTransform: 'capitalize',
    },
    '& a:focus,a:hover': {
        // textDecoration: 'underline',
        outline: 'none',
        outlineOffset: 'none',
    },
    '& label.Mui-focused': {
        color: 'currentcolor',
    },
    '& .MuiOutlinedInput-root': {
        '& input': { color: 'currentcolor' },
        '&.Mui-focused fieldset': {
            border: '1px solid currentcolor',
        },
    },
    '& input': {
        fontSize: '1.4rem',
    },
    '& span.Mui-checked': {
        color: 'currentcolor !important',
    },
};

export const MyTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#000',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'green',
    },
    '& .MuiOutlinedInput-root': {
        color: '#000',
        '& fieldset': {
            borderColor: '#aeaeae',
        },
        '&:hover fieldset': {
            borderColor: '#c7c7c7',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#000',
        },
    },
    ...muiCustomStyles,
});

export const MyTooltip = styled(Tooltip)({
    '& label.Mui-focused': {
        color: '#fff',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'green',
    },
    '& .MuiOutlinedInput-root': {
        color: '#fff',
        '& fieldset': {
            borderColor: '#aeaeae',
        },
        '&:hover fieldset': {
            borderColor: '#c7c7c7',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#fff',
        },
    },
});

export const MyAppBar = ({ children, sx }) => {
    const ScrollHandler = ({ window, children }) => {
        const theme = useTheme();

        const trigger = useScrollTrigger({
            disableHysteresis: true,
            threshold: 50,
            target: window ? window() : undefined,
        });

        let bgcl;
        if (theme.palette.mode === 'dark') bgcl = 'black';
        else bgcl = '#f1f1f1';

        return cloneElement(children, {
            // set style
            style: {
                backgroundColor: trigger ? bgcl : theme.palette.background.default,
                transition: '0.5s',
                boxShadow: trigger ? '' : 'none',
                backgroundImage: 'none',
                display: 'block',
            },
        });
    };

    const ScrollToChangeStyle = (props) => {
        return <ScrollHandler {...props}>{props.children}</ScrollHandler>;
    };

    return (
        <ScrollToChangeStyle>
            <AppBar sx={{ ...sx }} position="static">
                {children}
            </AppBar>
        </ScrollToChangeStyle>
    );
};

export const Inner = ({ sx = {}, children, className }) => {
    const baseStyle = {
        paddingRight: '1.5rem',
        paddingLeft: '1.5rem',
        marginRight: 'auto',
        marginLeft: 'auto',
        // width: '100%',
        // minWidth: 'calc(768px - 3rem)',
    };
    const Inner = styled('div')(({ theme }) => ({
        [theme.breakpoints.up('768')]: {
            maxWidth: '768px',
        },
        [theme.breakpoints.up('992')]: {
            maxWidth: '992px',
        },
        [theme.breakpoints.up('1200')]: {
            maxWidth: '1200px',
        },
        [theme.breakpoints.up('1440')]: {
            maxWidth: '1440px',
        },
    }));
    const classes = [className];
    return (
        <Inner className={classes} sx={{ ...baseStyle, ...sx }}>
            {children}
        </Inner>
    );
};

// Tooltip - click
// const [open, setOpen] = useState(false);

// const handleTooltipClose = () => {
//     setOpen(false);
// };

// const handleTooltipOpen = () => {
//     setOpen(true);
// };

// <ClickAwayListener onClickAway={handleTooltipClose}>
// <Tooltip
//     className={cx('tooltip')}
//     title={<UserPopper />}
//     arrow
//     TransitionComponent={Zoom}
//     PopperProps={{
//         disablePortal: true,
//     }}
//     onClose={handleTooltipClose}
//     open={open}
//     disableFocusListener
//     disableHoverListener
//     disableTouchListener
// >
//     <div onClick={handleTooltipOpen} className={cx('user-box')}>
//         <UserAvatar />
//     </div>
// </Tooltip>
// </ClickAwayListener>

export const SnackbarWrapper = ({ sx = {}, children, className }) => {
    const { snackbar, handleCloseSnackbar } = useAuth();
    const { open, message, status } = snackbar;

    const TransitionDown = (props) => {
        return <Slide {...props} direction="down" />;
    };

    return (
        <Box
            sx={{
                '& .MuiSnackbar-anchorOriginTopCenter': {
                    position: 'fixed',
                    top: '20%',
                    left: '50%',
                    width: 'fit-content',
                    transform: 'translate(-50%,-20%)',
                    '& .MuiAlert-root': {
                        alignItems: 'center',
                        fontSize: '1.8rem',
                        '& .MuiSvgIcon-root': { fontSize: '2.5rem' },
                    },
                },
            }}
        >
            <Snackbar
                TransitionComponent={TransitionDown}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={open}
                autoHideDuration={2000}
                onClose={() => {
                    handleCloseSnackbar(status);
                }}
            >
                <Alert
                    variant="filled"
                    onClose={() => {
                        handleCloseSnackbar(status);
                    }}
                    severity={status}
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    );
};
