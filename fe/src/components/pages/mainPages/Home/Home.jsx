import { Box } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import chiNhanh4 from '_/assets/images/Banner-khai-truong.png';
import { Button } from '_/components/common';
import { Inner } from '_/components/common/CustomComponents/CustomMui';
import { getCatalog, getMenu } from '_/redux/slices';
import Content from './Content';
import MySlider from './MySlider';

function Home() {
    const dispatch = useDispatch();
    const [monMoi, setMonMoi] = useState([]);
    const [monDacBiet, setMonDacBiet] = useState([]);
    const [catalog, setCatalog] = useState([]);

    useEffect(() => {
        dispatch(getMenu())
            .then(unwrapResult)
            .then((res) => {
                const { menu } = res;
                setMonMoi(() => menu.filter((item) => item.catalog === 'Các món mới'));
                setMonDacBiet(() => menu.filter((item) => item.catalog === 'Món đặc biệt'));
            })
            .catch((error) => {
                console.log(error);
            });

        dispatch(getCatalog())
            .then(unwrapResult)
            .then((res) => {
                setCatalog(res.catalog);
            })
            .catch((error) => {
                console.log(error);
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // const SlickStyles = {
    //     '& .slick-slide > div': {
    //         margin: '0 5px',
    //     },
    //     '& .slick-list': {
    //         margin: '0 -5px',
    //     },
    // };

    return (
        <Box>
            {/* <Box
                sx={{
                    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.15),rgba(255, 255, 255, 0.1))',
                    color: '#333',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '15px 0',
                }}
            >
                <Inner sx={{ padding: 0 }}>
                    <Button href={'/'} style={{ padding: 0, width: '100%' }}>
                        <img width={'100%'} alt="" src={chiNhanh4}></img>
                    </Button>
                </Inner>
            </Box> */}
            <Box
                sx={{
                    backgroundImage:
                        'linear-gradient(rgba(255, 255, 255, 0.1),rgba(255, 255, 255, 0.9),rgba(255, 255, 255, 1))',
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
                    return <Content key={item.slug} data={item} />;
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
                    return <Content key={item.slug} data={item} />;
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
                {catalog.map((item) => {
                    return <Content key={item.slug} data={item} monChinh={true} />;
                })}
            </MySlider>
        </Box>
    );
}
export default Home;
