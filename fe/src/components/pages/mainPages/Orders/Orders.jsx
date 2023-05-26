import { Box, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { MyButton } from '_/components/common';
import { Inner } from '_/components/common/CustomComponents/CustomMui';
import { useAuth } from '_/context/AuthContext';
import { useThemMui } from '_/context/ThemeMuiContext';
import { getOrder } from '_/redux/slices';
import { routes } from '_/routes';
import { dateTimeFormate, renderPrice } from '_/utills';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const Orders = () => {
    const dispatch = useDispatch();
    const { currentUser } = useAuth();
    const { setLoading } = useThemMui();
    const [order, setOrder] = useState([]);
    useEffect(() => {
        setLoading(true);
        dispatch(getOrder(currentUser.id))
            .then(unwrapResult)
            .then((res) => {
                console.log({ res });
                setOrder(res.orders);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box sx={{ pb: '20px', pt: '20px' }}>
            <Inner>
                <Box>
                    <Box
                        sx={{
                            borderRadius: '6px 6px 0 0',
                            padding: '15px 10px',
                            backgroundColor: '#00000005',
                            border: '1px solid #0000000a',
                            display: 'flex',
                            flexDirection: 'row',
                            textAlign: 'center',
                            justifyContent: 'space-between',
                            gap: '10px',
                            '& p': {
                                flex: 1,
                                fontWeight: 700,
                            },
                        }}
                    >
                        <Typography textAlign={'left'}>Mã đơn hàng</Typography>
                        <Typography textAlign={'center'}>Thời gian đặt</Typography>
                        <Typography textAlign={'center'}>Tổng Thanh toán</Typography>
                        <Typography textAlign={'right'}>Trạng thái</Typography>
                    </Box>

                    {order.map((item, index) => (
                        <MyButton
                            text
                            style={{ width: '100%' }}
                            padding={'0 0'}
                            key={item.id}
                            to={routes.orders + '/' + item.order_code}
                            target="_blank"
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    gap: '10px',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '15px 10px',
                                    backgroundColor: index % 2 === 0 ? '#fff' : '#f5f5f5',
                                    border: '1px solid #0000000a',
                                    textAlign: 'center',
                                    '& p': {
                                        flex: 1,
                                    },
                                }}
                            >
                                <Typography textAlign={'left'}>{item.order_code}</Typography>
                                <Typography textAlign={'center'}>{dateTimeFormate(item.createdAt)}</Typography>
                                <Typography textAlign={'center'} color={'#fe2c55'}>
                                    {renderPrice(item.total_payment)}
                                </Typography>
                                <Typography textAlign={'right'}>{item.status}</Typography>
                            </Box>
                        </MyButton>
                    ))}
                </Box>
            </Inner>
        </Box>
    );
};

export default Orders;
