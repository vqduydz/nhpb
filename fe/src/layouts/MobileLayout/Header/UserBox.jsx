import { Logout } from '@mui/icons-material';
import LoginIcon from '@mui/icons-material/Login';
import { Avatar, Box } from '@mui/material';
import { Button } from '_/components/common';
import { Inner } from '_/components/common/CustomComponents/CustomMui';

import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import ListAltIcon from '@mui/icons-material/ListAlt';

const UserBox = (props) => {
    const { handleCloseUserMenu, user, anchorElUser } = props;
    return (
        <Box
            onClick={handleCloseUserMenu}
            sx={{
                display: anchorElUser ? 'block' : 'none',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                '& *': {
                    color: '#000000DE',
                },
            }}
        >
            <Inner sx={{ position: 'relative' }}>
                <Box
                    sx={{
                        boxShadow: '0 0 10px 5px #00000012',
                        backgroundColor: '#fff',
                        color: 'rgba(0, 0, 0, 0.87)',
                        borderRadius: '4px',
                        position: 'absolute',
                        padding: '10px 0',
                        top: '80px',
                        right: 0,
                        opacity: '1',
                        '&:before': {
                            boxShadow: '-6px -6px 8px 0px #00000012',
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 27,
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

                            '&+.user-action': { mt: '5px' },
                            '& span': {
                                gap: '10px',
                                alignItems: 'center',
                            },
                            '&:hover': {
                                backgroundColor: '#0000000a',
                            },
                        },
                    }}
                >
                    {user ? (
                        <>
                            <Button
                                leftIcon={<Avatar sx={{ backgroundColor: 'transparent' }} />}
                                className="user-action"
                                onClick={handleCloseUserMenu}
                            >
                                Quản lý tài khoản
                            </Button>
                            <Button leftIcon={<ListAltIcon />} className="user-action" onClick={handleCloseUserMenu}>
                                Đơn hàng của tôi
                            </Button>
                            <Button leftIcon={<Logout />} className="user-action" onClick={handleCloseUserMenu}>
                                Đăng xuất
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button leftIcon={<LoginIcon />} className="user-action" onClick={handleCloseUserMenu}>
                                Đăng nhập
                            </Button>
                            <Button
                                leftIcon={<AppRegistrationIcon />}
                                className="user-action"
                                onClick={handleCloseUserMenu}
                            >
                                Đăng ký
                            </Button>
                        </>
                    )}
                </Box>
            </Inner>
        </Box>
    );
};

export default UserBox;
