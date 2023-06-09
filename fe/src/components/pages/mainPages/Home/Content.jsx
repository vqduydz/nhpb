import { Box, Typography } from '@mui/material';
import { MyButton } from '_/components/common';
import { renderPrice } from '_/utills';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';

function Content({ data, monChinh = false }) {
  const { item, imagePath } = data;
  const { image_url, name, slug, price } = item;

  useEffect(() => {
    if (window.location.hash === '#id1') {
      const element = ReactDOM.findDOMNode(document.getElementById('id1'));
      if (element) {
        element.scrollIntoView();
      }
    } else if (window.location.hash === '#id2') {
      const element = ReactDOM.findDOMNode(document.getElementById('id2'));
      if (element) {
        element.scrollIntoView();
      }
    }
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        textAlign: 'left',
        borderRadius: '6px',
        border: '1px solid  rgba(0,0,0,0.1)',
        '&:hover': {
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)',
          '.h3': {
            color: 'var( --mau-bc-16)',
          },
          '.image': {
            transform: 'scale(1.04)',
          },
        },
      }}
    >
      <MyButton
        text
        to={monChinh ? `/thuc-don#${slug}` : `/mon-an/${slug}`}
        style={{
          padding: 0,
          width: '100%',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Box sx={{ width: '100%', overflow: 'hidden', borderRadius: '6px' }}>
            <Box
              className="image"
              sx={{
                backgroundImage: `url(${imagePath}${image_url})`,
                paddingTop: '56.25%',
                position: 'relative',
                width: '100%',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundColor: '#eee',
                transition: 'transform 0.3s',
              }}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              padding: '10px 10px 15px',
              flexDirection: 'column',
              gap: '5px',
              textAlign: 'left',
              '& p': { fontWeight: 700 },
            }}
          >
            <Typography sx={{ color: 'var(--mau-sam)' }} className="h3">
              {name}
            </Typography>
            <Typography sx={{ fontSize: '1.5rem', color: '#fe2c55' }}>{price ? renderPrice() : price}</Typography>
          </Box>
        </Box>
      </MyButton>
    </Box>
  );
}

export default Content;
