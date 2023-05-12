import DoneIcon from '@mui/icons-material/Done';
import PlaceIcon from '@mui/icons-material/Place';
import { Box, Typography } from '@mui/material';

import icon from '_/assets/icon';
import { Button } from '_/components/common';
import { Inner } from '_/components/common/CustomComponents/CustomMui';

function Footer() {
    return (
        <Box sx={{ backgroundColor: '#f5f5f5' }}>
            <Inner
                sx={{
                    display: 'flex',
                    padding: { 0: '15px', 768: '30px 15px' },
                    flexDirection: { 0: 'column', 768: 'row' },
                    borderBottom: 'solid 1px #ccc',
                    width: '100%',
                }}
            >
                <Box
                    sx={{
                        flex: 2,
                        borderBottom: { 0: 'solid 1px #ccc', 768: 'none' },
                        paddingBottom: { 0: '10px', 768: 0 },
                    }}
                >
                    <Box sx={{ mt: '10px' }}>
                        <Typography
                            sx={{
                                fontSize: '2.4rem',
                                fontWeight: 700,
                                margin: '5px 0',
                            }}
                        >
                            Nhà hàng phố biển
                        </Typography>
                        <Typography>
                            <PlaceIcon sx={{ fontSize: '1.5rem !important', marginRight: '5px' }} />
                            VPĐD : 123 Thành Thái, P.14, Q.10, Tp.HCM.
                        </Typography>
                        <Typography>
                            <DoneIcon sx={{ fontSize: '1.5rem !important', marginRight: '5px' }} />
                            ĐKKD số: 111111xxxx. Sở KHĐT HCM cấp ngày 16/03/2015
                        </Typography>
                    </Box>

                    <Button
                        style={{ marginTop: '10px', padding: '0', height: '60px', width: '200px' }}
                        target="_blank"
                        href="http://online.gov.vn/Home/WebDetails/68563"
                    >
                        <img
                            src={icon.boCongThuong}
                            style={{ width: '100%', height: '100%' }}
                            data-src="/assets/icon/bo-cong-thuong.svg"
                            alt="Đã thông báo với bộ công thương"
                        />
                    </Button>
                </Box>
                <Box sx={{ flex: 2, padding: '0 5px', gap: '15px', paddingTop: { 0: '10px', 768: 0 } }}>
                    <Box>
                        <strong>CN1 : </strong> 123 Thành Thái, P.14, Q.10, Tp.HCM.
                    </Box>
                    <Box>
                        <strong>CN2 : </strong> 123 Hồ Bá Kiện, P.15, Q.10, Tp.HCM.
                    </Box>
                    <Box>
                        <strong>CN3 : </strong> 123 Hồ Đắc Di, P.Tây Thạnh, Q.Tân Phú, Tp.HCM.
                    </Box>
                    <Box>
                        <strong>CN4 : </strong> 123 Bùi Xương Trạch, P.Long Trường, Tp.Thủ Đức, Tp.HCM.
                    </Box>
                    <Box>
                        <strong>Tổng đài : </strong> 1800 1991
                    </Box>
                    <Box>
                        <strong>Hotline : </strong> 0908.111.222
                    </Box>
                    <Box>
                        <strong>Email : </strong> support.phobien@gmail.com
                    </Box>
                </Box>
            </Inner>
            <Box
                sx={{
                    background: '#64b9e5',
                    color: '#fff',
                    padding: '10px',
                }}
            >
                <Inner sx={{ display: 'flex', flexDirection: { 0: 'column', 768: 'row' } }}>
                    <Box sx={{ flex: 1 }}>
                        <small>© 2023 Nhà hàng Phố Biển.</small>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flex: 2,
                            justifyContent: { 0: 'start', 768: 'flex-end' },
                            '& .app-btn': {
                                padding: ' 0 5px',
                                display: 'unset',
                                color: '#45c3d2',
                                '& span': {
                                    display: 'unset',
                                },
                            },
                        }}
                    >
                        <Button
                            style={{ margin: '10px 10px 10px 0' }}
                            className="app-btn"
                            target="_blank"
                            href="https://facebook.com/vqduydz"
                        >
                            <img width="32" height="32" src={icon.facebook} alt="Facebook/" />
                        </Button>
                        <Button
                            style={{ margin: '10px 10px 10px 0' }}
                            className="app-btn"
                            target="_blank"
                            href="https://www.youtube.com/@vqduydz"
                        >
                            <img width="32" height="32" src={icon.youtube} alt="Youtube/" />
                        </Button>
                    </Box>
                </Inner>
            </Box>
        </Box>
    );
}

export default Footer;
