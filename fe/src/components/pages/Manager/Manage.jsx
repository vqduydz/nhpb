import { Box } from '@mui/material';
import { styleBtn } from './styleBtn';
import { muiCustomStyles } from '_/components/common/CustomComponents/CustomMui';

export default function Manage() {
    return (
        <Box sx={{ ...muiCustomStyles, ...styleBtn }}>
            <Box sx={{ margin: '20px auto', textAlign: 'center', fontSize: '2rem', fontWeight: 'bold' }}>Manage</Box>
        </Box>
    );
}
