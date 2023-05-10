import { Alert, Box, Slide, Snackbar } from '@mui/material';
import { useAuth } from '_/context/AuthContext';
import classNames from 'classnames/bind';
import { Header } from '.';
import Content from './Content/Content';
import styles from './DesktopLayout.module.scss';
import Footer from './Footer/Footer';

const cx = classNames.bind(styles);

function DesktopLayout({ children }) {
    const { snackbar, handleCloseSnackbar } = useAuth();
    const { open, message, status } = snackbar;

    const TransitionDown = (props) => {
        return <Slide {...props} direction="down" />;
    };

    return (
        <Box className={cx('wrapper')}>
            {open && (
                <Box
                    sx={{
                        '& .MuiSnackbar-anchorOriginTopCenter': {
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            width: 'fit-content',
                            transform: 'translate(-50%,-50%)',
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
            )}
            <Header />
            <div className={cx('content')}>
                <Content>{children}</Content>
            </div>

            <div className={cx('footer')}>
                <Footer />
            </div>
        </Box>
    );
}

export default DesktopLayout;
