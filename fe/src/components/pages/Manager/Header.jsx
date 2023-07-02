import MenuIcon from '@mui/icons-material/Menu';
import { Box, Typography } from '@mui/material';
import { MyButton } from '_/components/common';
import { logout } from '_/redux/slices';
import { routes } from '_/routes';
import { activeAddClass } from '_/utills/activeAddClass';
import { useDispatch } from 'react-redux';

export default function Header(props) {
  const dispatch = useDispatch();
  const { currentUser, sideNav, setSideNav } = props;
  const { email, role, firstName } = currentUser;
  const handleLogout = () => {
    dispatch(logout());
  };
  activeAddClass('header-btn');

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
          gap: '10px',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '10px',
          paddingBottom: '10px',
          maxWidth: '768px',
          minWidth: '762px',
          paddingRight: '0.8rem',
          paddingLeft: '0.8rem',
          marginRight: 'auto',
          marginLeft: 'auto',
          width: '100%',
          zIndex: 2,

          '& h3': {
            fontSize: '1.8rem',
          },
        }}
      >
        <Box sx={{ display: { 0: 'block', 768: 'none' } }}>
          <MyButton style={{ backgroundColor: 'transparent' }} className="btn" onClick={() => setSideNav(!sideNav)}>
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
              <MyButton effect className="btn header-btn" to={routes.usermanage} onClick={() => setSideNav(!sideNav)}>
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
              <MyButton effect className="btn header-btn" to={routes.ordermanage} onClick={() => setSideNav(!sideNav)}>
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
          href={routes.manage}
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
          <Typography sx={{ display: 'inline-flex', fontStyle: 'italic' }}>
            <i>Welcome : {firstName}</i>
          </Typography>
          <Typography sx={{ display: 'inline-flex', fontStyle: 'italic' }}>
            <i>Role : {role}</i>
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
        {/* <Box
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
                </Box> */}
      </Box>
    </Box>
  );
}
