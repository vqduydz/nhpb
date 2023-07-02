import AddShoppingCartSharpIcon from '@mui/icons-material/AddShoppingCartSharp';
import { Box, Rating, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { MyButton } from '_/components/common';
import { getMenu } from '_/redux/slices';
import * as feedbackAPI from '_/services/api/feedbackApi';
import { renderPrice } from '_/utills';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const Preview = ({ slug, setPreview }) => {
  const dispatch = useDispatch();
  const [menu, setMenu] = useState({});
  const { name, catalog, price, unit, imagePath, image_url } = menu;
  const [rateValue, setRateValue] = useState({ soluot: 0, trunbinh: 0 });

  useEffect(() => {
    dispatch(getMenu({ slug }))
      .then(unwrapResult)
      .then((res) => {
        feedbackAPI
          .getFeedbackApi({ menu_id: res.id })
          .then((res) => {
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
      })
      .catch((error) => {
        console.log(error);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const { soluot, trunbinh } = rateValue;
  return (
    <Box
      sx={{
        borderRadius: '10px',
        maxWidth: '768px',
        width: '100%',
        minWidth: '762px',
        margin: '0 auto',
        backgroundColor: '#fff',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        display: 'grid',
        padding: '10px',
        gap: '10px',
      }}
    >
      <MyButton
        style={{
          position: 'absolute',
          top: '-20px',
          right: '20px',
        }}
        color={{ bgColor: '#fe2c55', mainColor: '#fff' }}
        onClick={() => setPreview({ slug: '', open: false })}
      >
        Close
      </MyButton>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '10px',
        }}
      >
        <Box
          sx={{
            flex: 1,
            maxWidth: '500px',
            border: '1px solid #f1f1f1',
            borderRadius: '6px',
            padding: '1px',
          }}
        >
          <Box
            sx={{
              backgroundImage: `url(${imagePath}${image_url})`,
              width: '100%',
              paddingTop: '62.65%',
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
              display: 'flex',
              gap: '10px',
              flexDirection: 'column',
              '& .add-to-cart': {
                opacity: 0.85,
                '&:hover': {
                  opacity: 1,
                },
              },
            }}
          >
            <Typography fontSize={'2.5rem'} fontWeight={700}>
              {name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Box sx={{ display: 'flex' }}>
                <Rating name="read-only" value={trunbinh} readOnly precision={0.1} />
              </Box>
              <Box> {trunbinh}</Box> - <Box> {soluot} đánh giá</Box>
            </Box>

            <Typography display={'inline-flex'} fontSize={'1.6rem'} fontWeight={500}>
              Catalog :<i style={{ color: '#fe2c55' }}>&nbsp;{catalog}</i>
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
    </Box>
  );
};

export default Preview;
