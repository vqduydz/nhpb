import { Box, FormControlLabel, Radio, RadioGroup, TextareaAutosize, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { MyButton } from '_/components/common';
import { useThemMui } from '_/context/ThemeMuiContext';
import * as bookingAPI from '_/services/api/bookingApi';
import * as tableAPI from '_/services/api/tableApi';
import { dateTimeFormate, renderPrice } from '_/utills';
import { routes } from '_/routes';
import BookingTimeline from '../../Manager/Booking/BookingTimeline';
import AddMenu from './AddMenu';

const Booking = () => {
  const navigate = useNavigate();
  const { booking_code: _booking_code } = useParams();
  const { loading, setLoading } = useThemMui();
  const [booking, setBooking] = useState({});
  const [overLay, setOverLay] = useState(false);
  const [total, setTotal] = useState(0);
  const [depositAmount, setDepositAmount] = useState();
  const [cancel, setCancel] = useState(false);
  const [option, setOption] = useState(0);

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
    history: currentHistory,
    order,
  } = booking;

  useEffect(() => {
    const total = order?.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.price * currentValue.quantity;
    }, 0);
    setTotal(total);
  }, [order]);

  useEffect(() => {
    setDepositAmount(() => {
      const min = Math.round((total / 5 + 50000) / 100000) * 100000;
      if (!total || min <= 200000 || total <= 800000) return 200000;
      return min;
    });
  }, [total]);

  useEffect(() => {
    bookingAPI
      .getBookingApi({ booking_code: _booking_code })
      .then((result) => {
        if (!result || !result.bookings || !result.bookings.length) {
          navigate(routes.bookingmanage);
          return;
        }
        const { table_id, order, arrival_time, history, createdAt } = result.bookings[0];

        setBooking({
          ...result.bookings[0],
          table_id: JSON.parse(table_id),
          order: JSON.parse(order),
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
  const handleBooking = async (data) => {
    console.log({ data });
    setLoading(true);
    try {
      const history = [...currentHistory, { time: new Date(), status: 'Đã đặt bàn - chờ xác nhận', stt_code: 1 }];
      const dataUpdate = {
        status: 'Chờ xác nhận',
        history: JSON.stringify(history),
        booking_code,
        order: data ? JSON.stringify(data) : JSON.stringify([]),
      };
      await updateBooking(dataUpdate);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData(e.currentTarget);
      const history = [
        ...currentHistory,
        {
          time: new Date(),
          status: 'Đã hủy',
          refund: (() => {
            let refund;

            if (deposit_amount) {
              refund =
                (currentHistory?.some((item) => item.stt_code === 2) &&
                  !currentHistory?.some((item) => item.stt_code === 3)) ||
                (currentHistory?.some((item) => item.stt_code === 3) && deposit_amount > 200000)
                  ? 'Chưa hoàn tiền'
                  : 'Không hoàn tiền';
            } else {
              refund = null;
            }
            return refund;
          })(),
          stt_code: 6,
          reasons: data.get('reasons'),
        },
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
      <Box sx={{ pb: '20px', pt: '20px', backgroundColor: '#00000005' }}>
        <Box
          sx={{
            maxWidth: '768px',
            m: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            '& p , span': { fontWeight: 500, fontSize: '1.4rem' },
            '& i': {
              fontSize: '1.2rem',
            },
          }}
        >
          <Box sx={{ padding: '10px', backgroundColor: 'red', color: '#fff', fontSize: '2rem', fontWeight: 700 }}>
            Chi tiết đơn {booking_code}
          </Box>
          <Box sx={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
            <Box
              sx={{
                flex: 1,
                padding: '5px 10px',
                border: '1px solid #0000000a',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography>Mã : {booking_code}</Typography>
              <Typography>Phân loại : {type}</Typography> <Typography>Trạng thái : {status}</Typography>
              <Typography sx={{ mt: 2, pt: 2, borderTop: '1px solid #0000000a', fontWeight: 700 }}>
                Thông tin khách hàng
              </Typography>
              <Typography>Tên : {customer_name}</Typography>
              <Typography>Số điện thoại : {customer_phonenumber}</Typography>
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #0000000a' }}>
                <Typography>Thời gian đặt : {booking_time}</Typography>
                <Typography>Thời gian đến : {arrival_time}</Typography>
                <Typography>Số lượng khách dự kiến : {number_of_guests}</Typography>
                <Typography>Mã số bàn : {table_id?.join(', ')}</Typography>
              </Box>
              <Typography sx={{ mt: 2, pt: 2, borderTop: '1px solid #0000000a' }}>Ghi chú : {note}</Typography>
              <Typography sx={{ mt: 2, pt: 2, borderTop: '1px solid #0000000a' }}>
                Lịch sử cập nhật trạng thái :
              </Typography>
              {currentHistory && <BookingTimeline list={currentHistory} />}
            </Box>
            <Box sx={{ padding: '5px 10px', border: '1px solid #0000000a', width: '450px' }}>
              {status === 'Chưa xử lý' ? (
                <>
                  <RadioGroup
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'start',
                      fontSize: '1.4rem',
                      '& .Mui-checked': {
                        color: 'green!important',
                      },
                    }}
                    onChange={(e) => setOption(parseFloat(e.target.value))}
                    value={option}
                    row
                  >
                    <FormControlLabel value={0} control={<Radio />} label={'Đặt bàn, không đặt trước món ăn'} />
                    <FormControlLabel value={1} control={<Radio />} label={'Đặt bàn và có đặt trước món ăn'} />
                  </RadioGroup>
                  <i style={{ color: '#fe2c55', display: 'block', marginBottom: option === 0 ? '100px' : '0' }}>
                    Lưu ý : sau khi xác nhận đặt bàn, sẽ không tự ý đặt thêm món được nữa nếu muốn thay đổi cần liên hệ
                    trực tiếp cho nhân viên.
                  </i>
                  {option !== 0 && (
                    <Box sx={{ mt: '10px' }}>
                      <AddMenu orderList={order} handleSubmit={handleBooking} />
                    </Box>
                  )}

                  <Box
                    sx={{
                      display: 'flex',
                      gap: '5px',
                      flexDirection: 'column',

                      padding: '5px 10px',
                    }}
                  >
                    {option === 0 && (
                      <>
                        <Box
                          sx={{
                            display: 'flex',
                            gap: '10px',
                            justifyContent: 'end',
                            alignItems: 'center',
                            minHeight: '32px',
                            padding: '5px 0',
                            color: '#fe2c55',
                            borderBottom: '1px solid #0000000a',
                          }}
                        >
                          <Typography align="right" sx={{ display: 'block' }} fontWeight={700}>
                            Số tiền cần đặt cọc
                          </Typography>
                          <Typography textAlign={'right'} fontWeight={700} sx={{ display: 'block', width: '120px' }}>
                            {renderPrice(depositAmount)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'end',
                          }}
                        >
                          <MyButton
                            color={{ bgColor: 'green', mainColor: '#fff' }}
                            type="button"
                            onClick={() => handleBooking()}
                          >
                            Đặt bàn
                          </MyButton>
                        </Box>
                      </>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                      <MyButton
                        style={{ width: 'auto' }}
                        onClick={() => {
                          setCancel(true);
                        }}
                        type="button"
                        color={{ bgColor: '#fe2c55', mainColor: '#fff' }}
                      >
                        Hủy Đặt bàn
                      </MyButton>
                    </Box>
                  </Box>
                </>
              ) : (
                <>
                  <Box sx={{ mt: 2, display: 'flex', gap: '2px', flexDirection: 'column' }}>
                    <Typography fontWeight={700}>Danh sách món ăn:</Typography>
                    <Box sx={{ height: '300px', overflow: 'auto', '& p': { fontWeight: 500 } }}>
                      {order?.length ? (
                        <Box>
                          {/* <Box
                          sx={{
                            display: 'flex',
                            gap: '10px',
                            justifyContent: 'end',
                            alignItems: 'center',
                            '& p': {
                              color: '#fe2c55',
                            },
                          }}
                        >
                          <Typography textAlign={'center'} width={'100px'}>
                            Đơn giá
                          </Typography>
                          <Typography textAlign={'center'} width={'70px'}>
                            Số lượng
                          </Typography>
                          <Typography textAlign={'right'} width={'100px'}>
                            Thành tiền
                          </Typography>
                        </Box> */}
                          {order.map((item, index) => (
                            <Box
                              key={index}
                              sx={{
                                padding: '2px',
                                display: 'flex',
                                textAlign: 'center',
                                gap: '1px',
                                borderTop: index > 0 ? '1px solid #0000000a' : 'none',
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
                                    gap: '10px',
                                    justifyContent: 'end',
                                    alignItems: 'center',
                                    '& p': {
                                      color: '#fe2c55',
                                      textAlign: 'right',
                                    },
                                  }}
                                >
                                  <Typography width={'100px'}>{renderPrice(item.price)}</Typography>
                                  <Typography width={'40px'}>x{item.quantity}</Typography>
                                  <Typography width={'100px'}>{renderPrice(item.total)}</Typography>
                                </Box>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Box sx={{ mt: 2, display: 'flex', gap: '2px', flexDirection: 'column' }}>
                          <Box sx={{ maxHeight: '300px', overflow: 'auto', '& p': { fontWeight: 500 } }}>
                            <Typography>Chưa đặt món</Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      borderTop: '1px solid #0000000a',
                      display: 'flex',
                      gap: '5px',
                      flexDirection: 'column',
                      padding: '5px 10px',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '10px',
                        flexDirection: 'row',
                        justifyContent: 'end',
                        alignItems: 'center',
                        minHeight: '32px',
                        color: '#fe2c55',
                      }}
                    >
                      <Typography align="right" sx={{ display: 'block' }} fontWeight={700}>
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
                    {deposit_amount ? (
                      <>
                        <Box
                          sx={{
                            display: 'flex',
                            gap: '10px',
                            justifyContent: 'end',
                            alignItems: 'center',
                            minHeight: '32px',
                            padding: '5px 0',
                            color: '#fe2c55',
                          }}
                        >
                          <Typography align="right" sx={{ display: 'block' }} fontWeight={700}>
                            Số tiền đã đặt cọc
                          </Typography>
                          <Typography textAlign={'right'} fontWeight={700} sx={{ display: 'block', width: '120px' }}>
                            {renderPrice(deposit_amount)}
                          </Typography>
                        </Box>

                        {status === 'Đã hủy' && (
                          <Box>
                            {currentHistory?.some((item) => item.stt_code === 3) ? (
                              <Box
                                sx={{
                                  display: 'flex',
                                  gap: '10px',
                                  justifyContent: 'end',
                                  alignItems: 'center',
                                  minHeight: '32px',
                                  padding: '5px 0',
                                  color: '#fe2c55',
                                }}
                              >
                                <Typography align="right" sx={{ display: 'block' }} fontWeight={700}>
                                  Số tiền hoàn trả
                                </Typography>
                                <Typography
                                  textAlign={'right'}
                                  fontWeight={700}
                                  sx={{ display: 'block', width: '120px' }}
                                >
                                  {renderPrice((deposit_amount / 5) * 4 > 200000 ? deposit_amount / 5 : 0)}
                                </Typography>
                              </Box>
                            ) : (
                              <Box
                                sx={{
                                  display: 'flex',
                                  gap: '10px',
                                  justifyContent: 'end',
                                  alignItems: 'center',
                                  minHeight: '32px',
                                  padding: '5px 0',
                                  color: '#fe2c55',
                                }}
                              >
                                <Typography align="right" sx={{ display: 'block' }} fontWeight={700}>
                                  Số tiền hoàn trả
                                </Typography>
                                <Typography
                                  textAlign={'right'}
                                  fontWeight={700}
                                  sx={{ display: 'block', width: '120px' }}
                                >
                                  {renderPrice(deposit_amount / 2)}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        )}
                        {status !== 'Đã hủy' && status !== 'Đã xác nhận' && status !== 'Đã chuẩn bị' && (
                          <Box
                            sx={{
                              display: 'flex',
                              gap: '10px',
                              justifyContent: 'end',
                              alignItems: 'center',
                              minHeight: '32px',
                              padding: '5px 0',
                              color: '#fe2c55',
                            }}
                          >
                            <Typography align="right" sx={{ display: 'block' }} fontWeight={700}>
                              Số tiền thanh toán còn lại
                            </Typography>
                            <Typography textAlign={'right'} fontWeight={700} sx={{ display: 'block', width: '120px' }}>
                              {renderPrice(total - deposit_amount)}
                            </Typography>
                          </Box>
                        )}
                      </>
                    ) : (
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '10px',
                          justifyContent: 'end',
                          alignItems: 'center',
                          minHeight: '32px',
                          padding: '5px 0',
                          color: '#fe2c55',
                        }}
                      >
                        <Typography align="right" sx={{ display: 'block' }} fontWeight={700}>
                          Số tiền cần đặt cọc
                        </Typography>
                        <Typography textAlign={'right'} fontWeight={700} sx={{ display: 'block', width: '120px' }}>
                          {renderPrice(depositAmount)}
                        </Typography>
                      </Box>
                    )}
                    {status !== 'Đã hủy' && status !== 'Đang phục vụ' && status !== 'Hoàn thành' && (
                      <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                        <MyButton
                          style={{ width: 'auto' }}
                          onClick={() => {
                            setCancel(true);
                          }}
                          type="button"
                          color={{ bgColor: '#fe2c55', mainColor: '#fff' }}
                        >
                          Hủy Đặt bàn
                        </MyButton>
                      </Box>
                    )}
                  </Box>
                </>
              )}
            </Box>
          </Box>
          {status === 'Chờ xác nhận' && (
            <>
              <Box sx={{ backgroundColor: 'orange', padding: '5px', color: '#fff' }}>
                <Typography>
                  Quí khách vui lòng đặt cọc với số tiền tương ứng là
                  <u style={{ fontWeight: 700 }}> {renderPrice(depositAmount)}</u>.
                  <MyButton padding={'0 10px'} fontSize={1.4} text to={'#'} color={{ mainColor: 'blue' }}>
                    &gt;&gt;&gt; Xem hướng dẫn đặt cọc
                  </MyButton>
                </Typography>
              </Box>
              <Typography
                sx={{
                  borderBottom: '1px solid #0000000a',
                  padding: '5px',
                  color: '#fff',
                  backgroundColor: 'orange',
                  textAlign: 'justify',
                }}
              >
                Nhân viên sẽ liên hệ xác nhận về việc đặt bàn của quí khách trong vòng 15 phút. Nếu quá 15 phút mà vẫn
                chưa có nhân viên liên hệ xác nhận, quí khách vui lòng chủ động liên hệ trực tiếp với nhân viên qua
                hotline để được xử lý. Xin cám ơn.
              </Typography>
            </>
          )}
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
              {cancel && (
                <form
                  style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}
                  onSubmit={handleCancel}
                >
                  <TextareaAutosize
                    name="reasons"
                    placeholder="Lý do hủy ..."
                    autoFocus
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
                  {deposit_amount && (
                    <Typography fontStyle={'italic'} color={'#fe2c55'}>
                      Lưu ý :
                      {currentHistory?.some((item) => item.stt_code === 2) &&
                        !currentHistory?.some((item) => item.stt_code === 3) &&
                        `Vì đơn đã được xác nhận và trong quá trình chuẩn bị nên khi hủy quí khách sẽ chỉ được hoàn tiền bằng với 50% số tiền đã đặt cọc tương đương ${renderPrice(
                          deposit_amount / 2,
                        )}.`}
                      {currentHistory?.some((item) => item.stt_code === 3) &&
                        `Vì đơn đã được chuẩn bị xong nên khi hủy quí khách chỉ được hoàn tiền khi tiền cọc lớn hơn hoặc bằng 300.000 đ và chỉ được hoàn tiền bằng với 20% số tiền đã đặt cọc. Vì vậy
                        ${
                          deposit_amount > 200000
                            ? `số tiền được hoàn trả tương đương là ${renderPrice(deposit_amount / 5)}`
                            : 'quí khách sẽ không được hoàn tiền.'
                        }`}
                    </Typography>
                  )}

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
              )}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Booking;

const a = [
  {
    time: '2023-08-21T04:07:28.184Z',
    status: 'Đã đặt bàn - chờ xác nhận',
    stt_code: 1,
  },
  {
    time: '2023-08-21T04:07:35.479Z',
    status: 'Đã xác nhận & đặt cọc',
    stt_code: 2,
  },
  {
    time: '2023-08-21T04:07:40.399Z',
    status: 'Đã hủy',
    stt_code: 6,
    reasons: '',
  },
];
