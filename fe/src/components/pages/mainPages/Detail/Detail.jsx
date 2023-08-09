import AddShoppingCartSharpIcon from '@mui/icons-material/AddShoppingCartSharp';
import { Box, Rating, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { MyButton, renderContent } from '_/components/common';
import { Inner } from '_/components/common/CustomComponents/CustomMui';
import { useAuth } from '_/context/AuthContext';
import { getCatalog, getMenu } from '_/redux/slices';
import { routes } from '_/routes';
import * as feedbackAPI from '_/services/api/feedbackApi';
import { dateTimeFormate, renderPrice } from '_/utills';

const Detail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { slug: _slug } = useParams();
  const [menu, setMenu] = useState({});
  const { addToCart, currentUser } = useAuth();
  const { id, name, catalog, price, unit, catalogSlug, imagePath, image_url } = menu;
  const [suggest, setSuggest] = useState({ items: [], imagePath: '' });
  const [feedbacks, setFeedbacks] = useState([]);
  const [rateValue, setRateValue] = useState({ soluot: 0, trunbinh: 0 });

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getMenu({ slug: _slug }))
      .then(unwrapResult)
      .then((res) => {
        feedbackAPI
          .getFeedbackApi({ menu_id: res.id })
          .then((res) => {
            setFeedbacks(res);
            setRateValue({
              soluot: parseFloat(res.length),
              trunbinh: parseFloat(
                (res.reduce((accumulator, currentValue) => accumulator + currentValue.point, 0) / res.length).toFixed(
                  1,
                ),
              ),
            });
          })
          .catch((error) => {
            console.log(error);
          });
        setMenu(res);
        dispatch(getCatalog())
          .then(unwrapResult)
          .then((data) => {
            const { catalogsWithMenus, imagePath } = data;
            let suggest;
            catalogsWithMenus.forEach((item) => {
              if (item.slug === res.catalogSlug) {
                suggest = item.menus.filter((item) => item.name !== res.name);
              }
            });
            setSuggest({ items: suggest, imagePath });
          })
          .catch((error) => {});
      })
      .catch((error) => {});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_slug]);

  const handleAddToCart = () => {
    if (currentUser) {
      const cartItem = { customer_id: currentUser.id, menu_id: id, quantity: 1 };
      addToCart(cartItem);
      return;
    } else {
      navigate(routes.login);
    }
  };
  const { soluot, trunbinh } = rateValue;
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
                  backgroundImage: `url(${imagePath}${image_url})`,
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
                <Typography fontSize={{ 0: '2rem', 560: '3rem', 768: '2.5rem', 992: '3rem' }} fontWeight={700}>
                  {name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Box sx={{ display: 'flex' }}>
                    <Rating name="read-only" value={trunbinh} readOnly precision={0.1} />
                  </Box>
                  <Box> {trunbinh}</Box> - <Box> {soluot} đánh giá</Box>
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
              {currentUser && currentUser.role !== 'Customer' ? (
                <MyButton
                  disable
                  style={{ maxWidth: '300px' }}
                  className="add-to-cart"
                  color={{ bgColor: 'orange' }}
                  fontSize={'1.6rem'}
                >
                  <AddShoppingCartSharpIcon sx={{ mr: '5px' }} /> Thêm vào giỏ hàng
                </MyButton>
              ) : (
                <MyButton
                  onClick={handleAddToCart}
                  style={{ maxWidth: '300px' }}
                  className="add-to-cart"
                  color={{ bgColor: 'orange' }}
                  fontSize={'1.6rem'}
                >
                  <AddShoppingCartSharpIcon sx={{ mr: '5px' }} /> Thêm vào giỏ hàng
                </MyButton>
              )}
            </Box>
          </Box>
        </Inner>
      </Box>

      {currentUser && currentUser.role !== 'Customer' ? (
        <Box></Box>
      ) : (
        <>
          <Box sx={{ backgroundColor: '#f5f5f5', borderBottom: '3px solid #efeef5' }}>
            <Inner
              sx={{
                display: 'grid',
                paddingTop: '20px',
                paddingBottom: '30px',
                paddingRight: { 0: 0, 640: '1.5rem' },
                paddingLeft: { 0: 0, 640: '1.5rem' },
                gap: '20px',
              }}
            >
              <Typography fontSize="1.8rem" fontWeight={700}>
                Đánh giá và nhận xét về "{name}" của khách hàng
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  borderBottom: '2px solid #efeef5',
                  paddingBottom: '20px',
                }}
              >
                <Box sx={{ display: 'flex' }}>
                  <Rating name="read-only" value={trunbinh} readOnly precision={0.1} />
                </Box>
                <Box> {trunbinh}</Box> - <Box> {soluot} đánh giá</Box>
              </Box>
              <Box sx={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                {feedbacks.map((item) => {
                  return (
                    <Box
                      key={item.feedback_code}
                      sx={{
                        borderRadius: '6px',
                        padding: '10px 15px',
                        backgroundColor: '#fae0e069',
                        border: '1px solid #0000000a',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', gap: '10px' }}>
                          <Rating
                            sx={{ fontSize: '1.6rem' }}
                            name="read-only"
                            value={item.point}
                            readOnly
                            precision={0.1}
                          />
                          <img
                            className="verifyImg"
                            width="15"
                            height="16"
                            src="//lzd-img-global.slatic.net/g/tps/tfs/TB1bOqBeb_I8KJjy1XaXXbsxpXa-30-32.png"
                            alt=""
                          />
                          <Typography display={{ 0: 'none', 560: 'unset' }} fontSize={'1.4rem'} color={'green'}>
                            Chứng nhận đã mua hàng
                          </Typography>
                        </Box>
                        <Typography fontSize={'1.4rem'}>{dateTimeFormate(item.createdAt)}</Typography>
                      </Box>
                      <Typography display={'inline-flex'} fontSize={'1.6rem'} fontWeight={500}>
                        Bởi :&nbsp;{`${item.firstName} ${item.lastName}`}
                      </Typography>
                      {item.feedback_content && (
                        <Typography display={'inline-flex'} fontSize={'1.6rem'} fontWeight={500}>
                          Nhận xét :&nbsp;{item.feedback_content}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Inner>
          </Box>

          <Box
            sx={{
              paddingTop: '20px',
              paddingBottom: '30px',
              borderBottom: '3px solid #efeef5',
            }}
          >
            <Inner>
              <Typography
                sx={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  mb: '10px',
                  textTransform: 'uppercase',
                  color: 'grey',
                }}
              >
                Gợi ý cùng danh mục ({menu.catalog})
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat( auto-fill, minmax(300px, 1fr))',
                  gridAutoRows: 'auto',
                  gap: {
                    0: '4px',
                    720: '5px',
                    960: '10px',
                    1360: '15px',
                    1600: '20px',
                  },
                }}
              >
                {renderContent(suggest)}
              </Box>
            </Inner>
          </Box>
        </>
      )}
    </>
  );
};

export default Detail;
