// import DeleteIcon from '@mui/icons-material/Delete';
// import {
//     Alert,
//     Box,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogContentText,
//     DialogTitle,
//     Slide,
//     Snackbar,
//     Typography,
// } from '@mui/material';
// import { Button, MyButton } from '_/components/common';
// import { Inner } from '_/components/common/CustomComponents/CustomMui';
// import { forwardRef, useEffect, useMemo, useState } from 'react';
// import Quantity from './Quantity';
// import { useDispatch } from 'react-redux';
// import { deleteCartItem } from '_/redux/slices';
// import { unwrapResult } from '@reduxjs/toolkit';
// import { useAuth } from '_/context/AuthContext';

// const Cart = () => {
//     const { cartItems, handleGetCartItem, setSnackbar } = useAuth();
//     const dispatch = useDispatch();
//     const [selectedFoods, setSelectedFoods] = useState([]);
//     const [total, setTotal] = useState(0);
//     // const [cartItems, setCartItems] = useState([]);
//     const [cartItemDelete, setCartItemDelete] = useState({
//         openDelete: false,
//         idCartItemDelete: '',
//         nameCartItemDelete: '',
//     });
//     const { openDelete, idCartItemDelete, nameCartItemDelete } = cartItemDelete;

//     const selectedFoodsMemo = useMemo(() => selectedFoods, [selectedFoods]);

//     const filtereselectedFoods = selectedFoodsMemo.reduce((accumulator, current) => {
//         // Tìm index của đối tượng hiện tại trong accumulator
//         const index = accumulator.findIndex((item) => item.menu_id === current.menu_id);

//         if (index === -1) {
//             // Nếu không tìm thấy đối tượng trong accumulator, thêm nó vào
//             accumulator.push(current);
//         } else {
//             // Nếu tìm thấy đối tượng trong accumulator, so sánh giá trị của menu_id để giữ lại giá trị mới nhất
//             if (accumulator[index].menu_id < current.menu_id) {
//                 accumulator[index] = current;
//             }
//         }

//         return accumulator;
//     }, []);

//     useEffect(() => {
//         const total = filtereselectedFoods.reduce((accumulator, currentValue) => {
//             return accumulator + currentValue.Menu?.price * currentValue.quantity;
//         }, 0);
//         setTotal(total);
//     }, [cartItems, filtereselectedFoods]);

//     const delCartItem = (id, name) => {
//         setCartItemDelete({ openDelete: true, idCartItemDelete: id, nameCartItemDelete: name });
//     };

//     const handleDeleteCartItem = (id) => {
//         dispatch(deleteCartItem(id))
//             .then(unwrapResult)
//             .then(() => {
//                 handleGetCartItem();
//                 setSelectedFoods(selectedFoods.filter((f) => f.id !== id));
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     };

//     const handleOrder = () => {
//         console.log('handleOrder');
//     };

//     const renderPrice = (price) => {
//         if (isNaN(price)) return;
//         const options = { style: 'currency', currency: 'VND' };
//         return `${price.toLocaleString('vi-VN', options)}`;
//     };

//     // handle select
//     const Transition = forwardRef(function Transition(props, ref) {
//         return <Slide direction="down" ref={ref} {...props} />;
//     });

