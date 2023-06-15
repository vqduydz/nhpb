import DeleteIcon from '@mui/icons-material/Delete';
import { Alert, Box, Slide, Snackbar, Typography } from '@mui/material';
import { MyButton } from '_/components/common';
import { Inner } from '_/components/common/CustomComponents/CustomMui';
import { memo, useEffect, useMemo, useState } from 'react';
import Quantity from './Quantity';
import { useDispatch } from 'react-redux';
import { deleteCartItem, setOrderItems } from '_/redux/slices';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAuth } from '_/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { routes } from '_/routes';
import emptyCart from '_/assets/images/empty-cart.png';
import { useThemMui } from '_/context/ThemeMuiContext';
import { renderPrice } from '_/utills';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, handleGetCartItem, currentUser } = useAuth();
  const { setLoading } = useThemMui();
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [total, setTotal] = useState(0);
  const [cartItemDelete, setCartItemDelete] = useState({
    openDelete: false,
    idCartItemDelete: '',
    nameCartItemDelete: '',
  });

  const { openDelete, idCartItemDelete, nameCartItemDelete } = cartItemDelete;
  const selectedFoodsMemo = useMemo(() => selectedFoods, [selectedFoods]);

  useEffect(() => {
    const total = selectedFoodsMemo.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.price * currentValue.quantity;
    }, 0);
    setTotal(total);
  }, [selectedFoodsMemo]);

  const delCartItem = (id, name) => {
    setCartItemDelete({ openDelete: true, idCartItemDelete: id, nameCartItemDelete: name });
  };

  const handleDeleteCartItem = (id) => {
    setLoading(true);
    dispatch(deleteCartItem(id))
      .then(unwrapResult)
      .then(() => {
        setLoading(false);
        handleGetCartItem(currentUser.id);
        setSelectedFoods(selectedFoods.filter((f) => f.id !== id));
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const handleOrder = () => {
    const orderItems = selectedFoodsMemo.map((item) => ({
      catalog: item.catalog,
      catalog_slug: item.catalogSlug,
      menu_id: item.menu_id,
      cartItemId: item.id,
      quantity: item.quantity,
      name: item.name,
      price: item.price,
      image: item.image,
      slug: item.slug,
      total: item.quantity * item.price,
    }));
    dispatch(setOrderItems(orderItems));
    navigate(routes.checkout);
  };

  // handle select

  const TransitionDown = (props) => {
    return <Slide {...props} direction="down" />;
  };

  return (
    <Box
      sx={{
        mt: '20px',
        mb: '20px',
        minHeight: '100px',
      }}
    >
      {openDelete && (
        <Box
          sx={{
            '& .MuiSnackbar-anchorOriginTopCenter': {
              position: 'fixed',
              top: '20%',
              left: '50%',
              width: 'fit-content',
              transform: 'translate(-50%,-20%)',
              '& .MuiAlert-root': {
                flexDirection: 'column',
                alignItems: 'center',
                fontSize: '2rem',
                '& .MuiSvgIcon-root': { fontSize: '2.5rem' },
                '& .MuiAlert-action': { display: 'none' },
              },
            },
          }}
        >
          <Snackbar
            TransitionComponent={TransitionDown}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={openDelete}
            onClose={() => {
              setCartItemDelete({ openDelete: false });
            }}
          >
            <Alert
              variant="outlined"
              onClose={() => {
                setCartItemDelete({ openDelete: false });
              }}
              severity={'warning'}
              sx={{
                backgroundColor: '#fff',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  alignItems: 'center',
                }}
              >
                <Typography>
                  Xác nhận xóa <strong>{nameCartItemDelete}</strong> khỏi giỏ hàng ?
                </Typography>
                <Box
                  sx={{
                    mt: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    '& .action': {
                      padding: '5px 15px',
                    },
                  }}
                >
                  <MyButton
                    color={{ bgColor: 'red', mainColor: '', subColor: '' }}
                    className="action"
                    onClick={() => {
                      handleDeleteCartItem(idCartItemDelete);
                      setCartItemDelete({
                        openDelete: false,
                        nameCartItemDelete: nameCartItemDelete,
                      });
                    }}
                  >
                    Xác nhận
                  </MyButton>
                  <MyButton
                    color={{
                      bgColor: 'rgb(2, 136, 209)',
                      mainColor: '',
                      subColor: '',
                    }}
                    className="action"
                    onClick={() => {
                      setCartItemDelete({
                        openDelete: false,
                        nameCartItemDelete: nameCartItemDelete,
                      });
                    }}
                  >
                    Hủy
                  </MyButton>
                </Box>
              </Box>
            </Alert>
          </Snackbar>
        </Box>
      )}
      <Inner
        sx={{
          paddingLeft: 0,
          paddingRight: 0,
        }}
      >
        {cartItems.length > 0 ? (
          <Box>
            <Box
              sx={{
                borderRadius: '6px',
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
                <label>
                  <input
                    type="checkbox"
                    checked={selectedFoodsMemo.length === cartItems.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFoods(cartItems);
                      } else {
                        setSelectedFoods([]);
                      }
                    }}
                  />
                </label>
                <Typography fontWeight={700}>Sản phẩm</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                <Typography sx={{ display: 'block', width: '100px', fontWeight: 700 }}>Đơn giá</Typography>

                <Typography sx={{ display: 'block', width: '140px', fontWeight: 700 }}>Thao tác</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
              {cartItems.map((item) => (
                <Box
                  key={item.id}
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
                  <input
                    type="checkbox"
                    checked={selectedFoodsMemo.some((food) => food.menu_id === item.menu_id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFoods([...selectedFoods, item]);
                      } else {
                        setSelectedFoods(selectedFoods.filter((f) => f.menu_id !== item.menu_id));
                      }
                    }}
                  />
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
                      <MyButton to={`/mon-an/${item.slug}`} target="_blank">
                        <Typography color={'#337ab7'} textAlign={'left'} fontSize={'1.6rem'} fontWeight={500}>
                          {item.name}
                        </Typography>
                      </MyButton>
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

                        <Quantity
                          checked={selectedFoodsMemo.some((food) => food.menu_id === item.menu_id)}
                          selectedFoods={selectedFoods}
                          setSelectedFoods={setSelectedFoods}
                          sl={item.quantity}
                          id={item.id}
                          menu_id={item.menu_id}
                        />

                        <Box
                          sx={{
                            width: '30px',
                            '& .delete-btn': {
                              margin: '0 auto',
                              '& span': { textAlign: 'center' },
                            },
                          }}
                        >
                          <MyButton
                            onClick={() => {
                              delCartItem(item.id, item.name);
                            }}
                            className="delete-btn"
                            style={{ padding: 0 }}
                          >
                            <DeleteIcon />
                          </MyButton>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  fontSize: '1.8rem',
                  gap: '30px',
                  justifyContent: 'end',
                  alignItems: 'center',
                  margin: '20px 0',
                  color: '#fe2c55',
                }}
              >
                <Typography fontWeight={700} fontSize={'1.6rem'}>
                  Tổng tiền
                </Typography>
                <Typography fontWeight={700} fontSize={'1.6rem'}>
                  {renderPrice(total)}
                </Typography>
                <MyButton
                  disable={!selectedFoodsMemo || selectedFoodsMemo.length <= 0}
                  onClick={handleOrder}
                  color={{ mainColor: '#fff', bgColor: '#fe2c55' }}
                  fontWeight={700}
                  padding={'4px 12px'}
                  fontSize={1.5}
                >
                  Mua hàng
                </MyButton>
              </Box>

              <Box sx={{ '& *': { fontWeight: 500 } }}>
                <Typography sx={{ textAlign: 'right' }}>
                  Đơn hàng trên <span style={{ fontWeight: 700, color: '#fe2c55' }}>{renderPrice(2000000)}</span> được
                  miễn phí giao hàng
                </Typography>
                <Typography sx={{ textAlign: 'right' }}>
                  Đơn hàng trên <span style={{ fontWeight: 700, color: '#fe2c55' }}>{renderPrice(1000000)}</span> phí
                  giao hàng là <span style={{ fontWeight: 700, color: '#fe2c55' }}>{renderPrice(50000)}</span>
                </Typography>
                <Typography sx={{ textAlign: 'right' }}>
                  Đơn hàng dưới <span style={{ fontWeight: 700, color: '#fe2c55' }}>{renderPrice(1000000)}</span> phí
                  giao hàng là <span style={{ fontWeight: 700, color: '#fe2c55' }}>{renderPrice(100000)}</span>
                </Typography>
              </Box>
            </Box>
          </Box>
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
            <Box
              sx={{
                backgroundImage: `url(${emptyCart})`,
                position: 'relative',
                width: '140px',
                height: '140px',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundColor: 'orange',
                transition: 'transform 0.3s',
                borderRadius: '50%',
              }}
            />
            <Typography fontSize={'2rem'} fontWeight={700} color={'grey'}>
              Giỏ hàng của bạn còn trống
            </Typography>
            <MyButton
              to={routes.home}
              padding={'5px 10px'}
              fontSize={1.6}
              color={{ mainColor: '#fff', bgColor: 'orange' }}
            >
              Mua hàng
            </MyButton>
          </Box>
        )}
      </Inner>
    </Box>
  );
};

export default memo(Cart);
