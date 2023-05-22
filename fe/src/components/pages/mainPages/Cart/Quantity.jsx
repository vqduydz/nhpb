import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { Button } from '_/components/common';
import { useAuth } from '_/context/AuthContext';
import { useThemMui } from '_/context/ThemeMuiContext';
import { getCartItem, updateCartItem } from '_/redux/slices';
import { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const Quantity = ({ sl, id, menu_id, checked, selectedFoods, setSelectedFoods }) => {
    const [quantity, setQuantity] = useState(sl);
    const dispatch = useDispatch();
    const { setLoading } = useThemMui();
    const { handleGetCartItem, currentUser } = useAuth();
    const sltd = 5;

    const handleChangeQuantity = (quantity) => {
        setLoading(true);
        const updateData = { id, quantity };
        dispatch(updateCartItem(updateData))
            .then(unwrapResult)
            .then(() => {
                handleGetCartItem(currentUser.id);
                dispatch(getCartItem(currentUser.id))
                    .then(unwrapResult)
                    .then((res) => {
                        const cartItems = res.map((item) => {
                            const { menu, id, user_id, menu_id, quantity } = item;
                            const { id: i, ...it } = menu;
                            const cartItem = { id, user_id, menu_id, quantity, ...it };
                            return cartItem;
                        });
                        if (checked) {
                            const oldSelectedFoods = selectedFoods.filter((f) => f.menu_id !== menu_id);
                            const updateCartItem = cartItems.filter((f) => f.menu_id === menu_id);
                            setSelectedFoods([...oldSelectedFoods, ...updateCartItem]);
                        }
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.log(error);
                        setLoading(false);
                    });
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    };

    useEffect(() => {}, []);

    return (
        <Box
            sx={{
                width: '100px',
                display: 'flex',
                justifyContent: 'center',
                height: '25px',
                gap: '1px',
                mt: '2px',
                mb: '5px',
                '& .so-luong': {
                    border: '1px solid #555',
                },
            }}
        >
            <Button
                disable={quantity <= 1}
                onClick={() => {
                    let res = quantity - 1;
                    if (res <= 1) res = 1;
                    setQuantity(res);
                    handleChangeQuantity(res);
                }}
                className="so-luong"
                style={{
                    border: 'none',
                    backgroundColor: '#0000001a',
                    color: '#0000008b',
                    padding: 0,
                }}
            >
                <RemoveIcon />
            </Button>
            <input
                className="so-luong"
                style={{
                    width: '30px',
                    textAlign: 'center',
                    fontSize: '1.4rem',
                    border: 'none',
                    userSelect: 'none',
                    cursor: 'default',
                }}
                step="1"
                min={1}
                max={sltd}
                value={quantity}
                autoComplete="off"
                height="100%"
                readOnly
            />
            <Button
                disable={quantity >= sltd}
                onClick={() => {
                    let res = quantity + 1;
                    if (res >= sltd) res = sltd;
                    setQuantity(res);
                    handleChangeQuantity(res);
                }}
                className="so-luong"
                style={{
                    border: 'none',
                    backgroundColor: '#0000001a',
                    color: '#0000008b',
                    padding: 0,
                }}
            >
                <AddIcon />
            </Button>
        </Box>
    );
};

export default memo(Quantity);
