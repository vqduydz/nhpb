import { Box, TextareaAutosize } from '@mui/material';
import { MyButton } from '_/components/common';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';
import TimeDrop from '_/components/common/TimeDrop';
import { useAuth } from '_/context/AuthContext';
import { useThemMui } from '_/context/ThemeMuiContext';
import { routes } from '_/routes';
import * as bookingAPI from '_/services/api/bookingApi';
import { dateTimeFormate } from '_/utills';
import removeVietnameseTones from '_/utills/removeVietnameseTones';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateNewBooking = () => {
  const { setLoading } = useThemMui();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [timeSelect, setTimeSelect] = useState('');
  const { id, firstName, lastName, phoneNumber } = currentUser;
  const [numberOfGuests, setNumberOfGuests] = useState(1);

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
      const [date] = dateTimeFormate(new Date()).split(' ');
      const booking_code = `${removeVietnameseTones(dateTimeFormate(new Date())).replace(/ /g, '')}${id}`;
      const bookingData = {
        booking_code,
        type: 3,
        customer_name: `${firstName} ${lastName}`,
        customer_phonenumber: phoneNumber,
        number_of_guests: data.get('number_of_guests'),
        status: 'Chưa xử lý',
        note: data.get('note'),
        arrival_time: `${date} ${timeSelect}`,
        history: JSON.stringify([{ time: new Date(), status: 'Đã tạo đơn', stt_code: 1 }]),
      };

      await bookingAPI.createNewBookingApi(bookingData);

      navigate(`${routes.bookings}/${booking_code}`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setNumberOfGuests(1);
      setTimeSelect('');
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
        <>
          <MyTextField
            inputProps={{
              min: 1,
            }}
            required
            size="small"
            label="SL khách dự kiến"
            fullWidth
            name="number_of_guests"
            type="number"
            id="number_of_guests"
            autoComplete="off"
            value={numberOfGuests}
            onChange={(e) => setNumberOfGuests(e.target.value)}
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
        </>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          {!!timeSelect ? (
            <MyButton color={{ bgColor: 'green', mainColor: '#fff' }} type="submit">
              Tạo đơn đặt bàn
            </MyButton>
          ) : (
            <MyButton disable color={{ bgColor: 'green', mainColor: '#fff' }} type="button">
              Tạo đơn đặt bàn
            </MyButton>
          )}
        </Box>
      </form>
    </Box>
  );
};

export default CreateNewBooking;
