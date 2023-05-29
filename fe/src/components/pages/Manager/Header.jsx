import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { MyButton } from '_/components/common';
import { useAuth } from '_/context/AuthContext';
import { logout } from '_/redux/slices';
import { persistor } from '_/redux/store';
import { routes } from '_/routes';
import { activeAddClass } from '_/utills/activeAddClass';

export default function Header(props) {
  const dispatch = useDispatch();
  const { currentUser, sideNav, setSideNav } = props;
  const { email, role, firstName } = currentUser;
  const { handleChangeLanguage, language } = useAuth();
  const handleLogout = () => {
    dispatch(logout());
    // persistor.purge();
  };

  activeAddClass('header-btn');

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#fff',
        minWidth: '768px',
        zIndex: 2,
        width: '100%',
        '& h3': {
          fontSize: '1.8rem',
        },
      }}
    >
      <Container sx={{ padding: '0' }}>
        <Toolbar
          disableGutters
          sx={{
            width: '100%',
            minHeight: 'unset',
            '& h4 , .btn': {
              fontSize: '1.4rem',
              maxHeight: '30px',
              '& *': {
                whiteSpace: 'unset',
              },
            },
          }}
        >
          <Box sx={{ width: '100%' }}>
            <Box
              sx={{
                padding: '5px 15px',
                display: 'flex',
                flexDirection: 'row',
                columnGap: '10px',
                alignItems: 'center',
                width: '100%',
                borderBottom: '1px solid #33333312',
                // backgroundColor: '#a0a6e8',
              }}
            >
              <Box sx={{ display: { 0: 'block', 768: 'none' } }}>
                <MyButton
                  style={{ backgroundColor: 'transparent' }}
                  className="btn"
                  onClick={() => setSideNav(!sideNav)}
                >
                  <MenuIcon sx={{ fontSize: '2rem', color: '#000' }} />
                </MyButton>
                {sideNav && (
                  <Box
                    sx={{
                      padding: '1vh',
                      position: 'fixed',
                      left: 0,
                      top: '40px',
                      maxWidth: '60vh',
                      height: '100vh',
                      backgroundColor: '#fff',
                      '& h4 , .btn': {
                        mt: '10px',
                        width: '100%',
                      },
                      '& .btn': {
                        '& *': { justifyContent: 'center' },
                      },
                      display: 'block',
                    }}
                  >
                    <Typography sx={{ fontStyle: 'italic' }} variant="h4">
                      <b>{email}</b>
                    </Typography>
                    <Typography sx={{ fontStyle: 'italic' }} variant="h4">
                      <b>{role}</b>
                    </Typography>
                    <MyButton
                      effect
                      className="btn header-btn"
                      to={routes.usermanage}
                      onClick={() => setSideNav(!sideNav)}
                    >
                      User Manage
                    </MyButton>
                    <MyButton
                      effect
                      className="btn header-btn"
                      to={routes.contentmanage}
                      onClick={() => setSideNav(!sideNav)}
                    >
                      A Manage
                    </MyButton>
                    <MyButton
                      effect
                      className="btn header-btn"
                      to={routes.ordermanage}
                      onClick={() => setSideNav(!sideNav)}
                    >
                      B Manage
                    </MyButton>

                    <MyButton className="btn header-btn" onClick={handleLogout}>
                      Log out
                    </MyButton>
                  </Box>
                )}
              </Box>
              <MyButton
                padding="5px"
                fontSize={2.5}
                className="header-btn logo"
                effect
                text
                to={routes.manage}
                style={{
                  minWidth: '120px',
                  fontWeight: '700',
                  marginRight: '15px',
                  color: 'blue',
                }}
              >
                Manage
              </MyButton>
              <Box
                sx={{
                  width: '100%',
                  display: { 0: 'none', 768: 'flex' },
                  position: 'relative',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography sx={{ display: 'inline-flex', fontStyle: 'italic' }} variant="h4">
                  Welcome : <b>{firstName}</b>
                </Typography>
                <Typography sx={{ display: 'inline-flex', fontStyle: 'italic' }} variant="h4">
                  Role : <b>{role}</b>
                </Typography>

                <MyButton
                  effect
                  fontSize={1.3}
                  padding="5px 15px"
                  color={{ mainColor: 'red' }}
                  onClick={handleLogout}
                  type="button"
                >
                  Log out
                </MyButton>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexGrow: 0,
                  '& .lg-btn': {
                    color: '#fffs',
                    padding: '5px 15px',
                    mr: '1vh',
                  },
                  '& .lg-btn-active': { color: '#45c3d2' },
                }}
              >
                <MyButton
                  color={{ textColorBefore: '#fff' }}
                  effect
                  onClick={() => handleChangeLanguage('vi')}
                  className={language === 'vi' ? 'lg-btn lg-btn-active' : 'lg-btn'}
                >
                  VN
                </MyButton>
                <MyButton
                  color={{ textColorBefore: '#fff' }}
                  effect
                  onClick={() => handleChangeLanguage('en')}
                  className={language === 'en' ? 'lg-btn lg-btn-active' : 'lg-btn'}
                >
                  EN
                </MyButton>
              </Box>
            </Box>

            <Box
              sx={{
                width: '100%',
                display: { 0: 'none', 768: 'flex' },
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'flex-start',
                columnGap: '1px',
                '& .header-btn': {
                  flex: 1,
                  fontSize: '1.6rem',
                  borderRadius: 0,
                  backgroundColor: '#fff',
                  wordBreak: 'unset',
                  '& *': { justifyContent: 'center' },
                  '&.active': {
                    flex: 1.3,
                    backgroundColor: '#3300ff',
                    color: '#fff',
                    b: {
                      backgroundColor: '#3300ff',
                      color: '#fff',
                    },
                  },
                },
              }}
            >
              <MyButton
                effect
                color={{ mainColor: '#3300ff', subColor: '#ffff00' }}
                className="header-btn"
                to={routes.usermanage}
              >
                User manage
              </MyButton>
              <MyButton
                effect
                color={{ mainColor: '#3300ff', subColor: '#ffff00' }}
                className="header-btn"
                to={routes.menumanage}
              >
                Menu manage
              </MyButton>
              <MyButton
                effect
                color={{ mainColor: '#3300ff', subColor: '#ffff00' }}
                className="header-btn"
                to={routes.catalogmanage}
              >
                Catalog manage
              </MyButton>
              <MyButton
                effect
                color={{ mainColor: '#3300ff', subColor: '#ffff00' }}
                className="header-btn"
                to={routes.ordersmanage}
              >
                Order manage
              </MyButton>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
