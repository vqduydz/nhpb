import { Box, Typography } from '@mui/material';
import { Button } from '_/components/common';
import removeVietnameseTones from '_/utills/removeVietnameseTones';
import { useState } from 'react';

import { MyTextField } from '_/components/common/CustomComponents/CustomMui';

function DistrictDrop({ districts, setDistrictSelect, setReceiverUpdate, receiverUpdateMeno, setSearchValue }) {
    const [district, setDistrict] = useState(receiverUpdateMeno.address.district);
    const [display, setDisplay] = useState(false);

    const showList = () => {
        setDisplay(true);
    };
    const hideList = () => {
        setTimeout(() => {
            setDisplay(false);
        }, 200);
    };

    const renderDistricts = () => {
        const filteredDistricts = districts.filter((d) => {
            return (
                // branch.url.toLowerCase().includes(district.toLowerCase()) ||
                removeVietnameseTones(d.name.toLowerCase()).includes(removeVietnameseTones(district.toLowerCase()))
            );
        });

        return (
            <Box sx={{ '& *': { textAlign: 'left' } }}>
                {filteredDistricts.map((district, i) => {
                    return (
                        <Button
                            tyle={'button'}
                            style={{
                                width: '100%',
                                fontSize: '1.4rem',
                                padding: '5px 10px',
                                lineHeight: 'normal',
                                borderBottom: '1px solid #f5f5f5',
                            }}
                            key={i}
                            onClick={() => {
                                setDistrictSelect(district);
                                setDistrict(district.name);
                                setSearchValue('');
                                setReceiverUpdate({
                                    ...receiverUpdateMeno,
                                    address: {
                                        ...receiverUpdateMeno.address,
                                        district: district.name,
                                        ward: '',
                                        specificAddress: '',
                                    },
                                });
                            }}
                        >
                            <Typography width={'100%'} variant="h5" fontSize={'1.4rem'}>
                                {district.name}
                            </Typography>
                        </Button>
                    );
                })}
            </Box>
        );
    };
    return (
        <Box
            sx={{
                width: '100%',
                marginTop: '15px',
                borderRadius: '3px',
                border: '1px solid transparent',
                position: 'relative',
            }}
        >
            <MyTextField
                required
                size="small"
                fullWidth
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                onBlur={hideList}
                onFocus={showList}
                sx={{
                    // width: '100%',
                    background: 'transparent',
                    outline: 'none',
                    border: 'none',
                }}
            />

            {display && (
                <Box
                    sx={{
                        backgroundColor: '#fff',
                        mt: '1vh',
                        position: 'absolute',
                        left: '0',
                        background: '#fff',
                        borderRadius: '2px',
                        border: '1px solid #ccc',
                        width: '100%',
                        textAlign: 'left',
                        minHeight: '50px',
                        maxHeight: '30vh',
                        overflow: 'auto',
                        zIndex: 2,
                        overflowY: 'scroll',
                        '& .search-list': {
                            padding: '0 10px',
                        },
                        '*': {
                            color: '#000',
                        },
                    }}
                >
                    {renderDistricts()}
                </Box>
            )}
        </Box>
    );
}

export default DistrictDrop;
