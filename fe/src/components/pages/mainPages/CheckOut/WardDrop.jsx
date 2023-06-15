import { Box, Typography } from '@mui/material';
import { Button } from '_/components/common';
import removeVietnameseTones from '_/utills/removeVietnameseTones';
import { useEffect, useState } from 'react';

import { MyTextField } from '_/components/common/CustomComponents/CustomMui';

function WardDrop({ wardList, setWardSelect, districtSelect, setReceiverUpdate, receiverUpdateMeno, setSearchValue }) {
  const [ward, setWard] = useState(receiverUpdateMeno.address.ward);
  const [display, setDisplay] = useState(false);
  useEffect(() => {
    districtSelect.wards && districtSelect.wards.some((ward) => ward.name === ward) ? setWard(ward) : setWard('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtSelect]);

  const showList = () => {
    setDisplay(true);
  };
  const hideList = () => {
    setTimeout(() => {
      setDisplay(false);
    }, 200);
  };

  const renderDistricts = () => {
    const filteredWards = wardList.filter((w) => {
      return (
        // branch.url.toLowerCase().includes(ward.toLowerCase()) ||
        removeVietnameseTones(w.name.toLowerCase()).includes(removeVietnameseTones(ward.toLowerCase()))
      );
    });

    return (
      <Box>
        {filteredWards.map((ward, i) => {
          return (
            <MyButton
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
                setWardSelect(ward.name);
                setWard(ward.name);
                setSearchValue('');
                setReceiverUpdate({
                  ...receiverUpdateMeno,
                  address: { ...receiverUpdateMeno.address, ward: ward.name, specificAddress: '' },
                });
              }}
            >
              <Typography width={'100%'} variant="h5" fontSize={'1.4rem'}>
                {ward.name}
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
        marginTop: '15px',
        borderRadius: '3px',
        border: '1px solid transparent',
        position: 'relative',
      }}
    >
      <MyTextField
        required
        size="small"
        label="Chọn Phường/Xã"
        type="text"
        fullWidth
        value={ward}
        onChange={(e) => setWard(e.target.value)}
        onBlur={hideList}
        onFocus={showList}
        sx={{
          // width: '100%',
          background: 'transparent',
          outline: 'none',
          border: 'none',
        }}
        placeholder="Tìm Phường/Xã"
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

export default WardDrop;
