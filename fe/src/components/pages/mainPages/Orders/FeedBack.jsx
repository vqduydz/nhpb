import { Box, Rating, Typography } from '@mui/material';
import { MyButton } from '_/components/common';
import { useAuth } from '_/context/AuthContext';
import { useThemMui } from '_/context/ThemeMuiContext';
import { routes } from '_/routes';
import { createNewFeedbackApi } from '_/services/api/feedbackApi';
import { useState } from 'react';

const Feedback = ({ feedback, setfeedback, order_code }) => {
  const { currentUser } = useAuth();
  const { setLoading } = useThemMui();
  const { orderItem } = feedback;
  const { catalog, catalog_slug, menu_id, cartItemId, name, image, slug } = orderItem;
  const [value, setValue] = useState(5);

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const feedbackData = {
      point: data.get('point'),
      feedback_content: data.get('content'),
      feedback_code: `${order_code}${cartItemId}`,
      menu_id,
      user_id: currentUser.id,
    };
    createNewFeedbackApi(feedbackData)
      .then(() => {
        setfeedback({ open: false });
        setLoading(false);
      })
      .catch(() => {
        setfeedback({ open: false });
        setLoading(false);
      });
  };

  const labels = {
    1: 'Tệ',
    2: 'Không hài lòng',
    3: 'Bình thường',
    4: 'Hài lòng',
    5: 'Tuyệt vời',
  };
  return (
    <Box>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#555',
        }}
        onClick={() => setfeedback({ open: false })}
      />
      <Box
        sx={{
          position: 'fixed',
          top: '40%',
          left: '50%',
          width: 'fit-content',
          transform: 'translate(-50%,-40%)',
          minWidth: 768,
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '6px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <Typography fontSize={'1.8rem'} fontWeight={700}>
          Đánh giá sản phẩm
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              borderRadius: '6px',
              padding: '10px',
              backgroundColor: '#00000005',
              border: '1px solid #0000000a',
              display: 'flex',
              textAlign: 'center',
              gap: '10px',
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                fontSize: '1.4rem',
                gap: '10px',
              }}
            >
              <img
                style={{ border: '1px solid #00000009' }}
                className="verifyImg"
                width="80"
                height="60"
                src={`${image}`}
                alt=""
              />
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  fontSize: '1.4rem',
                  gap: '10px',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    '& p': {
                      fontWeight: 700,
                      '& i': {
                        color: '#fe2c55',
                        fontWeight: 500,
                        fontSize: '1.3rem',
                      },
                    },
                  }}
                >
                  <Typography textAlign={'left'}>
                    <MyButton to={`${routes.detail}/${slug}`} text target="_blank">
                      {name}
                    </MyButton>
                  </Typography>
                  <Typography textAlign={'left'}>
                    <MyButton to={`${routes.menu}#${catalog_slug}`} text target="_blank">
                      <i>{catalog}</i>
                    </MyButton>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'end',
                    alignItems: 'center',
                  }}
                >
                  <Typography color={'#fe2c55'}>Chất lượng</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                    <Rating
                      name="point"
                      value={value}
                      precision={1}
                      onChange={(event) => {
                        setValue(parseFloat(event.target.value));
                      }}
                    />
                  </Box>
                  {value !== null && (
                    <Typography
                      sx={{
                        ml: '5px',
                        width: '130px',
                        textAlign: 'left',
                        color: 'orange',
                      }}
                    >
                      {labels[value]}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
          <textarea
            name="content"
            placeholder="Đánh giá ...."
            autoFocus
            style={{ width: '100%', height: '100px', maxHeight: '100px', padding: '10px' }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'end', gap: '10px' }}>
            <MyButton
              color={{ mainColor: '#fff', bgColor: '#fe2c55' }}
              onClick={() => setfeedback({ open: false })}
              type="button"
            >
              Bỏ qua
            </MyButton>
            <MyButton color={{ mainColor: '#fff', bgColor: 'orange' }} type="submit">
              Đánh giá
            </MyButton>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Feedback;
