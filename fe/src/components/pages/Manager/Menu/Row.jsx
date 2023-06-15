import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, TableCell, TableRow, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { MyButton } from '_/components/common';
import { useAuth } from '_/context/AuthContext';
import { useThemMui } from '_/context/ThemeMuiContext';
import { deleteMenu } from '_/redux/slices';
import { dateTimeFormate, renderPrice } from '_/utills';

export default function Row(props) {
  const dispatch = useDispatch();
  const { setLoading } = useThemMui();
  const { menu, STT, setEdit, imagePath } = props;
  const { id, createdAt, slug, name, catalog, price, unit, thumb_url } = menu;
  const { setSnackbar } = useAuth();
  const [open, setOpen] = useState(false);
  const handleDelete = () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Delete confirmation')) {
      setLoading(true);
      dispatch(deleteMenu(id))
        .then(unwrapResult)
        .then((result) => {
          let message, status;
          if (result.error) {
            message = result.error;
            status = 'error';
          } else {
            message = result.message;
            status = 'success';
          }
          setLoading(false);
          setSnackbar({ open: true, message, status });
        })
        .catch((e) => {
          setLoading(false);
          setSnackbar({ open: true, message: 'unknow error', status: 'error' });
        });
    } else {
      setSnackbar({ open: true, message: 'Cancel delete', status: 'info' });
    }
  };

  return (
    <>
      <TableRow
        onClick={() => {
          setOpen(!open);
        }}
        sx={{
          backgroundColor: STT % 2 === 0 ? '#f9f9f9' : '#fff',
          '& > *': { borderBottom: 'unset' },
        }}
      >
        <TableCell sx={{ minWidth: '30px' }} align="center">
          {STT}
        </TableCell>
        <TableCell align="center" sx={{ paddingLeft: '1vh' }} component="th" scope="row">
          <img src={imagePath + thumb_url} alt="Uploaded" width={80} height={60} />
        </TableCell>
        <TableCell component="th" scope="row">
          <MyButton fontSize={1.4} to={`/mon-an/${slug}`} text>
            {name}
          </MyButton>
          <Typography fontSize={'1.2rem'}>{catalog}</Typography>
        </TableCell>
        <TableCell align="center">{renderPrice(price)}</TableCell>
        <TableCell align="center">{unit}</TableCell>
        <TableCell sx={{ width: '90px' }} align="center">
          {dateTimeFormate(createdAt)}
        </TableCell>
        <TableCell align="center">
          <Box
            justifyContent={'center'}
            sx={{
              display: 'flex',
              gap: '5px',
              '& .icon': {
                fontSize: '1.6rem !important',
              },
              ' * ': {
                borderRadius: '3px',
              },
            }}
          >
            <MyButton
              effect
              color={{ mainColor: 'orange' }}
              onClick={() => {
                setEdit({ stt: true, value: catalog });
              }}
              aria-label="delete"
              className={' btn edit-btn'}
            >
              <EditIcon className="icon" />
            </MyButton>
            <MyButton
              effect
              color={{ mainColor: 'red' }}
              padding="2px 4px"
              onClick={handleDelete}
              className={' btn del-btn'}
              aria-label="delete"
            >
              <DeleteIcon className="icon" />
            </MyButton>
          </Box>
        </TableCell>
      </TableRow>
    </>
  );
}
