import ClearIcon from '@mui/icons-material/Clear';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import SearchIcon from '@mui/icons-material/Search';
import { Box, IconButton, InputBase, Typography } from '@mui/material';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { Button } from '_/components/common';
import { listDrop } from '_/data/data';
import useDebounce from '_/hook/useDebounce';
import removeVietnameseTones from '_/utills/removeVietnameseTones';

import styles from './Home.module.scss';

const cx = classNames.bind(styles);

function SearchBox() {
    const [placeholder, setPlaceholder] = useState('Tìm bác sĩ');
    const [i, setI] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const debounce = useDebounce(searchValue, 300);
    const [loading, setLoading] = useState(false);
    const [display, setDisplay] = useState(false);

    useEffect(() => {
        const placeholder = [
            'Tìm bác sĩ',
            'Tìm lý do khám',
            'Tìm gói khám',
            'Tìm chuyên khoa',
            'Tìm bệnh viện',
            'Tìm phòng khám',
        ];

        const timer = setTimeout(() => {
            setI((pre) => (i >= placeholder.length - 1 ? 0 : pre + 1));
            setPlaceholder(placeholder[i]);
        }, 2000);
        return () => clearTimeout(timer);
    }, [i, placeholder]);

    // useEffect(() => {
    //     if (!debounce.trim()) {
    //         setList(listDrop);
    //         return;
    //     }
    //     const filteredList = listDrop.filter(
    //         (item) => item.url.includes(searchValue) || item.title.toLowerCase().includes(searchValue.toLowerCase()),
    //     );
    //     setList(filteredList);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [debounce]);

    const handleChange = (e) => {
        const searchValue = e.target.value.replace(/ + /g, ' ');
        if (!searchValue.startsWith(' ')) {
            setSearchValue(searchValue);
        } else {
            setSearchValue('');
        }
        if (!searchValue.trim()) {
            setSearchValue('');
        }
    };
    const handleClear = () => {
        setSearchValue('');
    };

    const showList = () => {
        setDisplay(true);
    };
    const hideList = () => {
        setTimeout(() => {
            setDisplay(false);
        }, 200);
    };

    const renderBranches = () => {
        const filteredlistDrop = listDrop.map((title) => {
            const filteredTitle = Object.entries(title).reduce((acc, [key, content]) => {
                const filteredBranches = content.filter((branch) => {
                    return (
                        // branch.url.toLowerCase().includes(searchValue.toLowerCase()) ||
                        removeVietnameseTones(branch.title.toLowerCase()).includes(
                            removeVietnameseTones(searchValue.toLowerCase()),
                        )
                    );
                });
                if (filteredBranches.length > 0) {
                    acc[key] = filteredBranches;
                }
                return acc;
            }, {});
            return filteredTitle;
        });

        return filteredlistDrop.map((title, index) => {
            return (
                <Box key={`title-${index}`}>
                    {Object.entries(title).map(([key, value]) => {
                        return (
                            <Box key={`branch-${key}`} className="branch">
                                <Typography
                                    sx={{
                                        backgroundColor: '#f5f5f5',
                                        fontSize: '1.4rem',
                                        padding: '3px 10px',
                                        fontWeight: 'bold',
                                    }}
                                    variant={'h6'}
                                >
                                    {key}
                                </Typography>
                                {value.map((branch, i) => {
                                    return (
                                        <Button
                                            style={{
                                                fontSize: '1.4rem',
                                                padding: '5px 10px',
                                                lineHeight: 'normal',
                                                borderBottom: '1px solid #f5f5f5',
                                            }}
                                            key={`branch-${key}-${i}`}
                                            href={branch.link}
                                        >
                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    '&:hover': {
                                                        backgroundColor: '#f1f1f1',
                                                    },
                                                }}
                                            >
                                                {branch.image && (
                                                    <Box
                                                        sx={{
                                                            backgroundImage: `url(${branch.image})`,

                                                            marginRight: '10px',
                                                            minWidth: '35px',
                                                            height: '35px',
                                                            backgroundColor: '#f5f5f5',
                                                            backgroundPosition: 'center center',
                                                            backgroundRepeat: 'no-repeat',
                                                            backgroundSize: 'cover',
                                                        }}
                                                    />
                                                )}
                                                <Typography width={'100%'} variant="h5" fontSize={'1.4rem'}>
                                                    {branch.title}
                                                </Typography>
                                            </Box>
                                        </Button>
                                    );
                                })}
                            </Box>
                        );
                    })}
                </Box>
            );
        });
    };

    return (
        <Box
            sx={(() => {
                return {
                    margin: { 0: '10px auto' },
                    width: { 560: '80%', 768: '60%', 992: '40%' },
                    minWidth: { 768: '300px' },
                    position: { 768: 'relative' },
                    zIndex: { 768: 2 },
                    minHeight: { 768: '15vh' },
                    marginBottom: '20px',
                };
            })()}
        >
            <Box
                sx={{
                    background: '#f7d800',
                    color: '#fff',
                    outline: 'none',
                    borderRadius: '25px',
                    border: '1px solid transparent',
                    lineHeight: '50px',
                    height: '50px',
                    paddingLeft: '50px',
                    paddingRight: '50px',
                    position: 'relative',
                }}
            >
                <Box
                    sx={{
                        width: '50px',
                        height: '50px',
                        lineHeight: '50px',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        color: '#333',
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <SearchIcon fontSize="small" />
                </Box>
                <InputBase
                    type="text"
                    value={searchValue}
                    onBlur={hideList}
                    onFocus={showList}
                    onChange={handleChange}
                    sx={{
                        background: 'transparent',
                        outline: 'none',
                        border: 'none',
                        width: '100% ',
                    }}
                    placeholder={placeholder}
                />
                <Box
                    sx={{
                        width: '50px',
                        height: '50px',
                        lineHeight: '50px',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        color: '#333',
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    {!!searchValue && !loading && (
                        <IconButton onClick={handleClear} type="button">
                            <ClearIcon sx={{ fontSize: '2rem' }} />
                        </IconButton>
                    )}
                    {!!searchValue && loading && (
                        <IconButton onClick={handleClear} type="button">
                            <RotateRightIcon className={cx('loading')} sx={{ fontSize: '2rem' }} />
                        </IconButton>
                    )}
                </Box>
                <Box
                    sx={{
                        backgroundColor: '#fff',
                        // width: { 560: '80%', 768: '60%', 992: '40%' },
                        mt: '1vh',
                        position: 'absolute',
                        left: '0',
                        background: '#fff',
                        borderRadius: '2px',
                        border: '1px solid #ccc',
                        width: '100%',
                        textAlign: 'left',
                        minHeight: '50px',
                        maxHeight: '60vh',
                        overflow: 'auto',
                        zIndex: 1,
                        // padding: '10px',
                        display: display ? 'block' : 'none',
                        '& .search-list': {
                            padding: '0 10px',
                        },
                        '*': {
                            color: '#000',
                        },
                    }}
                >
                    {/* {Object.entries(list).map(([key, subject], i) =>
                        [key].map(() => (
                            <Box
                                sx={{
                                    '*': {
                                        color: '#000',
                                    },
                                }}
                                key={i}
                            >
                                <p>{key}</p>
                                {subject.map((item, index) => (
                                    <Box key={index}>
                                        <Button className="search-list" href={item.url}>
                                            {item.title}
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        )),
                    )} */}

                    {renderBranches()}
                </Box>
            </Box>
        </Box>
    );
}

export default SearchBox;
