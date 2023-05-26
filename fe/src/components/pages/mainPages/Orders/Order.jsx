import { Box, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { MyButton } from '_/components/common';
import { Inner } from '_/components/common/CustomComponents/CustomMui';
import { useThemMui } from '_/context/ThemeMuiContext';
import { getFeedback, getOrderByOrderCode } from '_/redux/slices';
import { routes } from '_/routes';
import { renderPrice } from '_/utills';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import AppOrderTimeline from './AppOrderTimeline';
import CustomizedTables from './CustomizedTables';
import Feedback from './FeedBack';
import * as feedbackAPI from '_/services/api/feedbackApi';
const asdasd = [
  {
    time: '2023-05-24T10:25:33.406Z',
    status: 'Hoàn thành',
  },
  {
    time: '2023-05-24T10:25:33.406Z',
    status: 'Giao hàng',
  },
  {
    time: '2023-05-23T10:25:33.406Z',
    status: 'Chuẩn bị',
  },
  {
    time: '2023-05-23T10:25:32.406Z',
    status: 'Xác nhận đơn hàng',
  },
  {
    time: '2023-05-23T10:25:31.406Z',
    status: 'Tiếp nhận đơn hàng - chờ xác nhận',
  },
];

const Order = () => {
  const dispatch = useDispatch();
  const { order_code: _order_code } = useParams();
  const { loading } = useThemMui();
  const [order, setOrder] = useState({});
  const { payment_methods, order_code, status, payment, ship_fee, total_amount, total_payment, items, receiver } =
    order;
  const [list, setList] = useState([]);
  const [feedback, setfeedback] = useState({ open: false, orderItem: {} });
  const { open } = feedback;
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    dispatch(getOrderByOrderCode(_order_code))
      .then(unwrapResult)
      .then((res) => res.order)
      .then((res) => {
        const {
          payment_methods,
          order_code,
          status,
          payment,
          ship_fee,
          total_amount,
          total_payment,
          items,
          history,
          receiver,
          createdAt,
        } = res;
        setList(JSON.parse(history));
        setOrder({
          payment_methods,
          order_code,
          status,
          payment,
          ship_fee,
          total_amount,
          total_payment,
          items: JSON.parse(items),
          receiver: {
            name: JSON.parse(receiver).name,
            phoneNumber: JSON.parse(receiver).phoneNumber,
            place: JSON.parse(receiver).address,
          },
          createdAt,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    if (!items) return;
    (async () => {
      const promises = items.map(async (item) => {
        try {
          const res = await feedbackAPI.getFeedbackApi({ feedback_code: `${order_code}${item.cartItemId}` });
          return { ...item, feedbacked: res.feedbacked };
        } catch (error) {
          console.log(error);
          return item;
        }
      });

      const result = await Promise.all(promises);
      setOrderItems(result);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  function createData(name, value) {
    return { name, value };
  }

  const rows = [
    createData('Tổng số lượng', total_amount),
    createData('Tổng tiền hàng', renderPrice(payment)),
    createData('Phí giao hàng', renderPrice(ship_fee)),
    createData('Tổng tiền thanh toán', renderPrice(total_payment)),
    createData('Phương thức Thanh toán', payment_methods),
  ];

  const handlefeedback = (item) => {
    setfeedback({ open: true, orderItem: item });
  };

  return (
    <>
      <Box
        sx={{
          mt: '20px',
          mb: '20px',
        }}
      >
        <Inner
          sx={{
            paddingLeft: 0,
            paddingRight: 0,
          }}
        >
          <Box sx={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
            <Box
              sx={{
                padding: '5px 10px',
                backgroundColor: '#00000005',
                border: '1px solid #0000000a',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{
                  '& p': {
                    fontWeight: 500,
                    '& i': {
                      color: '#337ab7',
                      fontWeight: 500,
                    },
                  },
                }}
              >
                <Typography>
                  Mã đơn hàng : <i>{order_code}</i>
                </Typography>
                <Typography>
                  Trạng thái đơn hàng : <i>{status}</i>{' '}
                </Typography>
              </Box>
              <Typography sx={{ mt: 2, pt: 2, borderTop: '1px solid #0000000a', fontWeight: 700 }}>
                <u> Người nhận</u>
              </Typography>
              <Box
                sx={{
                  flexDirection: 'column',
                  display: 'flex',
                  '& p': {
                    fontWeight: 500,
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: '10px',
                  }}
                >
                  <Typography>{receiver?.name}</Typography>
                  <Typography>(+84){receiver?.phoneNumber}</Typography>
                </Box>
                <Typography>Địa chỉ :{` ${receiver?.place}`}</Typography>
              </Box>
            </Box>
            <Box>
              <Box
                sx={{
                  borderRadius: '6px 6px 0 0',
                  padding: '15px 10px',
                  backgroundColor: '#00000005',
                  border: '1px solid #0000000a',
                  display: 'flex',
                  textAlign: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                }}
              >
                <Box>
                  <Typography fontWeight={700}>Sản phẩm</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: '10px' }}>
                  <Typography sx={{ width: '100px', fontWeight: 700 }}>Đơn giá</Typography>
                  <Typography sx={{ width: '30px', fontWeight: 700 }}>SL</Typography>
                  <Typography sx={{ width: '100px', fontWeight: 700 }}>Thành tiền</Typography>
                  <Typography sx={{ width: '120px', fontWeight: 700 }}>Thao tác</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: '2px', flexDirection: 'column', '& p': { fontWeight: 500 } }}>
                {orderItems?.map((item, index) => (
                  <Box
                    key={item.cartItemId}
                    sx={{
                      borderRadius: '6px',
                      padding: '10px',
                      backgroundColor: '#00000005',
                      border: '1px solid #0000000a',
                      display: 'flex',
                      textAlign: 'center',
                      gap: '10px',
                    }}
                  >
                    <Box
                      sx={{
                        flex: 1,
                        display: 'flex',

                        fontSize: '1.4rem',
                        gap: '10px',
                      }}
                    >
                      <img
                        style={{ border: '1px solid #00000009' }}
                        className="verifyImg"
                        width="80"
                        height="60"
                        src={item.image}
                        alt=""
                      />
                      <Box
                        sx={{
                          flex: 1,
                          display: 'flex',
                          fontSize: '1.4rem',
                          gap: '10px',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Box
                          sx={{
                            '& p': {
                              fontWeight: 700,
                              '& i': {
                                color: '#fe2c55',
                                fontWeight: 500,
                                fontSize: '1.3rem',
                              },
                            },
                          }}
                        >
                          <Typography textAlign={'left'}>
                            <MyButton to={`${routes.detail}/${item.slug}`} text target="_blank">
                              {item.name}
                            </MyButton>
                          </Typography>
                          <Typography textAlign={'left'}>
                            <MyButton to={`${routes.menu}#${item.catalog_slug}`} text target="_blank">
                              <i>{item.catalog}</i>
                            </MyButton>
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            gap: '10px',
                            justifyContent: 'end',
                            alignItems: 'center',
                          }}
                        >
                          <Typography sx={{ width: '100px' }} color={'#fe2c55'}>
                            {renderPrice(item.price)}
                          </Typography>
                          <Typography sx={{ width: '30px' }} color={'#fe2c55'}>
                            {item.quantity}
                          </Typography>
                          <Typography sx={{ width: '100px' }} color={'#fe2c55'}>
                            {renderPrice(item.price * item.quantity)}
                          </Typography>
                          {item?.feedbacked ? (
                            <MyButton
                              style={{ width: '120px' }}
                              disable
                              color={{ mainColor: '#fff', bgColor: 'green' }}
                              fontWeight={500}
                              padding={'4px 12px'}
                              fontSize={1.5}
                            >
                              Đã đánh giá
                            </MyButton>
                          ) : (
                            <MyButton
                              style={{ width: '120px' }}
                              onClick={() => handlefeedback(item)}
                              color={{ mainColor: '#fff', bgColor: 'green' }}
                              fontWeight={500}
                              padding={'4px 12px'}
                              fontSize={1.5}
                            >
                              Đánh giá
                            </MyButton>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: '5px' }}>
              <Box
                sx={{
                  backgroundColor: '#00000005',
                  border: '1px solid #0000000a',
                  flex: 1,
                  display: 'flex',
                }}
              >
                <AppOrderTimeline title="Order Timeline" list={asdasd} />
              </Box>
              <Box sx={{ backgroundColor: '#00000005' }}>
                <CustomizedTables sx={{ backgroundColor: 'transparent', minWidth: '400px' }} rows={rows} />
              </Box>
            </Box>
          </Box>
        </Inner>
      </Box>
      {open && <Feedback feedback={feedback} setfeedback={setfeedback} order_code={order_code} />}
    </>
  );
};

export default Order;
