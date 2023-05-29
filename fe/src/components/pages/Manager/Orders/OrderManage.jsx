import { Box, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { MyButton } from '_/components/common';
import { Inner } from '_/components/common/CustomComponents/CustomMui';
import { useThemMui } from '_/context/ThemeMuiContext';
import { getOrderByOrderCode } from '_/redux/slices';
import { routes } from '_/routes';
import { renderPrice } from '_/utills';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CustomizedTables from '../../mainPages/Orders/CustomizedTables';
import { updateOrderApi } from '_/services/api/orderApi';
import { useAuth } from '_/context/AuthContext';

const OrderManage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order_code: _order_code } = useParams();
  const { loading } = useThemMui();
  const { currentUser } = useAuth();
  const [order, setOrder] = useState({});
  const {
    deliver,
    handler,
    payment_methods,
    order_code,
    status,
    payment,
    ship_fee,
    history,
    total_amount,
    total_payment,
    items,
    receiver,
    orderer,
  } = order;

  useEffect(() => {
    dispatch(getOrderByOrderCode(_order_code))
      .then(unwrapResult)
      .then((res) => {
        const {
          deliver,
          handler,
          payment_methods,
          order_code,
          status,
          payment,
          ship_fee,
          total_amount,
          total_payment,
          items,
          history,
          orderer,
          receiver,
          createdAt,
        } = res;
        setOrder({
          deliver,
          handler,
          payment_methods,
          order_code,
          status,
          payment,
          ship_fee,
          total_amount,
          total_payment,
          history: JSON.parse(history),
          items: JSON.parse(items),
          orderer: { name: JSON.parse(orderer).name, phoneNumber: JSON.parse(orderer).phoneNumber },
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

  const confirmOrder = async () => {
    try {
      const updatedHistory = history.map((item) => {
        if (item.status === 'Đã xác nhận đơn hàng - Bắt đầu chuẩn bị hàng' && status === 'Chờ xác nhận') {
          return { ...item, time: new Date() };
        }
        return item;
      });
      const dataUpdate = {
        handler_id: currentUser.id,
        order_code,
        status: 'Đang chuẩn bị',
        history: JSON.stringify(updatedHistory),
      };
      console.log({ dataUpdate, order });
      await updateOrderApi(dataUpdate).then(() => {
        navigate(routes.ordersmanage);
      });
    } catch (error) {
      console.log(error);
    }
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
                <u> Người đặt</u>
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
                  <Typography>{orderer?.name}</Typography>
                  <Typography>(+84){orderer?.phoneNumber}</Typography>
                </Box>
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
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: '2px', flexDirection: 'column', '& p': { fontWeight: 500 } }}>
                {items?.map((item, index) => (
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
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box sx={{ backgroundColor: '#00000005' }}>
              <CustomizedTables
                sx={{
                  backgroundColor: 'transparent',
                  width: '100%',
                  '& td': { borderColor: '#0000000a', fontWeight: 500, fontSize: '1.6rem', padding: '10px' },
                }}
                rows={rows}
              />
            </Box>
            {status === 'Chờ xác nhận' && (
              <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                <MyButton onClick={confirmOrder} color={{ bgColor: 'orange' }}>
                  Xác nhận đơn hàng
                </MyButton>
              </Box>
            )}
          </Box>
        </Inner>
      </Box>
    </>
  );
};

export default OrderManage;
