import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Collapse, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { MyButton } from '_/components/common';
import { useAuth } from '_/context/AuthContext';
import { useThemMui } from '_/context/ThemeMuiContext';
import { deleteUser } from '_/redux/slices';
import { dateTimeFormate } from '_/utills';

export default function Row(props) {
  const dispatch = useDispatch();
  const { setLoading } = useThemMui();
  const { user, STT, setEdit } = props;
  const { id, phoneNumber, gender, place, firstName, lastName, role, email, createdAt } = user;
  const { currentUser, socket, setSnackbar } = useAuth();
  const [open, setOpen] = useState(false);
  const handleDelete = () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Delete confirmation')) {
      setLoading(true);
      dispatch(deleteUser(id))
        .then(unwrapResult)
        .then((result) => {
          const userId = id;
          socket.emit('deleteUser', userId);
          let message, status;
          if (result.error) {
            message = result.error;
            status = 'error';
          } else {
            message = result.message;
            status = 'success';
          }
          setLoading(false);
          // enqueueSnackbar(message, { status });
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
          cursor: 'pointer',
          backgroundImage: 'linear-gradient(#dfdfdf 0%, #fff 28%)',
          borderBottom: '1px solid #0000000a',
          '& > *': { borderBottom: 'unset' },
        }}
      >
        <TableCell sx={{ width: '35px' }} align="center">
          {STT}
        </TableCell>
        <TableCell component="th" scope="row">
          {email}
        </TableCell>
        <TableCell align="center">{`${firstName} ${lastName}`}</TableCell>
        <TableCell align="center">{role}</TableCell>
        <TableCell align="center">{dateTimeFormate(createdAt)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ paddingLeft: '5vh' }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ width: '130px' }}>
                      Phone number
                    </TableCell>
                    <TableCell align="center" sx={{ width: '80px' }}>
                      Gender
                    </TableCell>
                    <TableCell align="right">Address</TableCell>
                    <TableCell sx={{ width: '100px' }} align="center">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="center" sx={{ paddingLeft: '1vh' }} component="th" scope="row">
                      {phoneNumber}
                    </TableCell>
                    <TableCell align="center">{gender}</TableCell>
                    <TableCell align="right">
                      {(() => {
                        if (place) {
                          const address = JSON.parse(place);
                          return `${address?.address}, ${address?.ward}, ${address?.district}, ${address?.province}`;
                        } else {
                          return ``;
                        }
                      })()}
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        justifyContent={'center'}
                        sx={{
                          display: 'flex',
                          '& .btn ': {
                            '+ .btn': {
                              marginLeft: '5px',
                            },
                          },
                          '& .icon': {
                            fontSize: '1.8rem !important',
                          },
                          ' * ': {
                            borderRadius: '3px',
                          },
                        }}
                      >
                        {(role === 'Root' && currentUser?.id !== id) ||
                        (role === 'Admin' && currentUser?.id !== id && currentUser?.role === 'Admin') ? (
                          <MyButton
                            effect
                            color={{ mainColor: 'orange' }}
                            padding={'5px 8px'}
                            aria-label="delete"
                            className={' btn edit-btn disable'}
                          >
                            <EditIcon className="icon" />
                          </MyButton>
                        ) : (
                          <MyButton
                            effect
                            color={{ mainColor: 'orange' }}
                            padding={'5px 8px'}
                            onClick={() => {
                              setEdit({ stt: true, value: user });
                            }}
                            aria-label="delete"
                            className={' btn edit-btn'}
                          >
                            <EditIcon className="icon" />
                          </MyButton>
                        )}
                        {role === 'Root' || (role === 'Admin' && currentUser?.role !== 'Root') ? (
                          <MyButton
                            effect
                            color={{ mainColor: '#fe2c55' }}
                            padding={'5px 8px'}
                            className={' btn del-btn disable'}
                            aria-label="delete"
                          >
                            <DeleteIcon className="icon" />
                          </MyButton>
                        ) : (
                          <MyButton
                            effect
                            color={{ mainColor: '#fe2c55' }}
                            padding={'5px 8px'}
                            onClick={handleDelete}
                            className={' btn del-btn'}
                            aria-label="delete"
                          >
                            <DeleteIcon className="icon" />
                          </MyButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
