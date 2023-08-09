import { Box, Typography } from '@mui/material';
import { MyButton } from '_/components/common';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';
import { useState } from 'react';

const DropWrapper = ({ droplist, itemSelect, setItemSelect, sx, label }) => {
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
          '& .itemSelect-btn': {
            ':hover': { backgroundColor: '#f5f5f5' },
          },
        }}
      >
        {droplist.map((itemSelect, i) => {
          return (
            <MyButton
              className="itemSelect-btn"
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
                setItemSelect(itemSelect);
              }}
            >
              <Typography width={'100%'} textAlign={'left'} fontSize={'1.4rem'}>
                {itemSelect}
              </Typography>
            </MyButton>
          );
        })}
      </Box>
    );
  };
  return (
    <Box
      sx={{
        width: '100%',
        border: '1px solid transparent',
        position: 'relative',
        ...sx,
      }}
    >
      <MyTextField
        size="small"
        label={label}
        fullWidth
        required
        type="text"
        value={itemSelect}
        onBlur={hideList}
        onFocus={showList}
        placeholder={label}
        inputProps={{
          readOnly: true,
        }}
      />

      {display && (
        <Box
          className="asdasdas"
          sx={{
            backgroundColor: '#fff',
            position: 'absolute',
            left: '0',
            border: '1px solid #ccc',
            width: '100%',
            textAlign: 'left',
            minHeight: '50px',
            maxHeight: '30vh',
            zIndex: 2,
            overflowY: 'scroll',
          }}
        >
          {renderCatalogs()}
        </Box>
      )}
    </Box>
  );
};

export default DropWrapper;
