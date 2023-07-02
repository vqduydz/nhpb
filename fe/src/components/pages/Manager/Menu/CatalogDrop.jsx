import { Box, Typography } from '@mui/material';
import { MyButton } from '_/components/common';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';
import { useState } from 'react';

const CatalogDrop = ({ cataloglist, catalog, setCatalog }) => {
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
          '& .catalog-btn': {
            ':hover': { backgroundColor: '#f5f5f5' },
          },
        }}
      >
        {cataloglist.map((catalog, i) => {
          return (
            <MyButton
              className="catalog-btn"
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
                setCatalog(catalog);
              }}
            >
              <Typography width={'100%'} textAlign={'left'} fontSize={'1.4rem'}>
                {catalog}
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
        size="small"
        label="Chọn catalog"
        fullWidth
        id="catalog"
        required
        type="text"
        value={catalog}
        // onChange={(e) => setCatalog(e.target.value)}
        onBlur={hideList}
        onFocus={showList}
        name="catalog"
        sx={{
          // width: '100%',
          background: 'transparent',
          outline: 'none',
          border: 'none',
        }}
        placeholder="Chọn catalog"
        InputProps={{
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

export default CatalogDrop;
