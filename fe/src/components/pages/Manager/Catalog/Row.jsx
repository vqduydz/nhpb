import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, TableCell, TableRow } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { MyButton } from '_/components/common';
import { useAuth } from '_/context/AuthContext';
import { useThemMui } from '_/context/ThemeMuiContext';
import { deleteCatalog } from '_/redux/slices';
import { dateTimeFormate } from '_/utills';

export default function Row(props) {
  const dispatch = useDispatch();
  const { setLoading, loading } = useThemMui();
  const { catalog, STT, setEdit, imagePath, edit } = props;
  const { id, createdAt, name, slug, thumb_url } = catalog;
  const { setSnackbar } = useAuth();
  const [open, setOpen] = useState(false);
  const handleDelete = () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Delete confirmation')) {
      setLoading(true);
      dispatch(deleteCatalog(id))
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
  const [first, setfirst] = useState(false);
  useEffect(() => {
    setfirst(!first);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edit]);
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
        <TableCell sx={{ width: '35px' }} align="center">
          {STT}
        </TableCell>
        <TableCell align="center" sx={{ paddingLeft: '1vh' }} component="th" scope="row">
          <img src={imagePath + thumb_url} alt="Uploaded" width={80} height={60} />
        </TableCell>
        <TableCell component="th" scope="row">
          {name}
        </TableCell>

        <TableCell align="right">{dateTimeFormate(createdAt)}</TableCell>
        <TableCell align="right">
          <Box
            justifyContent={'flex-end'}
            sx={{
              display: 'flex',
              '& .btn ': {
                // padding: '0 2px',
                '+ .btn': {
                  marginLeft: '5px',
                },
              },
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
