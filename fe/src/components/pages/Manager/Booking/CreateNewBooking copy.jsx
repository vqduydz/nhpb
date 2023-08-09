import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, TextareaAutosize, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { MyButton } from '_/components/common';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';
import { useThemMui } from '_/context/ThemeMuiContext';
import useDebounce from '_/hook/useDebounce';
import { getMenu } from '_/redux/slices';
import * as bookingAPI from '_/services/api/bookingApi';
import { capitalize, dateTimeFormate, renderPrice } from '_/utills';
import removeVietnameseTones from '_/utills/removeVietnameseTones';
import MenuDrop from '../Orders/MenuDrop';
import TimeDrop from './TimeDrop';

const CreateNewBooking = () => {
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
  const { setLoading } = useThemMui();
  const [timeSelect, setTimeSelect] = useState('');

  const timelist = [
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
  ];

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
    if (!timeSelect) {
      setNotif('Vui lòng chọn thời gian');
      return;
    }
    const data = new FormData(e.currentTarget);
    const customer_phonenumber = data.get('phoneNumber');
    const customer_name = capitalize(data.get('name'));
    const number_of_guests = data.get('number_of_guests');
    const [date] = dateTimeFormate(new Date()).split(' ');
    const bookingData = {
      booking_code: `${removeVietnameseTones(dateTimeFormate(new Date())).replace(/ /g, '')}${customer_phonenumber}`,
      type: 'Phone Booking',
      customer_name,
      customer_phonenumber,
      number_of_guests,
      status: 'Chờ xác nhận',
      order: JSON.stringify(orderList),
      note: data.get('note'),
      arrival_time: `${date} ${timeSelect}`,
    };

    bookingAPI
      .createNewBookingApi(bookingData)
      .then((res) => {
        setLoading(false);
        setTimeSelect('');
      })
      .catch((e) => {
        console.log(e);
        setTimeSelect('');
        setLoading(false);
      });
  };

  return (
    <Box
      sx={{
        '& .inner': { display: 'flex', gap: '10px', flexDirection: 'column' },
        '& *': { fontSize: '1.2rem!important' },
        '& .text-area': {
          width: '100%',
          maxWidth: '100%',
          resize: 'none',
          padding: '5px 10px',
          outline: 'none',
          borderColor: '#c7c7c7',
          '&:hover': {
            borderColor: '#aeaeae',
          },
          '&:focus': {
            borderColor: '#000',
          },
        },
      }}
    >
      <form style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: '5px' }}>
          <Box sx={{ display: 'flex', gap: '10px', flexDirection: 'column', width: '100%' }}>
            <Box sx={{ display: 'flex', gap: '2px' }}>
              <MyTextField
                sx={{ flex: 2 }}
                size="small"
                label="Tên khách hàng"
                required
                fullWidth
                id="name"
                name="name"
                autoComplete="off"
                type=""
                autoFocus
              />
              <MyTextField
                sx={{ flex: 2 }}
                required
                size="small"
                label="Sđt khách hàng"
                fullWidth
                name="phoneNumber"
                type="number"
                id="phoneNumber"
                autoComplete="off"
              />
            </Box>
            <Box sx={{ display: 'flex', gap: '2px' }}>
              <MyTextField
                inputProps={{
                  min: 1,
                }}
                sx={{ flex: 1 }}
                required
                size="small"
                label="SL khách"
                fullWidth
                name="number_of_guests"
                type="number"
                id="number_of_guests"
                autoComplete="off"
              />
              <TimeDrop timeSelect={timeSelect} setTimeSelect={setTimeSelect} timelist={timelist} />
            </Box>
          </Box>
        </Box>{' '}
        <TextareaAutosize
          className="text-area"
          name="note"
          placeholder="Thêm ghi chú ..."
          style={{
            overflow: 'auto',
            height: '40px',
          }}
        />
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
            gap: '2px',
            flexDirection: 'column',
          }}
        >
          <Typography fontWeight={700}>Danh sách món ăn:</Typography>
          <Box sx={{ height: 'calc(450px - 280px)', overflow: 'auto', '& p': { fontWeight: 500 } }}>
            <Box sx={{ minHeight: '100px' }}>
              {orderList.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    padding: '2px 15px',
                    display: 'flex',
                    textAlign: 'center',
                    gap: '1px',
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography color={'#337ab7'} textAlign={'left'}>
                      {index + 1}: {item.name}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '5px',
                        justifyContent: 'end',
                        alignItems: 'center',
                        '& p': {
                          color: '#fe2c55',
                        },
                      }}
                    >
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
                          value={item.quantity}
                          autoComplete="off"
                          height="100%"
                          readOnly
                        />
                        <MyButton
                          type="button"
                          onClick={() => {
                            let res = item.quantity + 1;

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
                          width: '30px',
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
                padding: '5px',
                border: '1px solid #0000000a',
                position: 'sticky',
                bottom: '-1px',
                backgroundColor: '#fff',
              }}
            >
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
                <Typography fontWeight={700}>Tổng tiền tạm tính</Typography>
                <Typography
                  textAlign={'right'}
                  fontWeight={700}
                  fontSize={'1.6rem'}
                  sx={{ display: 'block', width: '120px' }}
                >
                  {renderPrice(total)}
                </Typography>
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
            {!!timeSelect ? (
              <MyButton color={{ bgColor: 'green', mainColor: '#fff' }} type="submit">
                Đặt bàn
              </MyButton>
            ) : (
              <MyButton disable color={{ bgColor: 'green', mainColor: '#fff' }} type="button">
                Đặt bàn
              </MyButton>
            )}
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default CreateNewBooking;
