import { Box } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAuth } from '_/context/AuthContext';
import { useThemMui } from '_/context/ThemeMuiContext';
import { getOrder } from '_/redux/slices';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const Order = () => {
    const dispatch = useDispatch();
    const { cartItems, handleGetCartItem, currentUser } = useAuth();
    const { setLoading } = useThemMui();
    useEffect(() => {
        setLoading(true);
        dispatch(getOrder(currentUser.id))
            .then(unwrapResult)
            .then((res) => {
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    }, []);
    return <Box>Order</Box>;
};

export default Order;
