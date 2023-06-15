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
  const { id, phoneNumber, gender, address, firstName, lastName, role, email, createdAt } = user;
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
          backgroundColor: STT % 2 === 0 ? '#f9f9f9' : '#fff',
          borderRadius: '3px',
          border: '1px solid #0000000a',
          '& > *': { borderBottom: 'unset' },
        }}
      >
        <TableCell sx={{ width: '35px' }} align="center">
          {STT}
        </TableCell>
        <TableCell component="th" scope="row">
          {email}
        </TableCell>
        <TableCell align="right">{`${firstName} ${lastName}`}</TableCell>
        <TableCell align="right">{role}</TableCell>
        <TableCell align="right">{dateTimeFormate(createdAt)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ paddingLeft: '5vh' }}>
              <Table size="small" aria-label="purchases">
                <TableHead
                  onClick={() => {
                    setOpen(!open);
                  }}
                >
                  <TableRow>
                    <TableCell>Phone number</TableCell>
                    <TableCell>Gender</TableCell>
                    <TableCell align="right">Address</TableCell>
                    <TableCell sx={{ maxWidth: '100px', width: '100px' }} align="center">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ paddingLeft: '1vh' }} component="th" scope="row">
                      {phoneNumber}
                    </TableCell>
                    <TableCell>{gender}</TableCell>
                    <TableCell align="right">{address}</TableCell>
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
                        {(role === 'Root' && currentUser?.id !== id) ||
                        (role === 'Admin' && currentUser?.id !== id && currentUser?.role === 'Admin') ? (
                          <MyButton
                            effect
                            color={{ mainColor: 'orange' }}
                            aria-label="delete"
                            className={' btn edit-btn disable'}
                          >
                            <EditIcon className="icon" />
                          </MyButton>
                        ) : (
                          <MyButton
                            effect
                            color={{ mainColor: 'orange' }}
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
                            color={{ mainColor: 'red' }}
                            padding="2px 4px"
                            className={' btn del-btn disable'}
                            aria-label="delete"
                          >
                            <DeleteIcon className="icon" />
                          </MyButton>
                        ) : (
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
