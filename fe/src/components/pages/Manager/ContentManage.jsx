import { Box } from '@mui/material';
import { muiCustomStyles } from '_/components/common/CustomComponents/CustomMui';
import { styleBtn } from './styleBtn';

const ContentManage = () => {
    return (
        <Box sx={{ ...muiCustomStyles, ...styleBtn }}>
            <Box sx={{ margin: '20px auto', textAlign: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
                Order Manage
            </Box>
        </Box>
    );
};

export default ContentManage;
