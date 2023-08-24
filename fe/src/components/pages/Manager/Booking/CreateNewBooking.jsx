import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import * as tableAPI from '_/services/api/tableApi';
import { MyButton } from '_/components/common';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';
import { useThemMui } from '_/context/ThemeMuiContext';
import * as bookingAPI from '_/services/api/bookingApi';
import { capitalize, dateTimeFormate } from '_/utills';
import removeVietnameseTones from '_/utills/removeVietnameseTones';

import { useNavigate } from 'react-router-dom';
import { routes } from '_/routes';
import TimeDrop from '_/components/common/TimeDrop';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      border: 0,
    },
  },
};

const CreateNewBooking = () => {
  const { loading, setLoading } = useThemMui();
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [typeTableSelect, setTypeTableSelect] = useState('');
  const [typeTableDrop, setTypeTableDrop] = useState([]);
  const [tableSelectList, setTableSelectList] = useState([]);
  const [tableSelect, setTableSelect] = useState([]);
  const [timeSelect, setTimeSelect] = useState('');
  const [type, setType] = useState(1);
  const [display, setDisplay] = useState(false);
  const [customer, setCustomer] = useState({ name: '', phone: '', numberOfGuests: 1 });

  const showList = () => {
    setDisplay(true);
  };
  const hideList = () => {
    setTimeout(() => {
      setDisplay(false);
    }, 200);
  };

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
    (async () => {
      await tableAPI.tableApi().then((res) => {
        const tables = res.tablesShortByType;
        setTypeTableDrop(() => tables.map((table) => table.type));
        setTables(tables);
      });
    })();
  }, [loading]);

  useEffect(() => {
    setTableSelectList(tables.find((group) => group.type === typeTableSelect)?.tables || []);
    setTableSelect([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeTableSelect]);

  useEffect(() => {
    setTypeTableSelect('');
    setTableSelectList([]);
    setTableSelect([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    const tableSelect = typeof value === 'string' ? value.split(',') : value;
    const newArray = tableSelectList.filter((item) => tableSelect.includes(item.name));
    setTableSelect(newArray);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData(e.currentTarget);
      const [date] = dateTimeFormate(new Date()).split(' ');
      const booking_code =
        type === 1
          ? `${removeVietnameseTones(dateTimeFormate(new Date())).replace(/ /g, '')}${
              tableSelect.map((table) => table.name)[0]
            }`
          : `${removeVietnameseTones(dateTimeFormate(new Date())).replace(/ /g, '')}${data.get('phoneNumber')}`;

      const bookingData =
        type === 1
          ? {
              table_id: JSON.stringify(tableSelect.map((table) => table.name)),
              booking_code,
              type,
              customer_name: 'Khách vãng lai',
              status: 'Đang phục vụ',
              arrival_time: dateTimeFormate(new Date()),
              history: JSON.stringify([{ time: new Date(), status: 'Bắt đầu phục vụ', stt_code: 4 }]),
            }
          : {
              booking_code,
              type,
              customer_name: capitalize(data.get('name')),
              customer_phonenumber: data.get('phoneNumber'),
              number_of_guests: data.get('number_of_guests'),
              status: 'Chờ xác nhận',
              note: data.get('note'),
              arrival_time: `${date} ${timeSelect}`,
              history: JSON.stringify([{ time: new Date(), status: 'Đã đặt bàn - chờ xác nhận', stt_code: 1 }]),
            };

      await bookingAPI.createNewBookingApi(bookingData);
      for (const table of tableSelect.map((table) => table.name)) {
        const dataUpdate = { name: table, available: false };
        await tableAPI.updatetableApi(dataUpdate);
      }

      if (type === 3) {
        navigate(`${routes.bookings}/${booking_code}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setTypeTableSelect('');
      setTableSelectList([]);
      setTableSelect([]);
      setCustomer({ name: '', numberOfGuests: 1, phone: '' });
      setTimeSelect('');
    }
  };

  const render = () => {
    return (
      <Box
        sx={{
          borderBottom: '1px solid #f5f5f5',
          '& .time-btn': {
            ':hover': { backgroundColor: '#f5f5f5' },
          },
        }}
      >
        {typeTableDrop.map((time, i) => {
          return (
            <MyButton
              className="time-btn"
              type={'button'}
              style={{
                width: '100%',
                fontSize: '1.4rem',
                padding: '5px 10px',
                lineHeight: 'normal',
                borderBottom: '1px solid #f5f5f5',
                borderRadius: '0',
              }}
              key={i}
              onClick={() => {
                setTypeTableSelect(time);
              }}
            >
              <Typography width={'100%'} textAlign={'left'} fontSize={'1.4rem'}>
                {time}
              </Typography>
            </MyButton>
          );
        })}
      </Box>
    );
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
      <RadioGroup
        sx={{
          marginTop: '15px',
          alignItems: 'center',
          justifyContent: 'space-around',
          '& .Mui-checked': {
            color: 'green!important',
          },
        }}
        onChange={(e) => setType(parseFloat(e.target.value))}
        value={type}
        row
      >
        <FormControlLabel value={1} control={<Radio />} label={'Khách vãng lai'} />
        <FormControlLabel value={2} control={<Radio />} label={'Đặt bàn qua điện thoại'} />
      </RadioGroup>

      <form
        style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '15px' }}
        onSubmit={handleSubmit}
      >
        {type === 1 ? (
          <>
            <Box
              sx={{
                border: '1px solid transparent',
                position: 'relative',
                '& *': { fontSize: '1.4rem !important' },
              }}
            >
              <MyTextField
                autoComplete="off"
                size="small"
                label="Chọn loại bàn"
                fullWidth
                type="text"
                value={typeTableSelect}
                onBlur={hideList}
                onFocus={showList}
                sx={{ background: 'transparent', outline: 'none', border: 'none' }}
                placeholder="Chọn loại bàn ..."
                inputProps={{
                  readOnly: true,
                }}
              />

              {display && (
                <Box
                  className="asdasdas"
                  sx={{
                    backgroundColor: '#fff',
                    position: 'absolute',
                    left: '0',
                    border: '1px solid #ccc',
                    borderBottom: '2px solid #ccc',
                    width: '100%',
                    textAlign: 'left',
                    minHeight: '50px',
                    maxHeight: '30vh',
                    overflow: 'auto',
                    zIndex: 2,
                    overflowY: 'scroll',
                    '& .search-list': {
                      padding: '0 10px',
                    },
                    '*': {
                      color: '#000',
                    },
                  }}
                >
                  {render()}
                </Box>
              )}
            </Box>
            <FormControl
              sx={{
                flex: 1,
                '& *': { fontSize: '1.4rem !important' },
                '& .Mui-focused': { borderTop: '1px solid #afafaf', outline: '1px solid #afafaf' },
                '& .MuiSelect-select.MuiSelect-outlined': {
                  border: 'none!important',
                  outline: 'none!important',
                  padding: '7.5px 14px',
                  '&:focus': {
                    border: 'none!important',
                    outline: '1px solid #afafaf !important',
                  },
                },
              }}
            >
              <Select
                className="asdasda123"
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={tableSelect.map((table) => table.name)}
                onChange={handleChange}
                input={<OutlinedInput />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
                placeholder="Chọn bàn..."
              >
                {tableSelectList.map((table, i) => {
                  return (
                    <MenuItem
                      disabled={!table?.available}
                      sx={{
                        borderTop:
                          (typeTableSelect === 'Bàn lớn' && i % 5 === 0) ||
                          (typeTableSelect === 'Bàn nhỏ' && i % 6 === 0)
                            ? '1px solid #000'
                            : 'none',
                        '& *': { fontSize: '1.4rem !important' },
                        '& .Mui-checked': {
                          color: 'green!important',
                        },
                      }}
                      key={i}
                      value={table?.name}
                    >
                      <Checkbox disabled={!table?.available} checked={tableSelect.indexOf(table) > -1} />
                      <ListItemText primary={!table?.available ? `${table?.name} is not available` : table?.name} />
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </>
        ) : (
          <>
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
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
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
              value={customer.phone}
              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
            />
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
              value={customer.numberOfGuests || 1}
              onChange={(e) => setCustomer({ ...customer, numberOfGuests: e.target.value })}
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
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          {(!!timeSelect && type === 2) || (tableSelect.length && type === 1) ? (
            <MyButton color={{ bgColor: 'green', mainColor: '#fff' }} type="submit">
              Đặt bàn
            </MyButton>
          ) : !!timeSelect && type === 3 ? (
            <MyButton color={{ bgColor: 'green', mainColor: '#fff' }} type="submit">
              Tạo đơn đặt bàn
            </MyButton>
          ) : !timeSelect && type === 3 ? (
            <MyButton disable color={{ bgColor: 'green', mainColor: '#fff' }} type="button">
              Tạo đơn đặt bàn
            </MyButton>
          ) : (
            <MyButton disable color={{ bgColor: 'green', mainColor: '#fff' }} type="button">
              Đặt bàn
            </MyButton>
          )}
        </Box>
      </form>
    </Box>
  );
};

export default CreateNewBooking;
