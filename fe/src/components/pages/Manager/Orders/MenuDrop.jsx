import { Box, Typography } from '@mui/material';
import { MyButton } from '_/components/common';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';
import { useState } from 'react';

const MenuDrop = ({ menulist, setSelectedItem, searchValue, setSearchValue }) => {
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
          '& .menu-btn': {
            ':hover': { backgroundColor: '#f5f5f5' },
          },
        }}
      >
        {menulist.map((menu, i) => {
          return (
            <MyButton
              className="menu-btn"
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
                setSelectedItem(menu);
                setSearchValue(menu?.name);
              }}
            >
              <Typography width={'100%'} textAlign={'left'} fontSize={'1.4rem'}>
                {menu?.name}
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
      }}
    >
      <MyTextField
        autoComplete="off"
        size="small"
        label="Chọn menu"
        fullWidth
        id="menu"
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onBlur={hideList}
        onFocus={showList}
        name="menu"
        sx={{ background: 'transparent', outline: 'none', border: 'none' }}
        placeholder="Chọn menu ..."
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

export default MenuDrop;
