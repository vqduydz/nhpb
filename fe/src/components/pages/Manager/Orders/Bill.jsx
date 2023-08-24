import { Box, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { getOrderByOrderCode } from '_/redux/slices';
import { renderPrice } from '_/utills';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import CustomizedTables from '../../mainPages/Orders/CustomizedTables';

const Bill = () => {
  const { order_code: _order_code } = useParams();
  const [order, setOrder] = useState({});
  const dispatch = useDispatch();
  const {
    type,
    payment_methods,
    order_code,
    payment,
    ship_fee,
    total_amount,
    total_payment,
    items,
    receiver,
    orderer,
    note,
    deposit_amount,
    table_id,
  } = order;

  useEffect(() => {
    dispatch(getOrderByOrderCode(_order_code))
      .then(unwrapResult)
      .then((res) => {
        const {
          type,
          note,
          deliver,
          handler,
          payment_methods,
          order_code,
          status,
          payment,
          ship_fee,
          total_amount,
          total_payment,
          table_id,
          items,
          history,
          orderer,
          receiver,
          createdAt,
          deposit_amount,
        } = res;

        setOrder({
          type,
          note,
          deliver,
          handler,
          payment_methods,
          order_code,
          status,
          payment,
          ship_fee: ship_fee ? ship_fee : 0,
          total_amount,
          total_payment,
          table_id: table_id ? JSON.parse(table_id) : null,
          history: JSON.parse(history),
          items: JSON.parse(items),
          orderer: { name: JSON.parse(orderer).name, phoneNumber: JSON.parse(orderer).phoneNumber },
          receiver: receiver
            ? {
                name: JSON.parse(receiver).name,
                phoneNumber: JSON.parse(receiver).phoneNumber,
                place: JSON.parse(receiver).address,
              }
            : null,
          createdAt,
          deposit_amount,
        });
      })
      .catch((error) => {
        console.log(error);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_order_code]);

  function createData(name, value) {
    return { name, value };
  }

  const rows =
    type === 1
      ? [createData('Tổng số lượng', total_amount), createData('Tổng tiền thanh toán', renderPrice(payment))]
      : type === 2
      ? [
          createData('Tổng số lượng', total_amount),
          createData('Tổng tiền', renderPrice(payment)),
          createData('Đã cọc', renderPrice(deposit_amount)),
          createData('Tiền thanh toán còn lại', renderPrice(payment - deposit_amount)),
        ]
      : [
          createData('Tổng số lượng', total_amount),
          createData('Tổng tiền', renderPrice(payment)),
          createData('Phí giao hàng', renderPrice(ship_fee)),
          createData('Tổng tiền thanh toán', renderPrice(total_payment)),
          createData('Phương thức Thanh toán', payment_methods),
        ];

  return (
    <Box
      sx={{
        maxWidth: '300px',
        overflow: 'auto',
        width: '100%',
        margin: '0 auto',
        backgroundColor: '#fff',
        pt: 4,
        '& p': {
          fontWeight: 500,
          fontSize: '1.2rem',
          '& i': {
            color: '#337ab7',
            fontWeight: 500,
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', gap: '5px', flexDirection: 'column', backgroundColor: '#fff' }}>
        <Box
          sx={{
            padding: '5px 15px',
            display: 'flex',
            flexDirection: 'column',
            borderBottom: '1px solid #0000000a',
          }}
        >
          <Box
            sx={
              {
                // display: 'flex',
                // justifyContent: 'space-between',
              }
            }
          >
            <Typography>
              Mã đơn hàng : <i>{order_code}</i>
            </Typography>
            <Typography>
              Phân loại : <i>{type}</i>
            </Typography>
          </Box>
          <Typography sx={{ mt: 1, pt: 1, borderTop: '1px solid #0000000a', fontWeight: 700 }}>
            <u> Người đặt</u>
          </Typography>
          <Typography>
            {orderer?.name} --- {orderer?.phoneNumber}
          </Typography>
          <Typography>Mã số bàn : {table_id?.join(', ')}</Typography>
          {receiver && (
            <>
              <Typography sx={{ mt: 1, pt: 1, borderTop: '1px solid #0000000a', fontWeight: 700 }}>
                <u> Người nhận</u>
              </Typography>
              <Box
                sx={{
                  flexDirection: 'column',
                  display: 'flex',
                  '& p': {
                    fontWeight: 500,
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: '10px',
                  }}
                >
                  <Typography>{receiver?.name}</Typography>
                  <Typography> {receiver?.phoneNumber}</Typography>
                </Box>
                <Typography>Địa chỉ :{` ${receiver?.place}`}</Typography>
              </Box>
            </>
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: '2px',
            flexDirection: 'column',
            pt: 2,
            pb: 2,
            borderBottom: '1px solid #0000000a',
          }}
        >
          {items?.map((item, index) => (
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
                  {item.name}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    gap: '15px',
                    justifyContent: 'end',
                    alignItems: 'center',
                    '& p': {
                      color: '#fe2c55',
                    },
                  }}
                >
                  <Typography textAlign={'left'}>ĐG: {renderPrice(item.price)}</Typography>
                  <Typography textAlign={'center'}>SL: {item.quantity}</Typography>
                  <Typography textAlign={'right'}>TT: {renderPrice(item.price * item.quantity)}</Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
        <CustomizedTables
          sx={{
            borderColor: '#fff',
            backgroundColor: 'transparent',
            width: '100%',
            '& td': { borderColor: '#fff', fontWeight: 500, fontSize: '1.2rem', padding: '3px 15px' },
          }}
          rows={rows}
        />
      </Box>
      {note && (
        <Typography sx={{ borderTop: '1px solid #0000000a', pt: '10px', mt: '10px' }}>
          <i style={{ color: '#fe2c55' }}>Ghi chú : {note}</i>
        </Typography>
      )}
      {/* <MyButton
        onClick={handlePrint}
        style={{ width: '100%', position: 'sticky', bottom: -1, opacity: 1, borderRadius: 0 }}
        color={{ bgColor: '#337ab7', borderColor: '#337ab7' }}
      >
        In bill
      </MyButton> */}
    </Box>
  );
};

export default Bill;
