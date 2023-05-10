// import { Box } from '@mui/material';
// import { useState, useMemo } from 'react';

// function Cart() {
//     const [cartItems, setCartItems] = useState([]); // danh sách các món ăn trong giỏ hàng
//     const [selectedFoods, setSelectedFoods] = useState([]); // danh sách các món ăn được chọn

//     // Lưu trạng thái checked của các món ăn vào selectedFoods
//     const handleSelectFood = (item, isChecked) => {
//         if (isChecked) {
//             setSelectedFoods([...selectedFoods, item]);
//         } else {
//             setSelectedFoods(selectedFoods.filter((f) => f.menu_id !== item.menu_id));
//         }
//     };

//     // Lưu trạng thái checked của tất cả các món ăn vào selectedFoods
//     const handleSelectAll = (isChecked) => {
//         if (isChecked) {
//             setSelectedFoods([...cartItems]);
//         } else {
//             setSelectedFoods([]);
//         }
//     };

//     // Giữ lại giá trị của selectedFoods khi component được render lại
//     const selectedFoodsMemo = useMemo(() => selectedFoods, [selectedFoods]);

//     return (
//         <>
//             <input
//                 type="checkbox"
//                 checked={selectedFoodsMemo.length === cartItems.length}
//                 onChange={(e) => handleSelectAll(e.target.checked)}
//             />
//             {cartItems.map((item) => (
//                 <Box key={item.id}>
//                     <input
//                         type="checkbox"
//                         checked={selectedFoodsMemo.includes(item)}
//                         onChange={(e) => handleSelectFood(item, e.target.checked)}
//                     />
//                     ...
//                 </Box>
//             ))}
//         </>
//     );
// }
