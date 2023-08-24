import { AddShoppingCart } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Avatar, Badge, Box, Toolbar, Tooltip, Typography } from '@mui/material';

import logo from '_/assets/images/logo.png';
import { MyButton } from '_/components/common';
import { useAuth } from '_/context/AuthContext';
import { routes } from '_/routes';
import classNames from 'classnames/bind';
import { useState } from 'react';
import styles from './Header.module.scss';
import MenuBox from './MenuBox';
import UserBox from './UserBox';
import UserAvatar from '_/components/common/Avatar/Avatar';

const cx = classNames.bind(styles);

function Header() {
  const { handleChangeLanguage, language, cartItems, currentUser } = useAuth();
  const [anchorElNav, setAnchorElNav] = useState();
  const [anchorElUser, setAnchorElUser] = useState();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        top: 0,
        left: 0,
        right: 0,
        padding: '10px 0',
        background: 'rgba(255, 255, 255, 1)',

        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)',
        minWidth: 'inherit',
        width: 'unset',
        transform: 'translateZ(0)',
        zIndex: '100',
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 15px',
        }}
      >
        <Box sx={{ display: { 0: 'flex', 768: 'none' } }}>
          <MyButton onClick={handleOpenNavMenu} className={cx('padding-0-6')}>
            <MenuIcon sx={{ color: '#000' }} />
          </MyButton>
        </Box>

        <Box sx={{ display: 'flex', gap: '25px' }}>
          <MyButton href={routes.home} className={cx('padding-0')}>
            <Box
              sx={{
                background: `#fff center/cover  url(${logo}) no-repeat`,
                width: '120px',
                height: '60px',
              }}
            />
          </MyButton>
          <Box
            sx={{
              flexGrow: 1,
              display: { 0: 'none', 768: 'flex' },
              justifyContent: 'space-around',
              '& p': { textTransform: 'uppercase', fontWeight: 700 },
            }}
          >
            <MyButton
              text
              to={routes.menu}
              onClick={() => {
                window.scrollTo(0, 0);
              }}
              className={cx('nav-menu')}
            >
              <Typography>Thực đơn</Typography>
            </MyButton>
            <MyButton text to={'#'} className={cx('nav-menu')}>
              <Typography>Khuyến mãi</Typography>
            </MyButton>
            <MyButton text to={routes.bookings} className={cx('nav-menu')}>
              <Typography>Đặt bàn</Typography>
            </MyButton>
          </Box>
        </Box>

        <Box display="flex" gap={16} alignItems={'center'}>
          <Badge badgeContent={cartItems.length} color="error">
            <MyButton to={currentUser ? routes.cart : routes.login}>
              <AddShoppingCart fontSize="medium" />
            </MyButton>
          </Badge>
          <Box
            sx={{
              display: 'flex',
              flexGrow: 0,
              '& .lg-btn': {
                color: '#45c3d2',
              },
              '& .lg-btn-active': { color: 'red' },
            }}
          >
            <Tooltip title="Tài khoản">
              <MyButton text onClick={handleOpenUserMenu}>
                {!currentUser ? (
                  <Avatar sx={{ width: '40px', height: '40px' }} />
                ) : (
                  <UserAvatar
                    style={{
                      fontSize: '1.4rem',
                      width: '40px',
                      height: '40px',
                      border: '1px solid currentColor',
                    }}
                  />
                )}
              </MyButton>
            </Tooltip>
          </Box>
        </Box>
        <MenuBox handleCloseNavMenu={handleCloseNavMenu} anchorElNav={anchorElNav} />
        <UserBox handleCloseUserMenu={handleCloseUserMenu} anchorElUser={anchorElUser} />
      </Toolbar>
    </AppBar>
  );
}

export default Header;
