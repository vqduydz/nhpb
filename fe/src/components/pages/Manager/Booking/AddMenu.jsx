import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { MyButton } from '_/components/common';
import useDebounce from '_/hook/useDebounce';
import { getMenu } from '_/redux/slices';
import { renderPrice } from '_/utills';
import removeVietnameseTones from '_/utills/removeVietnameseTones';
import MenuDrop from '../Orders/MenuDrop';

const AddMenu = ({ orderList = [], main = false, confirmOrderlist }) => {
  const [newOrderList, setNewOrderList] = useState([]);
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState();
  const [quantity, setQuantity] = useState(1);
  const [imagePath, setImagePath] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const debounce = useDebounce(searchValue, 500);
  const [menuItems, setMenuItems] = useState([]);
  const [notif, setNotif] = useState();
  const [total, setTotal] = useState(0);

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
    const total = newOrderList?.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.price * currentValue.quantity;
    }, 0);
    setTotal(total);
  }, [newOrderList]);

  useEffect(() => {
    setNewOrderList(orderList ? orderList : []);
  }, [orderList]);

  const handleAddToOrder = () => {
    if (selectedItem) {
      setNotif();
      if (newOrderList.find((item) => item.id === selectedItem.id)) {
        setNotif('Món ăn đã có trong danh sách !');
        setSearchValue('');
        setMenuItems([]);
        return;
      }
      const { id, name, slug, catalog, catalogSlug, price, image_url } = selectedItem;
      const newItem = {
        ...selectedItem,
        catalog,
        catalog_slug: catalogSlug,
        menu_id: id,
        name,
        price,
        slug,
        total: price * quantity,
        quantity,
        image: imagePath + image_url,
      };
      setNewOrderList([...newOrderList, newItem]);
      setSelectedItem(null);
      setQuantity(1);
      setSearchValue('');
      setMenuItems([]);
    }
  };

  const handleChangeQuantity = (id, quantity) => {
    const updatedOrderList = newOrderList.map((item) =>
      item.id === id ? { ...item, quantity, total: item.price * quantity } : item,
    );
    setNewOrderList(updatedOrderList);
  };

  const handleDelete = (id) => {
    const updatedOrderList = newOrderList.filter((item) => item.id !== id);
    setNewOrderList(updatedOrderList);
  };

  const handleOrder = () => {
    if (!newOrderList || !newOrderList.length) {
      setNotif('Chưa chọn món ăn');
      return;
    }
    confirmOrderlist(newOrderList);
  };
  return (
    <>
      <Box sx={{ display: 'flex', gap: '2px', alignItems: 'center', mb: 5 }}>
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
        <Box
          sx={{
            backgroundColor: notif ? '#fe2c55' : 'transparent',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            p: '0 20px',
            '& p': { lineHeight: 0.9 },
          }}
        >
          <Typography sx={{ color: '#fff', height: '10px' }}>{notif}</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            height: '30px',
            position: 'relative',
            '::after': {
              zIndex: 1,
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
      <Box sx={{ mt: 5, display: 'flex', gap: '2px', flexDirection: 'column' }}>
        <Typography fontWeight={700}>Danh sách món ăn:</Typography>
        <Box sx={{ height: main ? '250px' : '50vh', overflow: 'auto', '& p': { fontWeight: 500 } }}>
          <Box sx={{ minHeight: '100px' }}>
            {newOrderList.length > 0 &&
              newOrderList.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    padding: '2px',
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
                          <DeleteIcon fontSize="1.4rem" />
                        </MyButton>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          mt: '5px',
          display: 'flex',
          gap: '5px',
          flexDirection: 'column',

          borderTop: '1px solid #0000000a',
          position: 'sticky',
          bottom: '-1px',
          backgroundColor: '#00000005',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '10px',
            justifyContent: 'end',
            alignItems: 'center',

            color: '#fe2c55',
          }}
        >
          <Typography align="right" sx={{ display: 'block', flex: 1 }} fontWeight={700}>
            Tổng tiền
          </Typography>
          <Typography textAlign={'right'} fontWeight={700} fontSize={'1.6rem'} sx={{ display: 'block', flex: 1 }}>
            {renderPrice(total)}
          </Typography>
          {!main && (
            <MyButton
              style={{ flex: 1 }}
              type="button"
              onClick={handleOrder}
              color={{ bgColor: 'orange', mainColor: '#fff' }}
            >
              Đặt món
            </MyButton>
          )}
        </Box>
      </Box>
    </>
  );
};

export default AddMenu;
