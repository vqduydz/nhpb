import { Box, TextareaAutosize } from '@mui/material';
import { useState } from 'react';

import { MyButton } from '_/components/common';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';
import { useThemMui } from '_/context/ThemeMuiContext';
import * as bookingAPI from '_/services/api/bookingApi';
import { capitalize, dateTimeFormate } from '_/utills';
import removeVietnameseTones from '_/utills/removeVietnameseTones';

import TimeDrop from './TimeDrop';

const CreateNewBooking = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData(e.currentTarget);
      const customer_phonenumber = data.get('phoneNumber');
      const customer_name = capitalize(data.get('name'));
      const number_of_guests = data.get('number_of_guests');
      const [date] = dateTimeFormate(new Date()).split(' ');
      const history = [{ time: new Date(), status: 'Đã đặt bàn - chờ xác nhận', stt_code: 1 }];
      const bookingData = {
        booking_code: `${removeVietnameseTones(dateTimeFormate(new Date())).replace(/ /g, '')}${customer_phonenumber}`,
        type: 'Phone Booking',
        customer_name,
        customer_phonenumber,
        number_of_guests,
        status: 'Chờ xác nhận',
        note: data.get('note'),
        arrival_time: `${date} ${timeSelect}`,
        history: JSON.stringify(history),
      };
      await bookingAPI.createNewBookingApi(bookingData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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
      <form
        style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '15px' }}
        onSubmit={handleSubmit}
      >
        <MyTextField
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
          required
          size="small"
          label="Sđt khách hàng"
          fullWidth
          name="phoneNumber"
          type="number"
          id="phoneNumber"
          autoComplete="off"
        />
        <MyTextField
          inputProps={{
            min: 1,
          }}
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
        <TextareaAutosize
          className="text-area"
          name="note"
          placeholder="Ghi chú ..."
          style={{
            overflow: 'auto',
            height: '80px',
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
