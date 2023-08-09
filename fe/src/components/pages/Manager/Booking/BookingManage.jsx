import { Box, TextareaAutosize, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { MyButton } from '_/components/common';
import { Inner } from '_/components/common/CustomComponents/CustomMui';
import { useThemMui } from '_/context/ThemeMuiContext';
import * as bookingAPI from '_/services/api/bookingApi';
import * as tableAPI from '_/services/api/tableApi';
import { dateTimeFormate, renderPrice } from '_/utills';
import AddMenu from './AddMenu';
import AddTable from './AddTable';
import BookingTimeline from './BookingTimeline';
import { routes } from '_/routes';

const BookingManage = () => {
  const navigate = useNavigate();
  const { booking_code: _booking_code } = useParams();
  const { loading, setLoading } = useThemMui();
  const [booking, setBooking] = useState({});
  const [overLay, setOverLay] = useState(false);

  const [orderList, setOrderList] = useState([]);
  const [total, setTotal] = useState(0);
  const [depositAmount, setDepositAmount] = useState();
  const [reSelectTable, setReSelectTable] = useState(false);
  const [cancel, setCancel] = useState(false);

  const {
    booking_code,
    type,
    customer_name,
    customer_phonenumber,
    number_of_guests,
    table_id,
    status,
    deposit_amount,
    note,
    arrival_time,
    booking_time,
    history: oldHistory,
  } = booking;

  useEffect(() => {
    const total = orderList?.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.price * currentValue.quantity;
    }, 0);
    setTotal(total);
  }, [orderList]);

  useEffect(() => {
    setDepositAmount(() => {
      if (!total) return 200000;
      const min = Math.round((total / 5 + 50000) / 100000) * 100000;
      if (min <= 200000) return 200000;
      return min;
    });
  }, [total]);

  useEffect(() => {
    bookingAPI
      .getBookingApi({ booking_code: _booking_code })
      .then((result) => {
        console.log(result.bookings);
        if (!result || !result.bookings || !result.bookings.length) {
          navigate(routes.bookingmanage);
          return;
        }
        const {
          booking_code,
          type,
          customer_name,
          customer_phonenumber,
          number_of_guests,
          table_id,
          status,
          deposit_amount,
          order,
          note,
          arrival_time,
          history,
          createdAt,
        } = result.bookings[0];
        setOrderList(JSON.parse(order));
        setBooking({
          booking_code,
          type,
          customer_name,
          customer_phonenumber,
          number_of_guests,
          table_id: JSON.parse(table_id),
          status,
          deposit_amount,
          order: JSON.parse(order),
          note,
          history: JSON.parse(history),
          arrival_time,
          booking_time: dateTimeFormate(createdAt),
        });
      })
      .catch((error) => {
        console.log({ error });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const updateBooking = async (updateData) => await bookingAPI.updateBookingApi(updateData);

  //-- Đặt món
  const confirmOrderlist = async (newOrderList) => {
    setLoading(true);
    try {
      const dataUpdate = {
        booking_code,
        order: JSON.stringify(newOrderList),
      };
      await updateBooking(dataUpdate);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //-- Đặt cọc

  const confirmDeposit = async () => {
    setLoading(true);
    try {
      const history = [...oldHistory, { time: new Date(), status: 'Đã xác nhận', stt_code: 2 }];
      const dataUpdate = {
        history: JSON.stringify(history),
        status: 'Đã xác nhận',
        booking_code,
        deposit_amount: depositAmount,
      };
      await updateBooking(dataUpdate);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // -- Chọn bàn
  const confirm = async (tables) => {
    setLoading(true);
    try {
      console.log({ tables, table_id });
      const history = [...oldHistory, { time: new Date(), status: 'Đã chuẩn bị', stt_code: 3 }];
      const dataUpdate = {
        history: JSON.stringify(history),
        status: 'Đã chuẩn bị',
        booking_code,
        table_id: JSON.stringify(tables),
      };
      await updateBooking(dataUpdate);
      for (const table of tables) {
        const dataUpdate = { name: table, available: false };
        await tableAPI.updatetableApi(dataUpdate);
      }
      if (table_id && table_id.length) {
        const removeTables = table_id.filter((name) => !tables.includes(name));
        for (const table of removeTables) {
          const dataUpdate = { name: table, available: true };
          await tableAPI.updatetableApi(dataUpdate);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setReSelectTable(false);
      setLoading(false);
    }
  };

  const handleServing = async () => {
    setLoading(true);
    try {
      const history = [...oldHistory, { time: new Date(), status: 'Bắt đầu phục vụ', stt_code: 4 }];
      const dataUpdate = {
        history: JSON.stringify(history),
        status: 'Đang phục vụ',
        booking_code,
      };
      await updateBooking(dataUpdate);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setReSelectTable(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const history = [...oldHistory, { time: new Date(), status: 'Hoàn thành', stt_code: 5 }];
      const dataUpdate = {
        history: JSON.stringify(history),
        status: 'Hoàn thành',
        booking_code,
      };
      await updateBooking(dataUpdate);
      for (const table of table_id) {
        const dataUpdate = { name: table, available: true };
        await tableAPI.updatetableApi(dataUpdate);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setReSelectTable(false);
    }
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData(e.currentTarget);
      const history = [
        ...oldHistory,
        { time: new Date(), status: 'Đã hủy', stt_code: 6, reasons: data.get('reasons') },
      ];
      const dataUpdate = {
        history: JSON.stringify(history),
        status: 'Đã hủy',
        booking_code,
      };
      await updateBooking(dataUpdate);
      if (table_id && table_id.length) {
        for (const table of table_id) {
          const dataUpdate = { name: table, available: true };
          await tableAPI.updatetableApi(dataUpdate);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCancel(false);
      setLoading(false);
      setReSelectTable(false);
    }
  };

  //----------------------
  useEffect(() => {
    if (!cancel) {
      setOverLay(false);
      return;
    }
    setOverLay(true);
  }, [cancel]);

  return (
    <>
      <Box
        sx={{
          pt: '20px',
          mb: '20px',
          '& p': {
            fontWeight: 500,
            lineHeight: 1.8,
          },
        }}
      >
        <Box sx={{ display: 'flex', gap: '5px', flexDirection: 'column', border: '1px solid #0000000a' }}>
          <Box sx={{ display: 'flex' }}>
            <Box
              sx={{
                flex: 1,
                padding: '5px 10px',
                backgroundColor: '#00000005',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography>Mã : {booking_code}</Typography>
              <Typography>Phân loại : {type}</Typography> <Typography>Trạng thái : {status}</Typography>
              <Typography sx={{ mt: 2, pt: 2, borderTop: '1px solid #0000000a', fontWeight: 700 }}>
                Thông tin khách hàng
              </Typography>
              <Box
                sx={{
                  flexDirection: 'column',
                  display: 'flex',
                }}
              >
                <Typography>Tên : {customer_name}</Typography>
                <Typography>Số điện thoại : (+84){customer_phonenumber}</Typography>
              </Box>
              <Box
                sx={{
                  mt: 2,
                  pt: 2,
                  borderTop: '1px solid #0000000a',
                }}
              >
                <Typography>Thời gian đặt : {booking_time}</Typography>
                <Typography>Thời gian đến : {arrival_time}</Typography>
                <Typography>Số lượng khách dự kiến : {number_of_guests}</Typography>
                <Typography>Mã số bàn : {table_id?.join(', ')}</Typography>
              </Box>
              <Typography sx={{ mt: 2, pt: 2, borderTop: '1px solid #0000000a' }}>Ghi chú : {note}</Typography>
              <Typography sx={{ mt: 2, pt: 2, borderTop: '1px solid #0000000a' }}>
                Lịch sử cập nhật trạng thái :
              </Typography>
              {oldHistory && <BookingTimeline list={oldHistory} />}
            </Box>

            <Box
              sx={{
                padding: '5px 10px',
                opacity: status === 'Đã hủy' ? 0.5 : 1,
                flex: 1,
                border: '1px solid #0000000a',
                pointerEvents: status === 'Đã hủy' ? 'none' : 'auto',
              }}
            >
              <AddMenu orderList={orderList} confirmOrderlist={confirmOrderlist} />
              <Box
                sx={{
                  borderTop: '1px solid #fff',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '10px',
                  justifyContent: 'end',
                  alignItems: 'center',

                  color: '#fe2c55',
                  backgroundColor: '#00000005',
                }}
              >
                <Typography align="right" sx={{ display: 'block', flex: 1 }} fontWeight={700}>
                  Tiền cọc
                </Typography>
                {deposit_amount <= 0 ? (
                  <>
                    <Typography
                      textAlign={'right'}
                      fontWeight={700}
                      fontSize={'1.6rem'}
                      sx={{ display: 'block', flex: 1 }}
                    >
                      {renderPrice(depositAmount)}
                    </Typography>
                    <MyButton
                      onClick={confirmDeposit}
                      style={{ flex: 1 }}
                      type="button"
                      color={{ bgColor: 'orange', mainColor: '#fff' }}
                    >
                      Đặt cọc
                    </MyButton>
                  </>
                ) : (
                  <>
                    <Typography
                      textAlign={'right'}
                      fontWeight={700}
                      fontSize={'1.6rem'}
                      sx={{ display: 'block', flex: 1 }}
                    >
                      {renderPrice(deposit_amount ? deposit_amount : 0)}
                    </Typography>
                    <MyButton disable style={{ flex: 1 }} type="button" color={{ bgColor: 'green', mainColor: '#fff' }}>
                      Đã đặt cọc
                    </MyButton>
                  </>
                )}
              </Box>
            </Box>
          </Box>
          <Box sx={{ mt: '10px', display: 'flex', justifyContent: 'end' }}>
            {(status === 'Đã xác nhận' || reSelectTable) && (
              <AddTable
                confirm={confirm}
                status={status}
                total={total}
                reSelectTable={reSelectTable}
                setReSelectTable={setReSelectTable}
                currentTable={table_id}
              />
            )}
          </Box>
          <Box sx={{ mt: '10px', display: 'flex', justifyContent: 'end', gap: '10px' }}>
            {status === 'Đã chuẩn bị' && (
              <>
                {!reSelectTable && (
                  <MyButton
                    onClick={() => setReSelectTable(true)}
                    type="button"
                    color={{ bgColor: 'orange', mainColor: '#fff' }}
                  >
                    Chọn lại / thêm bàn
                  </MyButton>
                )}
                <MyButton onClick={handleServing} type="button" color={{ bgColor: 'orange', mainColor: '#fff' }}>
                  Bắt đầu phục vụ
                </MyButton>
              </>
            )}
            {status === 'Đang phục vụ' && (
              <>
                {!reSelectTable && (
                  <MyButton
                    onClick={() => setReSelectTable(true)}
                    type="button"
                    color={{ bgColor: 'orange', mainColor: '#fff' }}
                  >
                    Chọn lại / thêm bàn
                  </MyButton>
                )}
                <MyButton onClick={handleCheckOut} type="button" color={{ bgColor: 'orange', mainColor: '#fff' }}>
                  Thanh toán
                </MyButton>
              </>
            )}
            {status !== 'Đang phục vụ' && status !== 'Đã hủy' && status !== 'Hoàn thành' && (
              <MyButton
                onClick={() => {
                  setCancel(true);
                }}
                type="button"
                color={{ bgColor: '#fe2c55', mainColor: '#fff' }}
              >
                Hủy
              </MyButton>
            )}
          </Box>
        </Box>
      </Box>

      {(overLay || cancel) && (
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
          {cancel && (
            <Box>
              <Box
                sx={{
                  borderRadius: '6px',
                  padding: '10px 20px 20px',
                  width: '680px',
                  margin: '0 auto',
                  backgroundColor: '#fff',
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%,-50%)',
                  '& .inner': { display: 'flex', gap: '10px', flexDirection: 'column' },
                  '& *': { fontSize: '1.2rem!important' },
                }}
              >
                <form
                  style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}
                  onSubmit={handleCancel}
                >
                  <TextareaAutosize
                    name="reasons"
                    placeholder="Lý do hủy ..."
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
                      <MyButton color={{ bgColor: '#fe2c55', mainColor: '#fff' }} type="submit">
                        Xác nhận hủy
                      </MyButton>
                      <MyButton
                        onClick={() => setCancel(false)}
                        type="button"
                        color={{ bgColor: 'green', mainColor: '#fff' }}
                      >
                        Đóng
                      </MyButton>
                    </Box>
                  </Box>
                </form>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default BookingManage;
