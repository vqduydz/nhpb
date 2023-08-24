import { Box, Typography } from '@mui/material';
import ReceiverUpdate from './ReceiverUpdate';
import { MyButton } from '_/components/common';

const Receiver = ({ updateModel, setUpdateModel, receiver, setReceiver }) => {
  return (
    <>
      {receiver.status && (
        <>
          <Box>
            <Typography fontWeight={700}>NGƯỜI NHẬN</Typography>{' '}
            <MyButton
              onClick={() => setReceiver({ status: false })}
              fontSize={1.6}
              padding={'0 5px'}
              color={{ bgColor: '#fe2c55' }}
              fontWeight={500}
            >
              Hủy bỏ thông tin người nhận
            </MyButton>
          </Box>
          <Box sx={{ display: 'flex', gap: '30px' }}>
            <Typography fontWeight={500}>Tên: {receiver.name}</Typography>
            <Typography fontWeight={500}>Số điện thoại: {receiver.phoneNumber}</Typography>
          </Box>
          <Typography fontWeight={500}>Địa chỉ: {receiver.address}</Typography>
        </>
      )}
      {(updateModel.orderer || updateModel.receiver) && (
        <ReceiverUpdate
          receiver={receiver}
          updateModel={updateModel}
          setUpdateModel={setUpdateModel}
          setReceiver={setReceiver}
        />
      )}
    </>
  );
};

export default Receiver;
