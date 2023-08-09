import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, FormControlLabel, Radio, RadioGroup, TextareaAutosize, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import zalopay from '_/assets/icon/ZaloPay.png';
import banking from '_/assets/icon/banking.png';
import momo from '_/assets/icon/momo.png';
import { MyButton } from '_/components/common';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';
import { useThemMui } from '_/context/ThemeMuiContext';
import useDebounce from '_/hook/useDebounce';
import { createNewOrder, getMenu } from '_/redux/slices';
import { routes } from '_/routes';
import { capitalize, dateTimeFormate, renderPrice } from '_/utills';
import removeVietnameseTones from '_/utills/removeVietnameseTones';
import MenuDrop from './MenuDrop';

const CreateNewOrder = ({ setAddOrder }) => {
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState();
  const [quantity, setQuantity] = useState(1);
  const [imagePath, setImagePath] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [orderList, setOrderList] = useState([]);
  const debounce = useDebounce(searchValue, 500);
  const [menuItems, setMenuItems] = useState([]);
  const [notif, setNotif] = useState();
  const [total, setTotal] = useState(0);
  const [shipFee, setShipFee] = useState(100000);
  const navigate = useNavigate();
  const { setLoading } = useThemMui();

  useEffect(() => {
    const query = !debounce.trim() ? {} : { name: removeVietnameseTones(debounce).toLowerCase().replace(/ /g, '-') };
    if (debounce.trim())
      dispatch(getMenu(query))
        .then(unwrapResult)
        .then((result) => {
          setMenuItems(result.menus);
          setImagePath(result.imagePath);
        })
        .catch((error) => {
          console.log({ error });
        });
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounce]);

  useEffect(() => {
    const total = orderList.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.price * currentValue.quantity;
    }, 0);
    setTotal(total);
    total < 1000000 ? setShipFee(100000) : total >= 1000000 && total < 2000000 ? setShipFee(50000) : setShipFee(0);
  }, [orderList]);

  const handleAddToOrder = () => {
    if (selectedItem) {
      setNotif();
      if (orderList.find((item) => item.id === selectedItem.id)) {
        setNotif('Món ăn đã có trong danh sách !');
        setSearchValue('');
        setMenuItems([]);
        return;
      }
      const { id, name, slug, catalog, catalogSlug, price, image_url } = selectedItem;
      const newItem = {
        catalog,
        catalog_slug: catalogSlug,
        menu_id: id,
        name,
        price,
        slug,
        total: price * quantity,
        ...selectedItem,
        quantity,
        image: imagePath + image_url,
      };
      setOrderList([...orderList, newItem]);
      setSelectedItem(null);
      setQuantity(1);
      setSearchValue('');
      setMenuItems([]);
    }
  };

  const handleChangeQuantity = (id, quantity) => {
    const updatedOrderList = orderList.map((item) =>
      item.id === id ? { ...item, quantity, total: item.price * quantity } : item,
    );
    setOrderList(updatedOrderList);
  };

  const handleDelete = (id) => {
    const updatedOrderList = orderList.filter((item) => item.id !== id);
    setOrderList(updatedOrderList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const orderData = {
      type: 'Phone Order',
      payment_methods: data.get('payment-methods'),
      order_code: `${removeVietnameseTones(dateTimeFormate(new Date())).replace(/ /g, '')}`,
      note: data.get('note'),
      items: JSON.stringify(orderList),
      total_amount: orderList.reduce((acc, c) => {
        return acc + c.quantity;
      }, 0),
      payment: total,
      ship_fee: shipFee,
      total_payment: total + shipFee,
      status: 'Đang chuẩn bị',
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
        name: capitalize(data.get('name')),
        phoneNumber: data.get('phoneNumber'),
      }),
      receiver: JSON.stringify({
        name: capitalize(data.get('name')),
        phoneNumber: data.get('phoneNumber'),
        address: capitalize(data.get('place')),
      }),
    };
    console.log({ orderData });
    dispatch(createNewOrder(orderData))
      .then(unwrapResult)
      .then(() => {
        setLoading(false);
        navigate(routes.orders);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <Box>
      <Box
        sx={{
          borderRadius: '6px',
          padding: '20px',
          width: '680px',
          margin: '0 auto',
          backgroundColor: '#fff',
          position: 'fixed',
          top: '50%',
          maxHeight: '90vh',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          '& .inner': { display: 'flex', gap: '10px', flexDirection: 'column' },
          '& *': { fontSize: '1.2rem!important' },
        }}
      >
        <Typography fontWeight={500} fontSize={'2.4rem'}>
          Create New Order
        </Typography>

        <form
          style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}
          onSubmit={handleSubmit}
        >
          <Box sx={{ display: 'flex', gap: '5px' }}>
            <Box sx={{ display: 'flex', gap: '10px', flexDirection: 'column', width: '100%' }}>
              <Box sx={{ display: 'flex', gap: '10px' }}>
                <MyTextField
                  size="small"
                  label="Name"
                  required
                  fullWidth
                  id="name"
                  name="name"
                  autoComplete="off"
                  type=""
                  autoFocus
                />
                <MyTextField
                  required
                  size="small"
                  label="Enter Phone Number"
                  fullWidth
                  name="phoneNumber"
                  type="number"
                  id="phoneNumber"
                  autoComplete="off"
                />
              </Box>

              <MyTextField
                size="small"
                label="Địa chỉ"
                required
                fullWidth
                name="place"
                type=""
                id="place"
                autoComplete="off"
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <MenuDrop
              menulist={menuItems}
              setSelectedItem={setSelectedItem}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />

            <MyButton
              padding={'5px 15px'}
              type="button"
              onClick={handleAddToOrder}
              color={{ bgColor: 'orange', mainColor: '#fff' }}
            >
              Thêm
            </MyButton>
          </Box>
          <TextareaAutosize
            name="note"
            placeholder="Thêm ghi chú ..."
            style={{
              overflow: 'scroll',
              height: '50px',
              maxHeight: '50px',
              width: '100%',
              maxWidth: '100%',
              resize: 'none',
              padding: '5px 10px',
            }}
          />
          {notif ? (
            <Typography lineHeight={'10px'} sx={{ color: 'red', height: '10px', fontSize: '1.4rem' }}>
              {notif}
            </Typography>
          ) : (
            <Typography
              sx={{
                color: 'red',
                height: '10px',
                fontSize: '1.4rem',
                position: 'relative',
                '::after': {
                  display: 'block',
                  position: 'absolute',
                  top: '50%',
                  content: `''`,
                  height: '1px',
                  width: '100%',
                  backgroundColor: '#0000003b',
                },
              }}
            />
          )}
          <Box
            sx={{
              display: 'flex',
              gap: '5px',
              flexDirection: 'column',
            }}
          >
            <Typography fontWeight={700}>Danh sách món ăn:</Typography>
            <Box sx={{ height: 'calc(90vh - 390px)', overflow: 'scroll', '& p': { fontWeight: 500 } }}>
              <Box sx={{ minHeight: '100px' }}>
                <Box
                  sx={{
                    backgroundColor: '#eee',
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '15px 5px',
                    borderBottom: '1px solid #fff',
                    gap: '5px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <Typography sx={{ width: '30px', textAlign: 'center' }}>STT</Typography>
                  <Typography sx={{ flex: 1 }}>Tên</Typography>
                  <Typography sx={{ width: '80px', textAlign: 'center' }}>Đơn giá</Typography>
                  <Typography sx={{ width: '80px', textAlign: 'center' }}>SL</Typography>
                  <Typography sx={{ width: '100px', textAlign: 'center' }}>Thành Tiền</Typography>
                  <Typography sx={{ width: '80px', textAlign: 'center' }}>Hành động</Typography>
                </Box>
                {orderList.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '5px',
                      mb: '1px',
                      gap: '5px',
                      backgroundColor: '#f9f9f9',
                    }}
                  >
                    <Typography sx={{ width: '30px', textAlign: 'center' }}>{index + 1}</Typography>
                    <Typography sx={{ flex: 1 }}>{item.name}</Typography>
                    <Typography sx={{ width: '80px', textAlign: 'center' }}>{renderPrice(item.price)}</Typography>
                    <Box
                      sx={{
                        width: '80px',
                        display: 'flex',
                        justifyContent: 'center',
                        height: '25px',
                        gap: '1px',
                        mt: '2px',
                        mb: '5px',
                        '& .so-luong': {
                          border: '1px solid #555',
                        },
                      }}
                    >
                      <MyButton
                        type="button"
                        disable={item.quantity <= 1}
                        onClick={() => {
                          let res = item.quantity - 1;
                          if (res <= 1) res = 1;
                          handleChangeQuantity(item.id, res);
                        }}
                        className="so-luong"
                        style={{
                          border: 'none',
                          backgroundColor: '#0000001a',
                          color: '#0000008b',
                          padding: 0,
                        }}
                      >
                        <RemoveIcon />
                      </MyButton>
                      <input
                        className="so-luong"
                        style={{
                          width: '30px',
                          textAlign: 'center',

                          border: 'none',
                          userSelect: 'none',
                          cursor: 'default',
                        }}
                        step="1"
                        min={1}
                        max={item.max_order}
                        value={item.quantity}
                        autoComplete="off"
                        height="100%"
                        readOnly
                      />
                      <MyButton
                        type="button"
                        disable={item.quantity >= item.max_order}
                        onClick={() => {
                          let res = item.quantity + 1;
                          if (res >= item.max_order) res = item.max_order;
                          handleChangeQuantity(item.id, res);
                        }}
                        className="so-luong"
                        style={{
                          border: 'none',
                          backgroundColor: '#0000001a',
                          color: '#0000008b',
                          padding: 0,
                        }}
                      >
                        <AddIcon />
                      </MyButton>
                    </Box>
                    <Typography sx={{ width: '100px', textAlign: 'center' }}>{renderPrice(item.total)}</Typography>
                    <Box
                      justifyContent={'end'}
                      sx={{
                        width: '80px',
                        display: 'flex',
                        gap: '5px',
                        justifyContent: 'center',
                        '& .icon': {
                          fontSize: '2rem !important',
                        },
                        '* ': {
                          borderRadius: '3px',
                        },
                      }}
                    >
                      <MyButton
                        type="button"
                        effect
                        color={{ mainColor: '#fe2c55' }}
                        padding={'5px 8px'}
                        onClick={() => {
                          handleDelete(item.id);
                        }}
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </MyButton>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Box
                sx={{
                  mt: '5px',
                  display: 'flex',
                  gap: '5px',
                  flexDirection: 'column',
                  padding: '15px 10px',
                  border: '1px solid #0000000a',
                  position: 'sticky',
                  bottom: '-1px',
                  backgroundColor: '#fff',
                }}
              >
                <Typography fontWeight={700}>Phương thức thanh toán:</Typography>

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
                <Box sx={{ mt: '20px', display: 'flex', gap: '5px', flexDirection: 'column' }}>
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
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className="inner" sx={{ justifyContent: 'space-between' }}>
            <Box
              sx={{
                pr: '10px',
                display: 'flex',
                justifyContent: 'end',
                gap: '5px',
                '& button': { padding: '3px 15px' },
              }}
            >
              <MyButton
                disable={!orderList || orderList.length <= 0}
                color={{ bgColor: 'green', mainColor: '#fff' }}
                type="submit"
              >
                Tạo
              </MyButton>
              <MyButton
                onClick={() => setAddOrder(false)}
                type="button"
                color={{ bgColor: '#fe2c55', mainColor: '#fff' }}
              >
                Hủy
              </MyButton>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default CreateNewOrder;
