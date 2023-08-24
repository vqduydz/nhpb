import PrintIcon from '@mui/icons-material/Print';
import { Badge, Box, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { MyButton, PaginationCustom, SearchBox } from '_/components/common';
import useDebounce from '_/hook/useDebounce';
import { getOrder } from '_/redux/slices';
import { routes } from '_/routes';
import { renderPrice } from '_/utills';
import removeVietnameseTones from '_/utills/removeVietnameseTones';
import FileUpload from '../FileUpload';
import CreateNewOrder from './CreateNewOrder';

const OrdersManage = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [addOrder, setAddOrder] = useState(false);
  const [upload, setUpload] = useState(false);
  const [limit_per_page, setlimit_per_page] = useState(20);
  const [orders, setOrders] = useState({ orderList: [], totalPages: 1, limitPerPage: limit_per_page });
  const { orderList, totalPages, limitPerPage } = orders;
  const [searchValue, setSearchValue] = useState('');
  const debounce = useDebounce(searchValue, 500);
  const [load, setLoad] = useState(false);
  const [tab, setTab] = useState({ index: 0, status: '', content: '' });
  const { index, status, content } = tab;
  const [allOrder, setAllOrder] = useState([]);
  const [overLay, setOverLay] = useState(false);

  useEffect(() => {
    const query = !debounce.trim()
      ? { page, limit_per_page, status }
      : { page, limit_per_page, status, order_code: removeVietnameseTones(debounce).toLowerCase().replace(/ /g, '') };
    if (debounce.trim()) {
      setLoad(true);
    }

    dispatch(getOrder(query))
      .then(unwrapResult)
      .then((result) => {
        setLoad(false);
        setAllOrder(result.allOrder);
        setOrders({
          orderList: result.orders,
          totalPages: result.totalPages,
          limitPerPage: result.limit_per_page,
        });
      })
      .catch((error) => {
        setLoad(false);
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, page, limit_per_page, debounce]);

  const btnContent = [
    { index: 0, status: '', content: 'Tất cả', color: 'green' },
    {
      index: 1,
      status: 'Chờ xác nhận',
      content: 'Chờ xác nhận',
      color: '#ed6c02',
      badgeContent: allOrder.filter((order) => order.status === 'Chờ xác nhận').length,
    },
    {
      index: 2,
      status: 'Đang chuẩn bị',
      content: 'Đang chuẩn bị',
      color: '#0288d1',
      badgeContent: allOrder.filter((order) => order.status === 'Đang chuẩn bị').length,
    },
    {
      index: 3,
      status: 'Đang giao hàng',
      content: 'Đang giao hàng',
      color: '#0a66b7',
      badgeContent: allOrder.filter((order) => order.status === 'Đang giao hàng').length,
    },
    { index: 4, status: 'Hoàn thành', content: 'Hoàn thành', color: 'green' },
    { index: 5, status: 'Đã hủy', content: 'Đã hủy', color: '#fe2c55' },
  ];

  useEffect(() => {
    if (!addOrder) {
      setOverLay(false);
      return;
    }
    setOverLay(true);
  }, [addOrder]);

  const render = () => {
    return orderList.length > 0 ? (
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
              fontWeight: 700,
            },
          }}
        >
          <Typography sx={{ width: '30px' }} textAlign={'center'}>
            STT
          </Typography>
          <Typography sx={{ flex: 1 }} textAlign={'left'}>
            Mã đơn hàng
          </Typography>
          <Typography sx={{ width: '130px' }} textAlign={'center'}>
            Phân loại
          </Typography>
          <Typography sx={{ width: '130px' }} textAlign={'center'}>
            Tổng Thanh toán
          </Typography>
          <Typography sx={{ width: '100px' }} textAlign={'center'}>
            Trạng thái
          </Typography>
          <Typography sx={{ width: '30px' }} textAlign={'right'}>
            Bill
          </Typography>
        </Box>
        {orderList.map((item, index) => (
          <Box style={{ width: '100%' }} padding={'0 0'} key={item.id}>
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
              }}
            >
              <Typography sx={{ width: '30px' }} textAlign={'center'}>
                {page > 1 ? (page - 1) * limitPerPage + (index + 1) : index + 1}
              </Typography>
              <MyButton
                style={{ flex: 1, justifyContent: 'start' }}
                text
                to={routes.ordersmanage + '/' + item.order_code}
                target="_blank"
              >
                <Typography textAlign={'left'}>{item.order_code}</Typography>
              </MyButton>
              <Typography sx={{ width: '130px' }} textAlign={'center'}>
                {item.type}
              </Typography>
              <Typography sx={{ width: '130px' }} textAlign={'center'} color={'#fe2c55'}>
                {renderPrice(item.total_payment)}
              </Typography>
              <Typography sx={{ width: '100px' }} textAlign={'center'}>
                {item.status}
              </Typography>
              <MyButton to={`${routes.bill}/${item.order_code}`} style={{ width: '30px' }} target="_blank">
                <PrintIcon />
              </MyButton>
            </Box>
          </Box>
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
      </Box>
    );
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '10px',
          position: 'sticky',
          top: '56px',
          zIndex: 1,
          mb: '1vh',
          backgroundColor: '#fff',
        }}
      >
        <SearchBox
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          loading={load}
          placeholder="Tìm đơn hàng theo code order  ..."
          handleCreate={setAddOrder}
          handleImport={setUpload}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: '5px',
          justifyContent: 'start',
          padding: '5px 10px',
          backgroundColor: '#f9f9f9',
          border: '1px solid #eee',
          position: 'sticky',
          top: '96px',
          zIndex: 1,
          mb: '1vh',
        }}
      >
        {btnContent.map((btn) => (
          <Badge
            key={btn.index}
            sx={{ cursor: 'pointer' }}
            variant={btn.badgeContent && btn.badgeContent > 0 ? 'dot' : 'none'}
            color="error"
          >
            <MyButton
              text
              fontWeight={700}
              color={{ mainColor: btn.color }}
              style={{ borderBottom: btn.index === index ? `2px solid ${btn.color}` : '2px solid transparent' }}
              padding={'1px 9px'}
              onClick={() => setTab({ index: btn.index, status: btn.status, content: btn.content })}
            >
              {btn.content}
            </MyButton>
          </Badge>
        ))}
      </Box>
      {render()}

      <PaginationCustom
        limit_per_page={limit_per_page}
        setlimit_per_page={setlimit_per_page}
        total_page={totalPages}
        page={page}
        setPage={setPage}
      />

      {(overLay || addOrder || upload) && (
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
            />
          )}
          {addOrder && <CreateNewOrder setAddOrder={setAddOrder} />}
          {upload && <FileUpload setUpload={setUpload} users />}
        </Box>
      )}
    </>
  );
};

export default OrdersManage;
