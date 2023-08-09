import PrintIcon from '@mui/icons-material/Print';
import { Box, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';

import { MyButton } from '_/components/common';
import { Inner } from '_/components/common/CustomComponents/CustomMui';
import { useAuth } from '_/context/AuthContext';
import { useThemMui } from '_/context/ThemeMuiContext';
import { getOrderByOrderCode, getUser } from '_/redux/slices';
import { routes } from '_/routes';
import { updateOrderApi } from '_/services/api/orderApi';
import { renderPrice } from '_/utills';
import CustomizedTables from '../../mainPages/Orders/CustomizedTables';
import DeliverDrop from './DeliverDrop';
import EditOrder from './EditOrder';

const OrderManage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order_code: _order_code } = useParams();

  const { loading } = useThemMui();
  const { currentUser } = useAuth();
  const [order, setOrder] = useState({});
  const [overLay, setOverLay] = useState(false);
  const [deliverUsers, setDeliverUsers] = useState([]);
  const [deliverSelect, setDeliverSelect] = useState({ deliver_name: '', deliver_id: null });
  const [edit, setEdit] = useState(false);

  const {
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
    note,
  } = order;

  useEffect(() => {
    dispatch(getOrderByOrderCode(_order_code))
      .then(unwrapResult)
      .then((res) => {
        const {
          note,
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
          note,
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

    dispatch(getUser({ role: 'Deliver' }))
      .then(unwrapResult)
      .then((result) => {
        setDeliverUsers(result.users);
      })
      .catch((error) => {
        console.log({ error });
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
      await updateOrderApi(dataUpdate).then(() => {
        navigate(routes.ordersmanage);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDeliver = async () => {
    try {
      const updatedHistory = history.map((item) => {
        if (item.status === 'Đã chuẩn bị hàng - Bắt đầu giao hàng' && status === 'Đang chuẩn bị') {
          return { ...item, time: new Date() };
        }
        return item;
      });
      const dataUpdate = {
        deliver_id: deliverSelect.deliver_id,
        order_code,
        status: 'Đang giao hàng',
        history: JSON.stringify(updatedHistory),
      };
      await updateOrderApi(dataUpdate).then(() => {
        navigate(routes.ordersmanage);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const confirmCompleted = async () => {
    try {
      const updatedHistory = history.map((item) => {
        if (item.status === 'Giao hàng thành công' && status === 'Đang giao hàng') {
          return { ...item, time: new Date() };
        }
        return item;
      });
      const dataUpdate = {
        order_code,
        status: 'Hoàn thành',
        history: JSON.stringify(updatedHistory),
      };
      await updateOrderApi(dataUpdate).then(() => {
        navigate(routes.ordersmanage);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!edit) {
      setOverLay(false);
      return;
    }
    setOverLay(true);
  }, [edit]);

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
                  display: 'flex',
                  justifyContent: 'space-between',
                  '& p': {
                    fontWeight: 500,
                    '& i': {
                      color: '#337ab7',
                      fontWeight: 500,
                    },
                  },
                }}
              >
                <Box>
                  <Typography>
                    Mã đơn hàng : <i>{order_code}</i>
                  </Typography>
                  <Typography>
                    Trạng thái đơn hàng : <i>{status}</i>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignContent: 'center',
                    gap: '10px',
                  }}
                >
                  <MyButton
                    style={{ width: '30px' }}
                    onClick={() => {
                      setEdit(true);
                    }}
                  >
                    <EditIcon />
                  </MyButton>
                  <MyButton to={`${routes.bill}/${order_code}`} style={{ width: '30px' }} target="_blank">
                    <PrintIcon />
                  </MyButton>
                </Box>
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
                    key={index}
                    sx={{
                      padding: '5px 10px',
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
                          <Typography color={'#337ab7'} textAlign={'left'}>
                            {item.name}
                          </Typography>
                          <Typography textAlign={'left'}>
                            <i>{item.catalog}</i>
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
                  '& td': { borderColor: '#0000000a', fontWeight: 500, fontSize: '1.6rem', padding: '3px 8px' },
                }}
                rows={rows}
              />
            </Box>
            <Typography color={'#fe2c55'}>
              <i>Ghi chú : {note}</i>
            </Typography>
            <Box sx={{ mt: '10px', display: 'flex', justifyContent: 'end' }}>
              {status === 'Chờ xác nhận' && (
                <MyButton onClick={confirmOrder} color={{ bgColor: 'orange' }}>
                  Xác nhận đơn hàng
                </MyButton>
              )}
              {status === 'Đang chuẩn bị' && (
                <Box sx={{ display: 'flex' }}>
                  <DeliverDrop
                    deliverlist={deliverUsers}
                    deliverSelect={deliverSelect}
                    setDeliverSelect={setDeliverSelect}
                  />
                  <MyButton
                    disable={!deliverSelect}
                    style={{ width: '300px' }}
                    onClick={confirmDeliver}
                    color={{ bgColor: 'orange' }}
                  >
                    Xác nhận giao hàng
                  </MyButton>
                </Box>
              )}
              {status === 'Đang giao hàng' && (
                <MyButton style={{ width: '280px' }} onClick={confirmCompleted} color={{ bgColor: 'orange' }}>
                  Xác nhận hoàn thành đơn hàng
                </MyButton>
              )}
            </Box>
          </Box>
        </Inner>
      </Box>

      {(overLay || edit) && (
        <Box sx={{ zIndex: 3, backgroundColor: '#212121', position: 'relative' }}>
          {overLay && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                opacity: 0.6,
                transition: 'bottom 0.3s linear 0s',
                backgroundColor: '#212121',
              }}
              onClick={() => {
                setEdit(false);
              }}
            />
          )}
          {edit && <EditOrder value={order} setEdit={setEdit} edit={edit} />}
        </Box>
      )}
    </>
  );
};

export default OrderManage;
