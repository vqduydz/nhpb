import { Box, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import zalopay from '_/assets/icon/ZaloPay.png';
import banking from '_/assets/icon/banking.png';
import momo from '_/assets/icon/momo.png';
import { MyButton } from '_/components/common';
import { Inner } from '_/components/common/CustomComponents/CustomMui';
import { selector } from '_/redux/selector';
import { createNewOrder, setOrderItems, deleteCartItem } from '_/redux/slices';
import { routes } from '_/routes';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Receiver from './Receiver';
import { dateTimeFormate, renderPrice } from '_/utills';
import removeVietnameseTones from '_/utills/removeVietnameseTones';
import { unwrapResult } from '@reduxjs/toolkit';
import { useThemMui } from '_/context/ThemeMuiContext';
import { useAuth } from '_/context/AuthContext';

const CheckOut = () => {
  const [total, setTotal] = useState();
  const { currentUser } = useAuth();
  const { orderItems, userID } = useSelector(selector.globalStates);
  const [place, setPlace] = useState();
  const navigate = useNavigate();
  const { setLoading } = useThemMui();
  const dispatch = useDispatch();
  const [shipFee, setShipFee] = useState(100000);
  const [updateModel, setUpdateModel] = useState({ orderer: false, receiver: false });
  const [receiver, setReceiver] = useState({
    status: false,
    name: currentUser.firstName + ' ' + currentUser.lastName,
    phoneNumber: currentUser.phoneNumber,
    address: currentUser.place,
    position: null,
  });

  useEffect(() => {
    if (!currentUser.place) return;
    const place = JSON.parse(currentUser.place);
    const address = `${place.address}, ${place.ward}, ${place.district}, ${place.province}`;
    setReceiver({ ...receiver, address });
    setPlace(address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.place]);

  useEffect(() => {
    if (!orderItems.length) return;

    const total = orderItems.reduce((acc, c) => {
      return acc + c.total;
    }, 0);
    setTotal(total);
    total < 1000000 ? setShipFee(100000) : total >= 1000000 && total < 2000000 ? setShipFee(50000) : setShipFee(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderItems]);

  const handlePay = async (e) => {
    const data = new FormData(e.currentTarget);
    e.preventDefault();
    setLoading(true);
    const { name, phoneNumber, address } = receiver;
    console.log({ address });
    const orderData = {
      payment_methods: data.get('payment-methods'),
      order_code: `${userID}${removeVietnameseTones(dateTimeFormate(new Date())).replace(/ /g, '')}`,
      customer_id: userID,
      items: JSON.stringify(orderItems),
      total_amount: orderItems.reduce((acc, c) => {
        return acc + c.quantity;
      }, 0),
      payment: total,
      ship_fee: shipFee,
      total_payment: total + shipFee,
      status: 'Chờ xác nhận',
      history: JSON.stringify([
        {
          time: null,
          status: 'Giao hàng thành công',
          stt_code: 4,
        },
        {
          time: null,
          status: 'Đã chuẩn bị hàng - Bắt đầu giao hàng',
          stt_code: 3,
        },
        {
          time: null,
          status: 'Đã xác nhận đơn hàng - Bắt đầu chuẩn bị hàng',
          stt_code: 2,
        },
        {
          time: new Date(),
          status: 'Đã đặt hàng - chờ xác nhận',
          stt_code: 1,
        },
      ]),
      orderer: JSON.stringify({
        name: currentUser.firstName + ' ' + currentUser.lastName,
        phoneNumber: currentUser.phoneNumber,
      }),
      receiver: JSON.stringify({ name, phoneNumber, address }),
    };
    console.log({ orderData });
    dispatch(createNewOrder(orderData))
      .then(unwrapResult)
      .then(() => {
        orderItems.forEach((item) => {
          dispatch(deleteCartItem(item.cartItemId)).then(() => {
            dispatch(setOrderItems([]));
            setLoading(false);
            navigate(routes.orders);
          });
        });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleCancle = () => {
    dispatch(setOrderItems([]));
    navigate(routes.cart);
  };

  return (
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
              borderRadius: '6px',
              padding: '15px 10px',
              backgroundColor: '#00000005',
              border: '1px solid #0000000a',
              display: 'flex',
              flexDirection: 'column',
              // textAlign: 'center',
              justifyContent: 'space-between',
              gap: '5px',
            }}
          >
            <Typography fontSize={'1.8rem'} fontWeight={700}>
              THÔNG TIN KHÁCH HÀNG
            </Typography>

            <Box sx={{ display: 'flex', gap: '30px' }}>
              <Typography fontWeight={500}>
                Tên: {currentUser?.firstName} {currentUser?.lastName}
              </Typography>
              <Typography fontWeight={500}>Số điện thoại: (+84){currentUser?.phoneNumber}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: '10px' }}>
              <Typography fontWeight={500}> Địa chỉ: </Typography>
              {currentUser.place ? (
                <>
                  <Typography fontWeight={500}>{place}</Typography>
                  <MyButton
                    onClick={() => setUpdateModel({ orderer: true })}
                    padding={'0 5px'}
                    color={{ bgColor: 'orange' }}
                    fontWeight={500}
                  >
                    Thay đổi
                  </MyButton>
                </>
              ) : (
                <MyButton
                  onClick={() => setUpdateModel({ orderer: true })}
                  fontSize={1.6}
                  padding={'0 5px'}
                  color={{ bgColor: 'orange' }}
                  fontWeight={500}
                >
                  Cập nhật
                </MyButton>
              )}
            </Box>
            <Box sx={{ borderTop: '1px solid #0000001a', mt: '10px', pt: '10px' }}>
              <Receiver
                updateModel={updateModel}
                setUpdateModel={setUpdateModel}
                receiver={receiver}
                setReceiver={setReceiver}
              />
            </Box>
            <Typography fontWeight={700} color={'#fe2c55'}>
              Vui lòng kiểm tra thông tin khách hàng thật cẩn thận trước khi đặt hàng.
            </Typography>
            <Typography sx={{ display: 'flex', gap: '5px' }} fontWeight={700} color={'#fe2c55'}>
              Nếu người nhận là ai đó khác xin
              <MyButton
                fontSize={1.6}
                padding={'0 5px'}
                color={{ bgColor: 'orange' }}
                fontWeight={500}
                onClick={() => setUpdateModel({ receiver: true })}
              >
                cập nhật thêm thông tin người nhận
              </MyButton>
            </Typography>
          </Box>
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
              }}
            >
              <Box sx={{ gap: '10px', display: 'flex', flexDirection: 'row' }}>
                <Typography fontWeight={700}>Sản phẩm</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                <Typography sx={{ display: 'block', width: '100px', fontWeight: 700 }}>Đơn giá</Typography>
                <Typography sx={{ display: 'block', width: '30px', fontWeight: 700 }}>SL</Typography>
                <Typography sx={{ display: 'block', width: '100px', fontWeight: 700 }}>Thành tiền</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: '2px', flexDirection: 'column' }}>
              {orderItems.map((item) => (
                <Box
                  key={item.slug}
                  sx={{
                    borderRadius: '6px',
                    padding: '15px 10px',
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
                      flexDirection: 'row',
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
                          flexDirection: 'row',
                          fontSize: '1.4rem',
                          gap: '10px',
                          justifyContent: 'end',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          sx={{ display: 'block', width: '100px' }}
                          mt={2}
                          fontSize={'1.6rem'}
                          fontWeight={500}
                          color={'#fe2c55'}
                        >
                          {renderPrice(item.price)}
                        </Typography>

                        <Typography
                          sx={{ display: 'block', width: '30px' }}
                          mt={2}
                          fontSize={'1.6rem'}
                          fontWeight={500}
                          color={'#fe2c55'}
                        >
                          {item.quantity}
                        </Typography>
                        <Typography
                          sx={{ display: 'block', width: '100px' }}
                          mt={2}
                          fontSize={'1.6rem'}
                          fontWeight={500}
                          color={'#fe2c55'}
                        >
                          {renderPrice(item.price * item.quantity)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
          <form onSubmit={handlePay}>
            {/* Phương thức thanh toán */}
            <Box
              sx={{
                display: 'flex',
                gap: '10px',
                flexDirection: 'column',
                borderRadius: '6px',
                padding: '15px 10px',
                backgroundColor: '#00000005',
                border: '1px solid #0000000a',
              }}
            >
              <Typography fontSize={'1.6rem'} fontWeight={700}>
                PHƯƠNG THỨC THANH TOÁN
              </Typography>

              <RadioGroup
                className="a1c2"
                sx={{
                  ml: '20px',
                  display: 'flex',
                  gap: '20px',
                  color: '#333',
                  '& label.MuiFormControlLabel-root.MuiFormControlLabel-labelPlacementEnd': {
                    borderRadius: '10px',
                    height: '50px',
                  },
                  '& .MuiRadio-root.Mui-checked': { color: '#333' },
                  '& span.MuiButtonBase-root.MuiRadio-root': {
                    display: 'flex',
                    '::after': {
                      display: 'block',
                      content: `''`,
                      height: '40px',
                      width: '80px',
                      ml: '5px',
                      position: 'relative',
                      backgroundPosition: 'center center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'contain',
                      borderRadius: '6px',
                      backgroundColor: 'transparent',
                    },
                  },
                }}
                defaultValue="zalopay"
                row
                aria-labelledby="payment-methods"
                name="payment-methods"
              >
                <FormControlLabel
                  sx={{
                    border: '1px solid #333',
                    padding: '5px 10px',
                    position: 'relative',
                    '& span.MuiButtonBase-root.MuiRadio-root': {
                      display: 'flex',
                      '::after': {
                        backgroundImage: `url(${zalopay})`,
                      },
                    },
                  }}
                  value="zalopay"
                  control={<Radio />}
                >
                  <img width="60" height="30" src={zalopay} alt="Zalo pay" />
                </FormControlLabel>
                <FormControlLabel
                  sx={{
                    border: '1px solid #333',
                    padding: '5px 10px',
                    position: 'relative',
                    '& span.MuiButtonBase-root.MuiRadio-root': {
                      display: 'flex',
                      '::after': {
                        backgroundImage: `url(${momo})`,
                        width: '40px',
                      },
                    },
                  }}
                  value="momo"
                  control={<Radio />}
                />
                <FormControlLabel
                  sx={{
                    border: '1px solid #333',
                    padding: '5px 10px',
                    position: 'relative',
                    '& span.MuiButtonBase-root.MuiRadio-root': {
                      display: 'flex',
                      '::after': {
                        backgroundImage: `url(${banking})`,
                        width: '40px',
                      },
                    },
                  }}
                  value="banking"
                  control={<Radio />}
                />
              </RadioGroup>
            </Box>
            {/* Thành tiền */}
            <Box sx={{ mt: '20px', display: 'flex', gap: '10px', flexDirection: 'column' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  fontSize: '1.8rem',
                  gap: '30px',
                  justifyContent: 'end',
                  alignItems: 'center',
                  padding: '0 20px',
                  color: '#fe2c55',
                }}
              >
                <Typography fontWeight={700} fontSize={'1.6rem'}>
                  Tổng tiền
                </Typography>
                <Typography
                  textAlign={'right'}
                  fontWeight={700}
                  fontSize={'1.6rem'}
                  sx={{ display: 'block', width: '120px' }}
                >
                  {renderPrice(total)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  fontSize: '1.8rem',
                  gap: '30px',
                  justifyContent: 'end',
                  alignItems: 'center',
                  padding: '0 20px',
                  color: '#fe2c55',
                }}
              >
                <Typography fontWeight={700} fontSize={'1.6rem'}>
                  Phí giao hàng
                </Typography>
                <Typography
                  textAlign={'right'}
                  fontWeight={700}
                  fontSize={'1.6rem'}
                  sx={{ display: 'block', width: '120px' }}
                >
                  {renderPrice(shipFee)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  fontSize: '1.8rem',
                  gap: '30px',
                  justifyContent: 'end',
                  alignItems: 'center',
                  padding: '0 20px',
                  color: '#fe2c55',
                }}
              >
                <Typography fontWeight={700} fontSize={'1.6rem'}>
                  Tổng tiền thanh toán
                </Typography>
                <Typography
                  textAlign={'right'}
                  fontWeight={700}
                  fontSize={'1.6rem'}
                  sx={{ display: 'block', width: '120px' }}
                >
                  {renderPrice(total + shipFee)}
                </Typography>
              </Box>
              <Box
                sx={{
                  paddingRight: '20px',
                  display: 'flex',
                  gap: '20px',
                  justifyContent: 'end',
                }}
              >
                <MyButton
                  type="button"
                  onClick={handleCancle}
                  style={{ width: '200px' }}
                  color={{ mainColor: '#fff', bgColor: '#fe2c55' }}
                  fontWeight={700}
                  padding={'4px 12px'}
                  fontSize={1.5}
                >
                  Hủy
                </MyButton>
                {!receiver.status && !currentUser.place ? (
                  <MyButton
                    type="button"
                    style={{ width: '200px' }}
                    color={{ mainColor: '#fff', bgColor: 'green' }}
                    fontWeight={700}
                    padding={'4px 12px'}
                    fontSize={1.5}
                    disable
                  >
                    Đặt hàng
                  </MyButton>
                ) : (
                  <MyButton
                    type="submit"
                    style={{ width: '200px' }}
                    color={{ mainColor: '#fff', bgColor: 'green' }}
                    fontWeight={700}
                    padding={'4px 12px'}
                    fontSize={1.5}
                  >
                    Đặt hàng
                  </MyButton>
                )}
              </Box>
            </Box>
          </form>
        </Box>
      </Inner>
    </Box>
  );
};

export default CheckOut;
