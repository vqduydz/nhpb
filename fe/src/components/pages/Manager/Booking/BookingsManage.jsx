import { Badge, Box, Typography } from '@mui/material';
import bnImg from '_/assets/images/table-4.png';
import blImg from '_/assets/images/table-6.png';
import { MyButton, PaginationCustom, SearchBox } from '_/components/common';
import useDebounce from '_/hook/useDebounce';
import { routes } from '_/routes';
import * as bookingAPI from '_/services/api/bookingApi';
import * as tableAPI from '_/services/api/tableApi';
import removeVietnameseTones from '_/utills/removeVietnameseTones';
import { useEffect, useState } from 'react';
import FileUpload from '../FileUpload';
import CreateNewBooking from './CreateNewBooking';
import { useThemMui } from '_/context/ThemeMuiContext';

const BookingsManage = () => {
  const { loading } = useThemMui();
  const [page, setPage] = useState(1);
  const [upload, setUpload] = useState(false);
  const [overLay, setOverLay] = useState(false);
  const [tables, setTables] = useState({ bl: [], bn: [] });
  const [searchValue, setSearchValue] = useState('');
  const debounce = useDebounce(searchValue, 500);
  const [load, setLoad] = useState(false);
  const { bl, bn } = tables;
  const [tab, setTab] = useState({ index: 0, status: '', content: '' });
  const { index, status, content } = tab;
  const [limit_per_page, setlimit_per_page] = useState(20);
  const [allBookings, setAllBookings] = useState([]);
  const [bookings, setBookings] = useState({
    bookingList: [],
    totalPages: 1,
    limitPerPage: limit_per_page,
  });
  const { bookingList, totalPages, limitPerPage } = bookings;

  useEffect(() => {
    const query = !debounce.trim()
      ? { page, limit_per_page, status }
      : { page, limit_per_page, status, booking_code: removeVietnameseTones(debounce).toLowerCase().replace(/ /g, '') };
    if (debounce.trim()) {
      setLoad(true);
    }
    bookingAPI
      .getBookingApi(query)
      .then((res) => {
        setAllBookings(res.allBooking);
        setBookings({ bookingList: res.bookings, totalPages: res.totalPages, limitPerPage: res.limit_per_page });
        setLoad(false);
      })
      .catch((e) => {
        console.log(e);
        setLoad(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, index, page, limit_per_page, debounce]);

  useEffect(() => {
    (async () => {
      await tableAPI.tableApi().then((res) => {
        const tables = res.tablesShortByType;
        setTables({
          bl: tables.find((group) => group.type === 'Bàn lớn')?.tables || [],
          bn: tables.find((group) => group.type === 'Bàn nhỏ')?.tables || [],
        });
      });
    })();
  }, [loading]);

  const btnContent = [
    { index: 0, status: '', content: 'Tất cả', color: 'green' },
    {
      index: 1,
      status: 'Chờ xác nhận',
      content: 'Chờ xn',
      color: '#ed6c02',
      badgeContent: allBookings.filter((booking) => booking.status === 'Chờ xác nhận').length,
    },
    {
      index: 2,
      status: 'Đã xác nhận',
      content: 'Đã xn',
      color: '#ed6c02',
      badgeContent: allBookings.filter((booking) => booking.status === 'Đã xác nhận').length,
    },
    {
      index: 3,
      status: 'Đã chuẩn bị',
      content: 'Đã chuẩn bị',
      color: '#0288d1',
      badgeContent: allBookings.filter((booking) => booking.status === 'Đã chuẩn bị').length,
    },
    {
      index: 4,
      status: 'Đang phục vụ',
      content: 'Đang phục vụ',
      color: '#0a66b7',
      badgeContent: allBookings.filter((booking) => booking.status === 'Đang phục vụ').length,
    },
    { index: 5, status: 'Hoàn thành', content: 'Hoàn thành', color: 'green' },
    {
      index: 6,
      status: 'Chưa xử lý',
      content: 'Chưa xử lý',
      color: 'green',
      badgeContent: allBookings.filter((booking) => booking.status === 'Chưa xử lý').length,
    },
    { index: 7, status: 'Đã hủy', content: 'Đã hủy', color: '#fe2c55' },
  ];

  const render = () => {
    return bookingList.length > 0 ? (
      <>
        <Box
          sx={{
            borderRadius: '6px 6px 0 0',
            padding: '10px',
            backgroundColor: '#00000005',
            border: '1px solid #0000000a',
            display: 'flex',
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
            Booking Code
          </Typography>
          <Typography sx={{ width: '150px' }} textAlign={'center'}>
            Phân loại
          </Typography>
          <Typography sx={{ width: '150px' }} textAlign={'center'}>
            Thời gian đến
          </Typography>
          <Typography sx={{ width: '150px' }} textAlign={'center'}>
            Trạng thái
          </Typography>
        </Box>
        {bookingList.map((item, index) => (
          <Box
            key={item.id}
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
            <Typography sx={{ maxWidth: '30px' }} textAlign={'center'}>
              {page > 1 ? (page - 1) * limitPerPage + (index + 1) : index + 1}
            </Typography>
            <MyButton style={{ flex: 1 }} text to={routes.bookingmanage + '/' + item.booking_code} target="_blank">
              <Typography textAlign={'left'}>{item.booking_code}</Typography>
            </MyButton>
            <Typography sx={{ maxWidth: '150px' }} textAlign={'center'}>
              {item.type}
            </Typography>
            <Typography sx={{ maxWidth: '150px' }} textAlign={'center'}>
              {item.arrival_time}
            </Typography>
            <Typography sx={{ maxWidth: '150px' }} textAlign={'center'}>
              {item.status}
            </Typography>
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

  useEffect(() => {
    if (!upload) {
      setOverLay(false);
      return;
    }
    setOverLay(true);
  }, [upload]);

  return (
    <>
      <Box sx={{ border: '1px solid #eee', mt: '10px' }}>
        <Box sx={{ display: 'flex' }}>
          <Box
            sx={{
              borderRight: '1px solid #eee',
              flex: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              padding: '5px',
            }}
          >
            <CreateNewBooking />
          </Box>
          <Box sx={{ flex: 3, padding: '15px 5px', '& *': { fontSize: '1.2rem!important' } }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat( 6, minmax(0, 1fr))',
                gridAutoRows: 'auto',
              }}
            >
              {bn.map((table, index) => (
                <Box
                  key={index}
                  sx={{
                    cursor: 'pointer',
                    backgroundImage: `url(${bnImg})`,
                    width: '100%',
                    height: '50px',
                    justifyContent: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: table.available ? '#0a66b7' : '#fe2c55',
                  }}
                >
                  <Typography fontWeight={700} color={'#fff'}>
                    {table.name}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                mt: 5,
                display: 'grid',
                gridTemplateColumns: 'repeat( 5, minmax(0, 1fr))',
                gridAutoRows: 'auto',
              }}
            >
              {bl.map((table, index) => (
                <Box
                  key={index}
                  sx={{
                    cursor: 'pointer',
                    backgroundImage: `url(${blImg})`,
                    width: '100%',
                    height: '55px',
                    justifyContent: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: table.available ? '#0a66b7' : '#fe2c55',
                  }}
                >
                  <Typography fontWeight={700} color={'#fff'}>
                    {table.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'end',
          gap: '10px',
          zIndex: 1,
          mt: '1vh',
          mb: '1vh',

          position: 'sticky',
          top: '56px',
          backgroundColor: '#fff',
        }}
      >
        <SearchBox
          create={false}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          loading={load}
          placeholder="Tìm đơn hàng theo code order  ..."
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
              fontSize={1.4}
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
      {(overLay || upload) && (
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
          {upload && <FileUpload setUpload={setUpload} users />}
        </Box>
      )}
    </>
  );
};

export default BookingsManage;
