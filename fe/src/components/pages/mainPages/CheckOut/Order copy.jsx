import { Box, Typography } from '@mui/material';
import { selector } from '_/redux/selector';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Order = () => {
    const { currentUser } = useSelector(selector.globalStates);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) navigate('/');
    }, [currentUser]);
    return (
        <Box sx={{ display: 'flex', gap: '30px' }}>
            <Typography fontWeight={500}>
                Tên: {currentUser.firstName} {currentUser.lastName}
            </Typography>
            <Typography fontWeight={500}>Số điện thoại: (+84){currentUser.phoneNumber}</Typography>
        </Box>
    );
};

export default Order;
