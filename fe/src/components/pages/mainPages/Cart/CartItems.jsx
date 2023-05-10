import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import Quantity from './Quantity';

const CartItems = ({ food, foods, selectAll, setSelectAll, selectedFoods, setSelectedFoods }) => {
    return (
        <Box
            key={food.id}
            sx={{
                borderRadius: '6px',
                padding: '15px 10px',
                backgroundColor: '#00000005',
                border: '1px solid #0000000a',
                display: 'flex',
                textAlign: 'center',
                gap: '10px',
            }}
        >
            <input
                type="checkbox"
                checked={selectedFoods.includes(food)}
                onChange={(e) => {
                    if (e.target.checked) {
                        setSelectedFoods([...selectedFoods, food]);
                    } else {
                        setSelectedFoods(selectedFoods.filter((f) => f.id !== food.id));
                    }
                    setSelectAll(selectedFoods.length + 1 === foods.length);
                }}
            />
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'row',
                    fontSize: '1.4rem',
                    gap: '10px',
                }}
            >
                <img
                    style={{ border: '1px solid #00000009' }}
                    className="verifyImg"
                    width="80"
                    height="60"
                    src="https://gatrongcooking.com/media/2021/12/hau-nuong-mo-hanh/hau-nuong-mo-hanh-16x9.jpg"
                    alt=""
                />
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: { 0: 'column', 768: 'row' },
                        fontSize: '1.4rem',
                        gap: '10px',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography textAlign={'left'} fontSize={'1.6rem'} fontWeight={500}>
                        {food.name}
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            fontSize: '1.4rem',
                            gap: '10px',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography mt={2} fontSize={'1.6rem'} fontWeight={500} color={'#f57224'}>
                            490.000đ
                        </Typography>

                        <Quantity />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default CartItems;
