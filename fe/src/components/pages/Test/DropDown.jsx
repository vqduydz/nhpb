import { Box, Typography } from '@mui/material';
import { Button } from '_/components/common';
import { useState } from 'react';

import { MyTextField } from '_/components/common/CustomComponents/CustomMui';

function DropDown({
    dropList = [],
    setResult,
    result,
    style = {},
    input = { status: false, inputLabel: '', placeholder: '', setSearchValue: () => {}, searchValue: '' },
}) {
    const { status, inputLabel, placeholder, setSearchValue, searchValue } = input;
    const [show, setShow] = useState(false);
    const showList = () => {
        setShow(true);
    };
    const hideList = () => {
        setTimeout(() => {
            setShow(false);
        }, 300);
    };
    const handleClick = (e, a) => {
        e.preventDefault();
        setResult(a);
    };
    const renderDropList = () => {
        return (
            <Box sx={{ '& *': { textAlign: 'left' } }}>
                {dropList.map((a, i) => {
                    return (
                        <Button
                            tyle={'button'}
                            style={{
                                width: '100%',
                                padding: '5px 10px',
                                lineHeight: 'normal',
                                borderBottom: '1px solid #f5f5f5',
                            }}
                            key={i}
                            onClick={(e) => {
                                handleClick(e, a);
                                setSearchValue(a);
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
            className="asdasdasdas"
            sx={{
                width: '100%',
                borderRadius: '3px',
                border: '1px solid transparent',
                position: 'relative',
                '& .MuiBox-root': { mt: 0 },
                ...style,
            }}
        >
            {status ? (
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
                    size="small"
                    fullWidth
                    value={searchValue || result || ''}
                    label={inputLabel}
                    type="text"
                    placeholder={placeholder}
                />
            ) : (
                <MyTextField
                    onBlur={hideList}
                    onFocus={showList}
                    size="small"
                    fullWidth
                    value={result || dropList[0] | ''}
                    InputProps={{
                        readOnly: true,
                    }}
                    required
                />
            )}
            {show && (
                <Box
                    sx={{
                        backgroundColor: '#fff',
                        mt: '1vh',
                        position: 'absolute',
                        left: '0',
                        background: '#fff',
                        borderRadius: '6px',
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
                    {renderDropList()}
                </Box>
            )}
        </Box>
    );
}

export default DropDown;
