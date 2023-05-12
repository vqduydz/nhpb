import { Box } from '@mui/material';

import { SnackbarWrapper } from '_/components/common/CustomComponents/CustomMui';
import { useAuth } from '_/context/AuthContext';
import Content from '../DesktopLayout/Content/Content';

function ContentOnlyLayout({ children }) {
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
                justifyContent: 'center',
            }}
        >
            {open && <SnackbarWrapper />}
            <Box
                sx={{
                    width: '100%',
                }}
            >
                <Content>{children}</Content>
            </Box>
        </Box>
    );
}

export default ContentOnlyLayout;
