import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '_/components/common';
import { renderPrice } from '_/utills';

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
                border: '1px solid transparent',
                '& span': {
                    display: 'flex',
                    flexDirection: 'column',
                },
                '&:hover': {
                    border: '1px solid #00000012',
                    '.h3': {
                        color: 'var( --mau-bc-16)',
                    },
                    '.image': {
                        transform: 'scale(1.04)',
                    },
                },
            }}
        >
            <Button
                to={monChinh ? `/thuc-don#${slug}` : `/mon-an/${slug}`}
                style={{
                    padding: 0,
                    width: '100%',
                }}
            >
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
                <Box sx={{ padding: '0 10px' }}>
                    <Typography
                        sx={{
                            fontWeight: 700,
                            padding: '15px 0px 5px',
                            color: 'var(--mau-sam)',
                        }}
                        className="h3"
                    >
                        {name}
                    </Typography>
                    <Typography
                        sx={{
                            mb: '10px',
                            fontSize: '1.5rem',
                            fontWeight: 500,
                            color: '#fe2c55',
                        }}
                    >
                        {price ? renderPrice() : price}
                    </Typography>
                </Box>
            </Button>
        </Box>
    );
}

export default Content;
