import { Box } from '@mui/material';

import { SnackbarWrapper } from '_/components/common/CustomComponents/CustomMui';
import { useAuth } from '_/context/AuthContext';
import { Header } from '.';
import Content from './Content/Content';
import Footer from './Footer/Footer';

function DesktopLayout({ children }) {
    const { snackbar } = useAuth();
    const { open } = snackbar;

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignContent: 'center',
            }}
        >
            {open && <SnackbarWrapper />}
            <Header />
            <Box
                sx={{
                    width: '100%',
                    minWidth: '768px',
                    marginTop: `var(--header-height)`,
                }}
            >
                <Content>{children}</Content>
            </Box>

            <Box
                sx={{
                    width: '100%',
                    minWidth: '768px',
                }}
            >
                <Footer />
            </Box>
        </Box>
    );
}

export default DesktopLayout;
