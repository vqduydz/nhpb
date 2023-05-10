import { AddShoppingCart, Logout } from '@mui/icons-material';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Menu,
    MenuItem,
    Avatar,
    Tooltip,
    IconButton,
    Drawer,
    Badge,
    Backdrop,
    Fade,
    Modal,
} from '@mui/material';

import classNames from 'classnames/bind';
import { useSnackbar } from 'notistack';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import logo from '_/assets/images/logo.png';
import { Button, MyButton } from '_/components/common';
import { Inner } from '_/components/common/CustomComponents/CustomMui';
import { useAuth } from '_/context/AuthContext';
import { logout } from '_/redux/slices';
import { persistor } from '_/redux/store';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { routes } from '_/routes';
import styles from './Header.module.scss';
import UserBox from './UserBox';
import Cart from './Cart';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function Header() {
    const navigate = useNavigate();

    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const { handleChangeLanguage, language, currentUser } = useAuth();
    const [anchorElNav, setAnchorElNav] = useState();
    const [anchorElUser, setAnchorElUser] = useState();
    const [cartOpen, setCartOpen] = useState(false);

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

    const handleLogout = () => {
        dispatch(logout());
        persistor.purge();
        enqueueSnackbar('Goodbye , see you again', { variant: 'info' });
    };

    let user = true;

    return (
        <AppBar
            position="sticky"
            sx={{
                padding: '10px 0',
                background: 'rgba(255, 255, 255, 1)',
                zIndex: 3,
                width: '100%',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)',
            }}
        >
            <Inner>
                <Toolbar disableGutters sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: { 0: 'flex', 768: 'none' } }}>
                        <Button onClick={handleOpenNavMenu} className={cx('padding-0-6')}>
                            <MenuIcon sx={{ color: '#000' }} />
                        </Button>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            <Button onClick={handleCloseNavMenu}>
                                <Typography>Chuyên khoa</Typography>
                            </Button>
                            <Button onClick={handleCloseNavMenu}>
                                <Typography>Sở y tế</Typography>
                            </Button>
                            <Button onClick={handleCloseNavMenu}>
                                <Typography>Bác sĩ</Typography>
                            </Button>
                            <Button onClick={handleCloseNavMenu}>
                                <Typography>Gói khám</Typography>
                            </Button>
                        </Menu>
                    </Box>
                    <Box sx={{ display: 'flex', gap: '25px' }}>
                        <Button href={routes.home} className={cx('padding-0')}>
                            <Box
                                sx={{
                                    background: `#fff center/cover  url(${logo}) no-repeat`,
                                    width: '120px',
                                    height: '60px',
                                }}
                            />
                        </Button>
                        <Box sx={{ flexGrow: 1, display: { 0: 'none', 768: 'flex' }, justifyContent: 'space-around' }}>
                            <Button
                                to={routes.menu}
                                onClick={() => {
                                    window.scrollTo(0, 0);
                                }}
                                className={cx('nav-menu')}
                            >
                                <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                                    Thực đơn
                                </Typography>
                            </Button>
                            <Button to={'#'} className={cx('nav-menu')}>
                                <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                                    Khuyến mãi
                                </Typography>
                            </Button>
                            <Button to={'#'} className={cx('nav-menu')}>
                                <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>Đặt bàn</Typography>
                            </Button>
                        </Box>
                    </Box>

                    <Box display="flex" gap={16} alignItems={'center'}>
                        <Badge
                            sx={{ cursor: 'pointer' }}
                            onClick={() => navigate(routes.cart)}
                            badgeContent={6}
                            color="error"
                        >
                            <AddShoppingCart />
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
                                    <Avatar sx={{ width: 32, height: 32 }} />
                                </MyButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    <UserBox handleCloseUserMenu={handleCloseUserMenu} user={user} anchorElUser={anchorElUser} />
                </Toolbar>
            </Inner>
        </AppBar>
    );
}

export default Header;
