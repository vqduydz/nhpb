import { Box } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import chiNhanh4 from '_/assets/images/Banner-khai-truong.png';
import { Button } from '_/components/common';
import { Inner } from '_/components/common/CustomComponents/CustomMui';
import { getCatalog } from '_/redux/slices';
import Content from './Content';
import MySlider from './MySlider';

function Home() {
  const dispatch = useDispatch();
  const [monMoi, setMonMoi] = useState([]);
  const [monDacBiet, setMonDacBiet] = useState([]);
  const [catalogs, setCatalogs] = useState([]);
  const [imagePath, setImagePath] = useState('');
  useEffect(() => {
    dispatch(getCatalog())
      .then(unwrapResult)
      .then((res) => {
        const { catalogsWithMenus, imagePath } = res;
        setCatalogs(catalogsWithMenus);
        if (catalogsWithMenus.length) {
          setMonMoi(() => {
            const data = catalogsWithMenus.find((catalog) => catalog.slug === 'cac-mon-moi').menus;
            return data;
          });
          setMonDacBiet(() => {
            const data = catalogsWithMenus.find((catalog) => catalog.slug === 'mon-dac-biet').menus;
            return data;
          });
        }
        setImagePath(imagePath);
      })
      .catch((error) => {
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return catalogs?.length ? (
    <Box>
      <Box
        sx={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1),rgba(255, 255, 255, 0.9),rgba(255, 255, 255, 1))',
        }}
      />

      {/* Món đặc biệt */}
      <MySlider
        headerSlider={{
          title: 'Món đặc biệt',
          extendTitle: [{ title: 'xem thêm', url: `/thuc-don#cac-mon-dac-biet` }],
        }}
        SlickSettings={{
          arrows: true,
          slidesToScroll: 2,
          autoplay: false,
          slidesToShow: 2,
          responsive: [
            {
              breakpoint: 680,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
              },
            },
          ],
        }}
        containerStyles={{ borderBottom: '3px solid #efeef5' }}
      >
        {monDacBiet.map((item) => {
          return <Content key={item.slug} data={{ item, imagePath }} />;
        })}
      </MySlider>

      {/* Món mới */}
      <MySlider
        headerSlider={{
          title: 'Các món mới',
          extendTitle: [{ title: 'xem thêm', url: `/thuc-don#cac-mon-moi` }],
        }}
        SlickSettings={{
          arrows: true,
          autoplay: true,
        }}
        containerStyles={{ borderBottom: '3px solid #efeef5', backgroundColor: '#f5f5f5' }}
      >
        {monMoi.map((item) => {
          return <Content key={item.slug} data={{ item, imagePath }} />;
        })}
      </MySlider>

      {/* Danh mục món ăn */}
      <MySlider
        headerSlider={{ title: 'Danh các mục món ăn', extendTitle: [{ title: 'xem thêm', url: '/thuc-don' }] }}
        SlickSettings={{
          arrows: true,
          autoplay: true,
        }}
        containerStyles={{ borderBottom: '3px solid #efeef5' }}
      >
        {catalogs.map((item) => {
          return <Content key={item.slug} data={{ item, imagePath }} monChinh={true} />;
        })}
      </MySlider>
    </Box>
  ) : (
    <Box>
      <Inner>Chư có dữ liệu</Inner>
    </Box>
  );
}
export default Home;

// [
//     {
//         id: 1,
//         name: 'Cá Kho',

//         menus: [],
//     },
//     {
//         id: 2,
//         name: 'Các Món Mới',

//         menus: [],
//     },
//     {
//         id: 3,
//         name: 'Món Đặc Biệt',

//         menus: [
//             {
//                 id: 13,
//                 name: 'Mâm Hải Sản Bbq',
//                 slug: 'mam-hai-san-bbq',
//                 catalog: 'Món Đặc Biệt',
//                 catalogSlug: 'mon-dac-biet',
//                 price: 499000,
//             },
//             {
//                 id: 14,
//                 name: 'Duy Vũ Quốc',
//                 slug: 'duy-vu-quoc',
//                 catalog: 'Món Đặc Biệt',
//                 catalogSlug: 'mon-dac-biet',
//                 price: 222,
//             },
//         ],
//     },
// ];
