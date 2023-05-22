import NorthIcon from '@mui/icons-material/North';
import { Box, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { MyButton, renderContent } from '_/components/common';
import { Inner } from '_/components/common/CustomComponents/CustomMui';
import { getCatalog } from '_/redux/slices';
import { routes } from '_/routes';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import MySingleSlider from '../Home/MySingleSlider';

const Menu = () => {
    const dispatch = useDispatch();
    const [menu, setMenu] = useState([]);
    const [imagePath, setImagePath] = useState('');
    useEffect(() => {
        dispatch(getCatalog())
            .then(unwrapResult)
            .then((res) => {
                const { catalogsWithMenus: menu, imagePath } = res;

                menu.sort((a, b) => {
                    if (a.slug === 'mon-dac-biet') return -1;
                    if (b.slug === 'mon-dac-biet') return 1;
                    if (a.slug === 'cac-mon-moi') return -1;
                    if (b.slug === 'cac-mon-moi') return 1;
                    if (a.room === 'nuoc-ngot') return 1;
                    if (b.room === 'nuoc-ngot') return -1;
                    if (a.room === 'bia') return 1;
                    if (b.room === 'bia') return -1;
                    if (a.room === 'ruou') return -1;
                    if (b.room === 'ruou') return 1;
                    return 0;
                });

                setMenu(menu);
                setImagePath(imagePath);
            })
            .catch((error) => {
                console.log(error);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const scroll = (id) => {
        let targetElement = document.getElementById(id);
        var targetOffsetTop = targetElement.offsetTop;
        var scrollTo = targetOffsetTop - 130;
        window.scrollTo(0, scrollTo);
    };
    useEffect(() => {
        const slug = window.location.hash.substr(1);
        if (!slug) return;
        let targetElement = document.getElementById(slug);
        if (!targetElement) return;
        var targetOffsetTop = targetElement.offsetTop;
        var scrollTo = targetOffsetTop - 130;
        window.scrollTo(0, scrollTo);
    }, [menu]);

    return (
        <Box>
            <MySingleSlider
                headerSlider={false}
                SlickSettings={{
                    arrows: true,
                    autoplay: true,
                    infinite: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    variableWidth: true,
                }}
                containerStyles={{
                    position: 'fixed',
                    borderTop: '1px solid rgba(0,0,0,0.1)',
                    top: '80px',
                    padding: '0',
                    background: 'rgba(255, 255, 255, 1)',
                    zIndex: 3,
                    width: '100%',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)',
                }}
            >
                {menu.map((item) => {
                    return (
                        <MyButton
                            onClick={() => {
                                scroll(item.slug);
                            }}
                            to={routes.menu}
                            padding={'10px 10px'}
                            effect
                            fontSize={2}
                            fontWeight={500}
                            key={item.slug}
                            color={{ subColor: 'red' }}
                            text
                        >
                            {item.name}
                        </MyButton>
                    );
                })}
            </MySingleSlider>

            <Box sx={{ mt: '50px' }}>
                {menu.map((item, index) => {
                    return (
                        <Box
                            key={item.slug}
                            id={item.slug}
                            sx={{
                                paddingTop: '20px',
                                paddingBottom: '30px',
                                borderBottom: '3px solid #efeef5',
                                backgroundColor: index % 2 === 0 ? '#fff' : '#f5f5f5',
                            }}
                        >
                            <Inner>
                                <Typography
                                    sx={{
                                        fontSize: '2rem',
                                        fontWeight: 700,
                                        mb: '10px',
                                        textTransform: 'uppercase',
                                        color: 'grey',
                                    }}
                                >
                                    {item.name}
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat( auto-fill, minmax(300px, 1fr))',
                                        gridAutoRows: 'auto',
                                        gap: {
                                            0: '4px',
                                            720: '5px',
                                            960: '10px',
                                            1360: '15px',
                                            1600: '20px',
                                        },
                                    }}
                                >
                                    {renderContent({ items: item.menus, imagePath })}
                                </Box>
                            </Inner>
                        </Box>
                    );
                })}
            </Box>

            <MyButton
                padding={'10px 5px'}
                onClick={() => {
                    window.scrollTo(0, 0);
                }}
                effect
                style={{ position: 'fixed', right: '20px', bottom: '20px' }}
            >
                <NorthIcon />
            </MyButton>
        </Box>
    );
};

export default Menu;
