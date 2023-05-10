import { Box, Typography } from '@mui/material';
import { Button } from '_/components/common';
import { useState } from 'react';

import { MyTextField } from '_/components/common/CustomComponents/CustomMui';

function AddressDrop({ addressList, setReceiverUpdate, receiverUpdateMeno, setSearchValue, searchValue }) {
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
        return (
            <Box sx={{ '& *': { textAlign: 'left' } }}>
                {addressList.map((a, i) => {
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
                            onClick={(e) => {
                                e.preventDefault();
                                setSearchValue(a);
                                setReceiverUpdate({
                                    ...receiverUpdateMeno,
                                    address: {
                                        ...receiverUpdateMeno.address,
                                        specificAddress: a,
                                    },
                                });
                            }}
                        >
                            <Typography width={'100%'} variant="h5" fontSize={'1.4rem'}>
                                {a}
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
                borderRadius: '3px',
                border: '1px solid transparent',
                position: 'relative',
            }}
        >
            <MyTextField
                onChange={(e) => {
                    const searchValue = e.target.value.replace(/ + /g, ' ');
                    if (!searchValue.startsWith(' ')) {
                        setSearchValue(searchValue);
                    } else {
                        setSearchValue('');
                    }
                    if (!searchValue.trim()) {
                        setSearchValue('');
                    }
                }}
                onBlur={hideList}
                onFocus={showList}
                sx={{ marginTop: '10px', marginBottom: '15px' }}
                size="small"
                label="Nhập địa chỉ"
                fullWidth
                name="address"
                type=""
                id="address"
                value={searchValue}
                required
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

export default AddressDrop;
