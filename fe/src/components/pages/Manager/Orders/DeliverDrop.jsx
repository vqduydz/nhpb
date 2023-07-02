import { Box, Typography } from '@mui/material';
import { MyButton } from '_/components/common';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';
import { useState } from 'react';

const DeliverDrop = ({ deliverlist, deliverSelect, setDeliverSelect }) => {
  const [display, setDisplay] = useState(false);
  const { deliver_name, deliver_id } = deliverSelect;
  const showList = () => {
    setDisplay(true);
  };
  const hideList = () => {
    setTimeout(() => {
      setDisplay(false);
    }, 200);
  };

  const renderDeliver = () => {
    return (
      <Box
        sx={{
          '& .catalog-btn': {
            ':hover': { backgroundColor: '#f5f5f5' },
          },
        }}
      >
        {deliverlist.map((deliver, i) => {
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
                setDeliverSelect({ deliver_name: deliver.firstName + ' ' + deliver.lastName, deliver_id: deliver.id });
              }}
            >
              <Typography width={'100%'} textAlign={'left'} fontSize={'1.4rem'}>
                {deliver.firstName + ' ' + deliver.lastName}
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
        label="Chọn người giao hàng"
        fullWidth
        id="catalog"
        required
        type="text"
        value={deliver_name}
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
        placeholder="Chọn người giao hàng"
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
            background: '#fff',
            border: '1px solid #ccc',
            width: '100%',
            textAlign: 'left',
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
          {renderDeliver()}
        </Box>
      )}
    </Box>
  );
};

export default DeliverDrop;
