import Box from '@mui/material/Box';
import icon from '_/assets/icon';
import { MyButton } from '_/components/common';
import { muiCustomStyles } from '_/components/common/CustomComponents/CustomMui';
import { useAuth } from '_/context/AuthContext';

export default function AuthWrapper({ children }) {
    const { handleChangeLanguage, language } = useAuth();
    return (
        <Box
            sx={{
                backgroundImage: "url('https://colorlib.com/etc/lf/Login_v3/images/bg-01.jpg')",
                width: '100%',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                position: 'relative',
                zIndex: '1',
                '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    zIndex: '-1',
                    width: '100%',
                    height: '100%',
                    top: '0',
                    left: '0',
                    backgroundColor: 'rgba(255,255,255,.9)',
                },
            }}
        >
            <Box
                sx={{
                    zIndex: 1,
                    position: 'absolute',
                    right: 0,
                    top: '1vh',
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
            <Box
                sx={{
                    borderRadius: { 768: '10px' },
                    padding: '35px 20px 37px',
                    maxWidth: { 768: '480px' },
                    width: '100%',
                    minWidth: '300px',
                    margin: '0 auto',
                    backgroundColor: '#fff',
                    position: 'fixed',
                    top: { 768: '10px' },
                    left: { 768: '50%' },
                    transform: { 768: 'translateX(-50%)' },
                    boxShadow: '0 0 10px 5px #00000012',
                    height: { 0: '100%', 768: 'calc(100% - 20px)' },
                    overflow: 'auto',
                }}
            >
                <MyButton
                    href="/"
                    style={{
                        width: '100%',
                        backgroundColor: 'transparent',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        height: '40px',
                        // width: '180px',
                        backgroundImage: `url(${icon.logo})`,
                        backgroundPosition: 'center center',
                        backgroundRepeat: 'no-repeat',
                        marginBottom: '20px',
                    }}
                />

                <Box sx={{ ...muiCustomStyles }}>{children}</Box>
            </Box>
        </Box>
    );
}
