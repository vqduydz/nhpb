import { useAuth } from '_/context/AuthContext';
import classNames from 'classnames/bind';
import { useEffect } from 'react';

import { Alert, Box, Slide, Snackbar } from '@mui/material';
import Content from '../DesktopLayout/Content/Content';
import styles from './ContentOnlyLayout.module.scss';

const cx = classNames.bind(styles);

function ContentOnlyLayout({ children }) {
    const { snackbar, handleCloseSnackbar, currentUser } = useAuth();
    const { open, message, status } = snackbar;
    useEffect(() => {
        // if (currentUser && currentUser.role !== 'Customer') navigate(routes.manage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);
    const TransitionDown = (props) => {
        return <Slide {...props} direction="down" />;
    };

    return (
        <div className={cx('wrapper')}>
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
            <div className={cx('content')}>
                <Content>{children}</Content>
            </div>
        </div>
    );
}

export default ContentOnlyLayout;
