import AddShoppingCartSharpIcon from '@mui/icons-material/AddShoppingCartSharp';
import { Box, Rating, Typography } from '@mui/material';
import { MyButton } from '_/components/common';
import { Inner } from '_/components/common/CustomComponents/CustomMui';
import { routes } from '_/routes';
import { renderPrice } from '_/utills';
// import { useHistory, useLocation } from "react-router-dom";

const Detail = ({ menu }) => {
    const { name, catalog, price, unit, image_url, catalogSlug, detail } = menu;

    return (
        <>
            <Box sx={{ borderBottom: '3px solid #efeef5' }}>
                <Inner
                    sx={{
                        display: 'grid',
                        paddingTop: '20px',
                        paddingBottom: '30px',
                        paddingRight: { 0: 0, 640: '1.5rem' },
                        paddingLeft: { 0: 0, 640: '1.5rem' },
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexDirection: { 0: 'column', 768: 'row' },
                            gap: '10px',
                        }}
                    >
                        <Box
                            sx={{
                                flex: 1,
                                maxWidth: '500px',
                                border: '1px solid #f1f1f1',
                                borderRadius: '6px',
                                padding: '5px',
                            }}
                        >
                            <Box
                                sx={{
                                    backgroundImage: `url(http://localhost:8080/v1/api/images/${image_url})`,
                                    width: '100%',
                                    paddingTop: { 0: '56.25%', 768: '66.25%', 1200: '56.25%' },
                                    position: 'relative',
                                    backgroundPosition: 'center center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: 'cover',
                                    borderRadius: '6px',
                                    backgroundColor: '#eee',
                                }}
                            />
                        </Box>
                        <Box
                            sx={{
                                flex: 1,
                                padding: '5px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                flexDirection: 'column',
                                '& .add-to-cart': {
                                    opacity: 0.85,
                                    '&:hover': {
                                        opacity: 1,
                                    },
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    flex: 1,
                                    padding: '5px',
                                    display: 'flex',
                                    gap: { 0: '10px', 992: '20px' },
                                    flexDirection: 'column',
                                    '& .add-to-cart': {
                                        opacity: 0.85,
                                        '&:hover': {
                                            opacity: 1,
                                        },
                                    },
                                }}
                            >
                                <Typography
                                    fontSize={{ 0: '2rem', 560: '3rem', 768: '2.5rem', 992: '3rem' }}
                                    fontWeight={700}
                                >
                                    {name}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Box sx={{ display: 'flex' }}>
                                        <Rating name="read-only" value={5} readOnly precision={0.1} />
                                    </Box>
                                    <Box> {5}</Box> - <Box> soluot đánh giá</Box>
                                </Box>

                                <Typography display={'inline-flex'} fontSize={'1.6rem'} fontWeight={500}>
                                    Catalog :
                                    <MyButton to={`${routes.menu}#${catalogSlug}`} fontSize={'1.6rem'} text>
                                        &nbsp;{catalog}
                                    </MyButton>
                                </Typography>

                                <Typography color={'#fe2c55'} fontSize={'1.6rem'} fontWeight={500}>
                                    Giá : {renderPrice(price)} / 1 {unit}
                                </Typography>
                            </Box>

                            <MyButton
                                disable
                                style={{ maxWidth: '300px' }}
                                className="add-to-cart"
                                color={{ bgColor: 'orange' }}
                                fontSize={'1.6rem'}
                            >
                                <AddShoppingCartSharpIcon sx={{ mr: '5px' }} /> Thêm vào giỏ hàng
                            </MyButton>
                        </Box>
                    </Box>
                </Inner>
            </Box>
            <Box sx={{ backgroundColor: '#f5f5f5', borderBottom: '3px solid #efeef5' }}>
                <Inner
                    sx={{
                        display: 'grid',
                        paddingTop: '20px',
                        paddingBottom: '30px',
                        paddingRight: { 0: 0, 640: '1.5rem' },
                        paddingLeft: { 0: 0, 640: '1.5rem' },
                        gap: '10px',
                    }}
                >
                    <Typography fontSize="1.8rem" fontWeight={700}>
                        Mô tả về "{name}"
                    </Typography>

                    <Typography dangerouslySetInnerHTML={{ __html: detail }} />
                </Inner>
            </Box>
        </>
    );
};

export default Detail;
