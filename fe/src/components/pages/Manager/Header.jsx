import { Logout } from '@mui/icons-material';
import { Box, Tooltip } from '@mui/material';
import { MyButton } from '_/components/common';
import UserAvatar from '_/components/common/Avatar/Avatar';
import { logout, setOrderItems } from '_/redux/slices';
import { routes } from '_/routes';
import { activeAddClass } from '_/utills/activeAddClass';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function Header() {
  const dispatch = useDispatch();
  const [tab, setTab] = useState();
  const [anchorElUser, setAnchorElUser] = useState();

  const handleLogout = () => {
    dispatch(setOrderItems([]));
    dispatch(logout());
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  activeAddClass('header-btn');

  const btnContent = [
    { tab: 0, content: 'Users', link: routes.usermanage },
    { tab: 1, content: 'Menus', link: routes.menumanage },
    { tab: 2, content: 'Catalogs', link: routes.catalogmanage },
    { tab: 4, content: 'Booking', link: routes.bookingmanage },
    { tab: 3, content: 'Orders', link: routes.ordersmanage },
  ];

  useEffect(() => {
    const currentURL = window.location.href;
    const urlParts = currentURL.split('/');

    const matchedTab =
      btnContent.find((item) => item.link === `/${urlParts[urlParts.length - 1]}`) ||
      btnContent.find((item) => item.link === `/${urlParts[urlParts.length - 2]}`);

    if (matchedTab) setTab(matchedTab.tab);
    else setTab(0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.href]);

  return (
    <Box
      sx={{
        position: 'sticky',
        top: '0',
        backgroundColor: 'rgb(255 255 255)',
        zIndex: '2',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          maxWidth: '768px',
          minWidth: '762px',
          padding: '12px 1.8rem',
          marginRight: 'auto',
          marginLeft: 'auto',
          width: '100%',
          zIndex: 2,
          '& .inner': { fontSize: '1.2rem' },
        }}
      >
        <Box
          className="inner"
          sx={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'start',
            width: '100%',
          }}
        >
          {btnContent.map((btn) => (
            <MyButton
              to={btn.link}
              key={btn.tab}
              text
              fontWeight={700}
              color={{ mainColor: btn.tab === tab ? `#fe2c55` : '#0a66b7' }}
              style={{ borderBottom: btn.tab === tab ? `2px solid #fe2c55` : '2px solid transparent' }}
              padding={'1px 9px'}
              onClick={() => setTab(btn.tab)}
            >
              {btn.content}
            </MyButton>
          ))}
        </Box>
        <Tooltip>
          <MyButton fontSize={1.2} text onClick={handleOpenUserMenu}>
            <UserAvatar
              style={{
                fontSize: '1.4rem',
                width: '30px',
                height: '30px',
                border: '1px solid currentColor',
              }}
            />
          </MyButton>
        </Tooltip>
        <Box
          onClick={handleCloseUserMenu}
          sx={{
            display: anchorElUser ? 'block' : 'none',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '100vh',
            zIndex: 3,
            '& *': {
              color: '#000000DE',
            },
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: '768px',
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
                top: '50px',
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
              <MyButton
                className="user-action"
                onClick={() => {
                  handleLogout();
                }}
              >
                <Logout className="icon" />
                Đăng xuất
              </MyButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