//     return (
//         <Box
//             sx={{
//                 mt: '20px',
//                 mb: '20px',
//                 minHeight: '100px',
//             }}
//         >
//             {openDelete && (
//                 <Dialog
//                     TransitionComponent={Transition}
//                     open={openDelete}
//                     onClose={() => {
//                         setCartItemDelete({ openDelete: false, nameCartItemDelete: nameCartItemDelete });
//                     }}
//                     aria-labelledby="alert-dialog-title"
//                     aria-describedby="alert-dialog-description"
//                 >
//                     <Box sx={{ padding: '5px' }}>
//                         <DialogContent sx={{ padding: '8px' }}>
//                             <DialogContentText
//                                 sx={{ color: 'inherit', fontSize: '1.8rem', paddingBottom: '5px' }}
//                                 id="alert-dialog-description"
//                             >
//                                 Xác nhận xóa <strong>{nameCartItemDelete}</strong> khỏi giỏ hàng ?
//                             </DialogContentText>
//                         </DialogContent>
//                         <DialogActions
//                             sx={{
//                                 color: 'inherit',
//                                 display: 'flex',
//                                 justifyContent: 'center',
//                                 gap: '10px',
//                                 '& .action': {
//                                     padding: '5px 15px',
//                                 },
//                             }}
//                         >
//                             <MyButton
//                                 color={{ bgColor: 'red', mainColor: '', subColor: '' }}
//                                 className="action"
//                                 onClick={() => {
//                                     handleDeleteCartItem(idCartItemDelete);
//                                     setCartItemDelete({
//                                         openDelete: false,
//                                         nameCartItemDelete: nameCartItemDelete,
//                                     });
//                                 }}
//                             >
//                                 Xác nhận
//                             </MyButton>
//                             <MyButton
//                                 color={{
//                                     bgColor: 'rgb(2, 136, 209)',
//                                     mainColor: '',
//                                     subColor: '',
//                                 }}
//                                 className="action"
//                                 onClick={() => {
//                                     setCartItemDelete({
//                                         openDelete: false,
//                                         nameCartItemDelete: nameCartItemDelete,
//                                     });
//                                 }}
//                             >
//                                 Hủy
//                             </MyButton>

//                             {/* <Button
//                                 onClick={() => {
//                                     setCartItemDelete({ openDelete: false, nameCartItemDelete: nameCartItemDelete });
//                                 }}
//                                 outline
//                             >
//                                 Disagree
//                             </Button>
//                             <Button
//                                 onClick={() => {
//                                     handleDeleteCartItem(idCartItemDelete);
//                                     setCartItemDelete({ openDelete: false, nameCartItemDelete: nameCartItemDelete });
//                                 }}
//                                 outline
//                             >
//                                 Agree
//                             </Button> */}
//                         </DialogActions>
//                     </Box>
//                 </Dialog>
//             )}
//             <Inner
//                 sx={{
//                     paddingLeft: 0,
//                     paddingRight: 0,
//                 }}
//             >
//                 {cartItems.length > 0 ? (
//                     <Box>
//                         <Box
//                             sx={{
//                                 borderRadius: '6px',
//                                 padding: '15px 10px',
//                                 backgroundColor: '#00000005',
//                                 border: '1px solid #0000000a',
//                                 display: 'flex',
//                                 flexDirection: 'row',
//                                 textAlign: 'center',
//                                 justifyContent: 'space-between',
//                                 gap: '10px',
//                             }}
//                         >
//                             <Box sx={{ gap: '10px', display: 'flex', flexDirection: 'row' }}>
//                                 <label>
//                                     <input
//                                         type="checkbox"
//                                         checked={filtereselectedFoods.length === cartItems.length}
//                                         onChange={(e) => {
//                                             if (e.target.checked) {
//                                                 setSelectedFoods(cartItems);
//                                             } else {
//                                                 setSelectedFoods([]);
//                                             }
//                                         }}
//                                     />
//                                 </label>
//                                 <Typography fontWeight={700}>Sản phẩm</Typography>
//                             </Box>
//                             <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
//                                 <Typography sx={{ display: 'block', width: '100px', fontWeight: 700 }}>
//                                     Đơn giá
//                                 </Typography>

