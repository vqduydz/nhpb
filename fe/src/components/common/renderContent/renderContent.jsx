import { Box, Typography } from '@mui/material';
import React from 'react';
import { Button } from '..';

const renderContent = (content) => {
    const renderPrice = (price) => {
        if (!price) return;
        const options = { style: 'currency', currency: 'VND' };
        return `${price.toLocaleString('vi-VN', options)}`;
    };
    return content.map((item) => (
        <Box
            key={item.slug}
            sx={{
                width: '100%',
                textAlign: 'left',
                borderRadius: '6px',
                '& span': {
                    display: 'flex',
                    flexDirection: 'column',
                },
                '&:hover': {
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)',
                    '.h3': {
                        color: '#337ab7',
                    },
                    '.image': {
                        transform: 'scale(1.04)',
                    },
                },
            }}
        >
            <Button
                to={`/mon-an/${item.slug}`}
                style={{
                    padding: 0,
                    width: '100%',
                }}
            >
                <Box sx={{ width: '100%', overflow: 'hidden', borderRadius: '6px' }}>
                    <Box
                        className="image"
                        sx={{
                            backgroundImage: `url(${item.image})`,
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
                        {item.name}
                    </Typography>{' '}
                    <Typography
                        sx={{
                            mb: '10px',
                            fontSize: '1.5rem',
                            fontWeight: 500,
                            color: '#fe2c55',
                        }}
                    >
                        {item.price ? renderPrice(item.price) : item.price} / 1 {item.unit}
                    </Typography>
                </Box>
            </Button>
        </Box>
    ));
};

export default renderContent;
