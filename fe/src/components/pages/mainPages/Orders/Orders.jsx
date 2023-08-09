import { Badge, Box, Typography } from '@mui/material';
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
  const [orders, setOrders] = useState([]);
  const [waitConfirmOrders, setWaitConfirmOrders] = useState([]);
  const [prepareOrders, setPrepareOrders] = useState([]);
  const [deliveringOrders, setDeliveringOrders] = useState([]);
  const [completeOrders, setCompleteOrders] = useState([]);
  const [cancleOrders, setCancleOrders] = useState([]);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    setLoading(true);
    dispatch(getOrder({ customer_id: currentUser.id }))
      .then(unwrapResult)
      .then((res) => {
        console.log({ res });
        setOrders(res.orders);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    setWaitConfirmOrders(() => orders.filter((order) => order.status === 'Chờ xác nhận'));
    setPrepareOrders(() => orders.filter((order) => order.status === 'Đang chuẩn bị'));
    setDeliveringOrders(() => orders.filter((order) => order.status === 'Đang giao hàng'));
    setCompleteOrders(() => orders.filter((order) => order.status === 'Hoàn thành'));
    setCancleOrders(() => orders.filter((order) => order.status === 'Đã hủy'));
  }, [orders]);

  const btnContent = [
    { tab: 0, content: 'Tất cả', color: 'green' },
    { tab: 1, content: 'Chờ xác nhận', color: '#ed6c02', badgeContent: waitConfirmOrders.length },
    { tab: 2, content: 'Đang chuẩn bị', color: '#0288d1', badgeContent: prepareOrders.length },
    { tab: 3, content: 'Đang giao hàng', color: '#0a66b7', badgeContent: deliveringOrders.length },
    { tab: 4, content: 'Hoàn thành', color: 'green' },
    { tab: 5, content: 'Đã hủy', color: '#fe2c55' },
  ];

  const render = (tab) => {
    let comp = [],
      content = '';
    switch (tab) {
      case 0:
        comp = orders;
        content = 'Tất cả';
        break;
      case 1:
        comp = waitConfirmOrders;
        content = 'Chờ xác nhận';
        break;
      case 2:
        comp = prepareOrders;
        content = 'Đang chuẩn bị';
        break;
      case 3:
        comp = deliveringOrders;
        content = 'Đang giao hàng';
        break;
      case 4:
        comp = completeOrders;
        content = 'Hoàn thành';
        break;
      case 5:
        comp = cancleOrders;
        content = 'Đã hủy';
        break;
      default:
        break;
    }

    return comp.length > 0 ? (
      <>
        <Box
          sx={{
            borderRadius: '6px 6px 0 0',
            padding: '10px',
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
        {comp.map((item, index) => (
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
                padding: '5px 10px',
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
      </>
    ) : (
      <Box
        sx={{
          padding: '40px 0 60px 0',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        <Typography fontSize={'2rem'} fontWeight={700} color={'grey'}>
          {`Hiện tại không có đơn "${content.toLowerCase()}"`}
        </Typography>
        <MyButton to={routes.home} padding={'5px 10px'} fontSize={1.6} color={{ mainColor: '#fff', bgColor: 'orange' }}>
          Mua hàng
        </MyButton>
      </Box>
    );
  };

  return (
    <Box sx={{ pb: '20px', pt: '20px' }}>
      <Inner>
        <Box>
          <Box
            sx={{
              borderRadius: '6px',
              display: 'flex',
              gap: '5px',
              justifyContent: 'start',
              padding: '10px',
              mb: '10px',
              backgroundColor: '#00000005',
              border: '1px solid #0000000a',
            }}
          >
            {btnContent.map((btn) => (
              <Badge
                key={btn.tab}
                sx={{ cursor: 'pointer' }}
                variant={btn.badgeContent && btn.badgeContent > 0 ? 'dot' : 'none'}
                color="error"
              >
                <MyButton
                  text
                  fontWeight={700}
                  color={{ mainColor: btn.color }}
                  style={{ borderBottom: btn.tab === tab ? `2px solid ${btn.color}` : '2px solid transparent' }}
                  padding={'1px 9px'}
                  onClick={() => setTab(btn.tab)}
                >
                  {btn.content}
                </MyButton>
              </Badge>
            ))}
          </Box>

          {render(tab)}
        </Box>
      </Inner>
    </Box>
  );
};

export default Orders;