//                                 <Typography sx={{ display: 'block', width: '140px', fontWeight: 700 }}>
//                                     Thao tác
//                                 </Typography>
//                             </Box>
//                         </Box>
//                         <Box sx={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
//                             {cartItems.map((item) => (
//                                 <Box
//                                     key={item.id}
//                                     sx={{
//                                         borderRadius: '6px',
//                                         padding: '15px 10px',
//                                         backgroundColor: '#00000005',
//                                         border: '1px solid #0000000a',
//                                         display: 'flex',
//                                         textAlign: 'center',
//                                         gap: '10px',
//                                     }}
//                                 >
//                                     <input
//                                         type="checkbox"
//                                         checked={filtereselectedFoods.some((food) => food.menu_id === item.menu_id)}
//                                         onChange={(e) => {
//                                             if (e.target.checked) {
//                                                 setSelectedFoods([...selectedFoods, item]);
//                                             } else {
//                                                 setSelectedFoods(
//                                                     selectedFoods.filter((f) => f.menu_id !== item.menu_id),
//                                                 );
//                                             }
//                                         }}
//                                     />
//                                     <Box
//                                         sx={{
//                                             flex: 1,
//                                             display: 'flex',
//                                             flexDirection: 'row',
//                                             fontSize: '1.4rem',
//                                             gap: '10px',
//                                         }}
//                                     >
//                                         <img
//                                             style={{ border: '1px solid #00000009' }}
//                                             className="verifyImg"
//                                             width="80"
//                                             height="60"
//                                             src={item.Menu?.image}
//                                             alt=""
//                                         />
//                                         <Box
//                                             sx={{
//                                                 flex: 1,
//                                                 display: 'flex',
//                                                 fontSize: '1.4rem',
//                                                 gap: '10px',
//                                                 justifyContent: 'space-between',
//                                                 alignItems: 'center',
//                                             }}
//                                         >
//                                             <Button to={`/mon-an/${item.Menu?.slug}`} target="_blank">
//                                                 <Typography
//                                                     color={'#337ab7'}
//                                                     textAlign={'left'}
//                                                     fontSize={'1.6rem'}
//                                                     fontWeight={500}
//                                                 >
//                                                     {item.Menu?.name}
//                                                 </Typography>
//                                             </Button>
//                                             <Box
//                                                 sx={{
//                                                     display: 'flex',
//                                                     flexDirection: 'row',
//                                                     fontSize: '1.4rem',
//                                                     gap: '10px',
//                                                     justifyContent: 'end',
//                                                     alignItems: 'center',
//                                                 }}
//                                             >
//                                                 <Typography
//                                                     sx={{ display: 'block', width: '100px' }}
//                                                     mt={2}
//                                                     fontSize={'1.6rem'}
//                                                     fontWeight={500}
//                                                     color={'#fe2c55'}
//                                                 >
//                                                     {renderPrice(item.Menu?.price)}
//                                                 </Typography>

//                                                 <Quantity
//                                                     checked={filtereselectedFoods.some(
//                                                         (food) => food.menu_id === item.menu_id,
//                                                     )}
//                                                     selectedFoods={selectedFoods}
//                                                     setSelectedFoods={setSelectedFoods}
//                                                     sl={item.quantity}
//                                                     id={item.id}
//                                                     menu_id={item.menu_id}
//                                                 />

//                                                 <Box
//                                                     sx={{
//                                                         width: '30px',
//                                                         '& .delete-btn': {
//                                                             margin: '0 auto',
//                                                             '& span': { textAlign: 'center' },
//                                                         },
//                                                     }}
//                                                 >
//                                                     <Button
//                                                         onClick={() => {
//                                                             delCartItem(item.id, item.Menu?.name);
//                                                         }}
//                                                         className="delete-btn"
//                                                         style={{ padding: 0 }}
//                                                     >
//                                                         <DeleteIcon />
//                                                     </Button>
//                                                 </Box>
//                                             </Box>
//                                         </Box>
//                                     </Box>
//                                 </Box>
//                             ))}

//                             <Box
//                                 sx={{
//                                     display: 'flex',
//                                     flexDirection: 'row',
//                                     fontSize: '1.8rem',
//                                     gap: '30px',
//                                     justifyContent: 'end',
//                                     alignItems: 'center',
//                                     padding: '0 20px',
//                                     color: '#fe2c55',
//                                 }}
//                             >
//                                 <Typography fontWeight={700} fontSize={'1.6rem'}>
//                                     Tạm tính
//                                 </Typography>
//                                 <Typography fontWeight={700} fontSize={'1.6rem'}>
//                                     {renderPrice(total)}
//                                 </Typography>
//                                 <MyButton
//                                     onClick={handleOrder}
//                                     color={{ mainColor: '#fff', bgColor: '#fe2c55' }}
//                                     fontWeight={700}
//                                     padding={'4px 12px'}
//                                     fontSize={1.5}
//                                 >
//                                     Đặt hàng
//                                 </MyButton>
//                             </Box>
//                         </Box>
//                     </Box>
//                 ) : (
//                     <Box>KO CO GI</Box>
//                 )}
//             </Inner>
//         </Box>
//     );
// };

// export default Cart;
