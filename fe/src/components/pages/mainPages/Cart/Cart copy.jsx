// import DeleteIcon from '@mui/icons-material/Delete';
// import { Box, Typography } from '@mui/material';
// import { Button, MyButton } from '_/components/common';
// import { Inner } from '_/components/common/CustomComponents/CustomMui';
// import { useEffect, useMemo, useState } from 'react';
// import Quantity from './Quantity';
// import { useDispatch } from 'react-redux';
// import { getCartItem } from '_/redux/slices';
// import { unwrapResult } from '@reduxjs/toolkit';

// const Cart = () => {
//     // const { cartItems } = useAuth();
//     const dispatch = useDispatch();
//     const [cartItems, setCartItems] = useState([]);
//     const [selectedFoods, setSelectedFoods] = useState([]);

//     const [selectAll, setSelectAll] = useState(false);
//     const [total, setTotal] = useState(0);

//     const getCartItems = () => {
//         dispatch(getCartItem(1))
//             .then(unwrapResult)
//             .then((res) => setCartItems(res.cartItem))
//             .catch((error) => {
//                 console.log(error);
//             });
//     };

//     useEffect(() => {
//         getCartItems();
//     }, []);

//     useEffect(() => {
//         setSelectAll(selectedFoods.length === cartItems.length);
//         const total = selectedFoods.reduce((accumulator, currentValue) => {
//             return accumulator + currentValue.Menu.price * currentValue.quantity;
//         }, 0);
//         setTotal(total);
//     }, [cartItems, selectedFoods]);

//     const handleOrder = () => {
//         console.log('handleOrder');
//     };

//     const renderPrice = (price) => {
//         if (isNaN(price)) return;
//         const options = { style: 'currency', currency: 'VND' };
//         return `${price.toLocaleString('vi-VN', options)}`;
//     };

//     const selectedFoodsMemo = useMemo(() => selectedFoods, [selectedFoods]);

//     return (
//         <Box
//             sx={{
//                 mt: '20px',
//                 mb: '20px',
//             }}
//         >
//             <Inner
//                 sx={{
//                     paddingLeft: 0,
//                     paddingRight: 0,
//                 }}
//             >
//                 <Box
//                     sx={{
//                         borderRadius: '6px',
//                         padding: '15px 10px',
//                         backgroundColor: '#00000005',
//                         border: '1px solid #0000000a',
//                         display: 'flex',
//                         flexDirection: 'row',
//                         textAlign: 'center',
//                         justifyContent: 'space-between',
//                         gap: '10px',
//                     }}
//                 >
//                     <Box sx={{ gap: '10px', display: 'flex', flexDirection: 'row' }}>
//                         <label>
//                             <input
//                                 type="checkbox"
//                                 checked={selectedFoodsMemo.length === cartItems.length}
//                                 onChange={(e) => {
//                                     setSelectAll(e.target.checked);
//                                     if (e.target.checked) {
//                                         setSelectedFoods(cartItems);
//                                     } else {
//                                         setSelectedFoods([]);
//                                     }
//                                 }}
//                             />
//                         </label>
//                         <Typography fontWeight={700}>Sản phẩm</Typography>
//                     </Box>
//                     <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
//                         <Typography sx={{ display: 'block', width: '100px', fontWeight: 700 }}>Đơn giá</Typography>

//                         <Typography sx={{ display: 'block', width: '140px', fontWeight: 700 }}>Thao tác</Typography>
//                     </Box>
//                 </Box>
//                 <Box sx={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
//                     {cartItems.map((item) => (
//                         <Box
//                             key={item.id}
//                             sx={{
//                                 borderRadius: '6px',
//                                 padding: '15px 10px',
//                                 backgroundColor: '#00000005',
//                                 border: '1px solid #0000000a',
//                                 display: 'flex',
//                                 textAlign: 'center',
//                                 gap: '10px',
//                             }}
//                         >
//                             <input
//                                 type="checkbox"
//                                 checked={selectedFoodsMemo.includes(item)}
//                                 onChange={(e) => {
//                                     console.log(e.target.checked);
//                                     if (e.target.checked) {
//                                         setSelectedFoods([...selectedFoods, item]);
//                                     } else {
//                                         setSelectedFoods(selectedFoods.filter((f) => f.menu_id !== item.menu_id));
//                                     }
//                                 }}
//                             />
//                             <Box
//                                 sx={{
//                                     flex: 1,
//                                     display: 'flex',
//                                     flexDirection: 'row',
//                                     fontSize: '1.4rem',
//                                     gap: '10px',
//                                 }}
//                             >
//                                 <img
//                                     style={{ border: '1px solid #00000009' }}
//                                     className="verifyImg"
//                                     width="80"
//                                     height="60"
//                                     src={item.Menu?.image}
//                                     alt=""
//                                 />
//                                 <Box
//                                     sx={{
//                                         flex: 1,
//                                         display: 'flex',
//                                         fontSize: '1.4rem',
//                                         gap: '10px',
//                                         justifyContent: 'space-between',
//                                         alignItems: 'center',
//                                     }}
//                                 >
//                                     <Typography textAlign={'left'} fontSize={'1.6rem'} fontWeight={500}>
//                                         {item.Menu?.name}
//                                     </Typography>
//                                     <Box
//                                         sx={{
//                                             display: 'flex',
//                                             flexDirection: 'row',
//                                             fontSize: '1.4rem',
//                                             gap: '10px',
//                                             justifyContent: 'end',
//                                             alignItems: 'center',
//                                         }}
//                                     >
//                                         <Typography
//                                             sx={{ display: 'block', width: '100px' }}
//                                             mt={2}
//                                             fontSize={'1.6rem'}
//                                             fontWeight={500}
//                                             color={'#fe2c55'}
//                                         >
//                                             {renderPrice(item.Menu?.price)}
//                                         </Typography>

//                                         <Quantity sl={item.quantity} id={item.id} getCartItems={getCartItems} />

//                                         <Box
//                                             sx={{
//                                                 width: '30px',
//                                                 '& .delete-btn': {
//                                                     margin: '0 auto',
//                                                     '& span': { textAlign: 'center' },
//                                                 },
//                                             }}
//                                         >
//                                             <MyButton className="delete-btn" style={{ padding: 0 }}>
//                                                 <DeleteIcon />
//                                             </MyButton>
//                                         </Box>
//                                     </Box>
//                                 </Box>
//                             </Box>
//                         </Box>
//                     ))}

//                     <Box
//                         sx={{
//                             display: 'flex',
//                             flexDirection: 'row',
//                             fontSize: '1.8rem',
//                             gap: '30px',
//                             justifyContent: 'end',
//                             alignItems: 'center',
//                             padding: '0 20px',
//                             color: '#fe2c55',
//                         }}
//                     >
//                         <Typography fontWeight={700} fontSize={'1.6rem'}>
//                             Tạm tính
//                         </Typography>
//                         <Typography fontWeight={700} fontSize={'1.6rem'}>
//                             {renderPrice(total)}
//                         </Typography>
//                         <MyButton
//                             onClick={handleOrder}
//                             color={{ mainColor: '#fff', bgColor: '#fe2c55' }}
//                             fontWeight={700}
//                             padding={'4px 12px'}
//                             fontSize={1.5}
//                         >
//                             Đặt hàng
//                         </MyButton>
//                     </Box>
//                 </Box>
//             </Inner>
//         </Box>
//     );
// };

// export default Cart;
