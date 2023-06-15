import { Logout } from '@mui/icons-material';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LoginIcon from '@mui/icons-material/Login';
import { Avatar, Box } from '@mui/material';
import { MyButton } from '_/components/common';
import { useAuth } from '_/context/AuthContext';
import { setOrderItems, logout } from '_/redux/slices';
import { routes } from '_/routes';
import { useDispatch } from 'react-redux';

const UserBox = (props) => {
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const { handleCloseUserMenu, anchorElUser } = props;
  const handleLogout = () => {
    dispatch(setOrderItems([]));
    dispatch(logout());
  };
  return (
    <Box
      onClick={handleCloseUserMenu}
      sx={{
        display: anchorElUser ? 'block' : 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '100vh',
        '& *': {
          color: '#000000DE',
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 15px',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            boxShadow: '0 0 10px 5px #00000012',
            backgroundColor: '#fff',
            color: 'rgba(0, 0, 0, 0.87)',
            borderRadius: '4px',
            position: 'absolute',
            padding: '10px 0',
            maxWidth: '270px',
            top: '80px',
            right: 0,
            opacity: '1',
            '&:before': {
              boxShadow: '-6px -6px 8px 0px #00000012',
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 30,
              width: 10,
              height: 10,
              bgcolor: '#fff',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
            '& .user-action': {
              padding: '5px 15px',
              width: '100%',
              fontSize: '1.6rem',
              fontWeight: 500,
              display: 'flex',
              justifyContent: 'start',
              pr: '25px',

              '+.user-action': { borderTop: '1px solid #eee' },
              '& .icon': { width: '40px', backgroundColor: 'transparent' },
              '&:hover': {
                backgroundColor: '#0000000a',
              },
            },
          }}
        >
          {currentUser ? (
            <>
              <MyButton to={routes.profile} className="user-action" onClick={handleCloseUserMenu}>
                <Avatar className="icon" />
                Quản lý tài khoản
              </MyButton>
              <MyButton to={routes.orders} className="user-action" onClick={handleCloseUserMenu}>
                <ListAltIcon className="icon" />
                Đơn hàng của tôi
              </MyButton>
              <MyButton
                className="user-action"
                onClick={() => {
                  handleLogout();
                }}
              >
                <Logout className="icon" />
                Đăng xuất
              </MyButton>
            </>
          ) : (
            <>
              <MyButton to={routes.login} className="user-action" onClick={handleCloseUserMenu}>
                <LoginIcon className="icon" />
                Đăng nhập
              </MyButton>
              <MyButton to={routes.register} className="user-action" onClick={handleCloseUserMenu}>
                <AppRegistrationIcon className="icon" />
                Đăng ký
              </MyButton>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default UserBox;
