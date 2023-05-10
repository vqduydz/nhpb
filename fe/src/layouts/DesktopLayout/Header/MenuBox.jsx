import { Box, Typography } from '@mui/material';
import { Button } from '_/components/common';

import { routes } from '_/routes';

const MenuBox = (props) => {
    const { handleCloseNavMenu, anchorElNav } = props;
    return (
        <Box
            onClick={handleCloseNavMenu}
            sx={{
                display: { 0: anchorElNav ? 'block' : 'none', 768: 'none' },
                position: 'fixed',
                top: '0',
                left: 0,
                right: 0,
                height: '100vh',
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
                        minWidth: '200px',
                        top: '0',
                        height: '100vh',
                        left: 0,
                        bottom: 0,
                        opacity: '1',

                        '& .nav-action': {
                            padding: '5px 15px',
                            width: '100%',
                            fontSize: '1.6rem',
                            fontWeight: 500,
                            opacity: '0.9',
                            '& span': {
                                color: '#337ab7',
                                gap: '10px',
                                alignItems: 'center',
                            },
                            '&:hover': {
                                backgroundColor: '#0000000a',
                                opacity: '1',
                            },
                        },

                        // '&:hover': {
                        //     backgroundColor: '#555',
                        //     color: '#fff',
                        // },
                    }}
                >
                    <Button
                        className="nav-action"
                        to={routes.home}
                        onClick={() => {
                            handleCloseNavMenu();
                            window.scrollTo(0, 0);
                        }}
                    >
                        <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>Trang chủ</Typography>
                    </Button>
                    <Button
                        className="nav-action"
                        to={routes.menu}
                        onClick={() => {
                            handleCloseNavMenu();
                            window.scrollTo(0, 0);
                        }}
                    >
                        <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>Thực đơn</Typography>
                    </Button>
                    <Button
                        className="nav-action"
                        to={routes.menu}
                        onClick={() => {
                            handleCloseNavMenu();
                            window.scrollTo(0, 0);
                        }}
                    >
                        <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>Khuyến mãi</Typography>
                    </Button>
                    <Button
                        className="nav-action"
                        to={routes.menu}
                        onClick={() => {
                            handleCloseNavMenu();
                            window.scrollTo(0, 0);
                        }}
                    >
                        <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>Đặt bàn</Typography>
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default MenuBox;
