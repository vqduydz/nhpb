import { Box } from '@mui/material';
import { Inner } from '_/components/common/CustomComponents/CustomMui';
import CreateNewBooking from './CreateNewBooking';

const Bookings = () => {
  return (
    <Box sx={{ pb: '20px', pt: '20px' }}>
      <Inner sx={{ display: 'flex', gap: '5px' }}>
        <Box sx={{ border: '1px solid #eee', mt: '10px', padding: '10px', flex: 1 }}>Hướng dẫn đặt bàn 1 s 3</Box>
        <Box sx={{ border: '1px solid #eee', mt: '10px', padding: '10px', flex: 1 }}>
          <CreateNewBooking />
        </Box>
      </Inner>
    </Box>
  );
};

export default Bookings;

/*
Các bước đặt bàn :
['Tạo 1 đơn đặt bàn bao gồm các thông tin về số lượng người và thời gian đến. Hệ thống sẽ tự lấy thông tin về tên khách hàng và số điện thoại khách hàng tương ứng với tài khoản đăng nhập trong hệ thống. Nếu muốn thay đổi hoặc thêm thông tin người liên hệ vui lòng thêm vào ghi chú. Tại ô ghi chú cũng có thể note thêm những yêu cầu khác ví dụ như vị trí ngồi ...',
'Kiểm tra đơn đặt bàn. Nhấp (chọn) đơn đặt hàng sẽ thấy chi tiết đơn đặt bàn mới tạo, tại đây có thể đặt trước món ăn (nếu cần).',
'Đặt cọc theo hướng dẫn']

*/
