import { Box, Typography } from '@mui/material';
import { MyButton } from '_/components/common';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';
import React, { useState } from 'react';

const TimeDrop = ({ timelist = [], setTimeSelect, timeSelect }) => {
  const [display, setDisplay] = useState(false);
  const showList = () => {
    setDisplay(true);
  };
  const hideList = () => {
    setTimeout(() => {
      setDisplay(false);
    }, 200);
  };
  const renderCatalogs = () => {
    return (
      <Box
        sx={{
          borderBottom: '1px solid #f5f5f5',
          '& .time-btn': {
            ':hover': { backgroundColor: '#f5f5f5' },
          },
        }}
      >
        {timelist.map((time, i) => {
          return (
            <MyButton
              className="time-btn"
              type={'button'}
              style={{
                width: '100%',
                fontSize: '1.4rem',
                padding: '5px 10px',
                lineHeight: 'normal',
                borderBottom: '1px solid #f5f5f5',
                borderRadius: '0',
              }}
              key={i}
              onClick={() => {
                setTimeSelect(time);
              }}
            >
              <Typography width={'100%'} textAlign={'left'} fontSize={'1.4rem'}>
                {time}
              </Typography>
            </MyButton>
          );
        })}
      </Box>
    );
  };
  return (
    <Box sx={{ flex: 1, width: '100%', border: '1px solid transparent', position: 'relative' }}>
      <MyTextField
        autoComplete="off"
        size="small"
        label="Chọn time"
        fullWidth
        id="time"
        type="text"
        value={timeSelect}
        onBlur={hideList}
        onFocus={showList}
        name="time"
        sx={{ background: 'transparent', outline: 'none', border: 'none' }}
        placeholder="Chọn time ..."
        inputProps={{
          readOnly: true,
        }}
      />

      {display && (
        <Box
          className="asdasdas"
          sx={{
            backgroundColor: '#fff',
            mt: '1vh',
            position: 'absolute',
            left: '0',
            border: '1px solid #ccc',
            borderBottom: '2px solid #ccc',
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
          {renderCatalogs()}
        </Box>
      )}
    </Box>
  );
};

export default TimeDrop;
