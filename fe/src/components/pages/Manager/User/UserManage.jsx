import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { MyButton } from '_/components/common';
import { muiCustomStyles } from '_/components/common/CustomComponents/CustomMui';
import { useThemMui } from '_/context/ThemeMuiContext';
import { getUser } from '_/redux/slices';
import CreateNewUser from './CreateNewUser';
import Edit from './EditUser';
import Row from './Row';

export default function UserManage() {
  const [edit, setEdit] = useState({ stt: false, value: {} });
  const [addUser, setAddUser] = useState(false);
  const [overLay, setOverLay] = useState(false);
  const [sideNav, setSideNav] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [tab, setTab] = useState(0);
  const { loading } = useThemMui();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!sideNav && !addUser && !edit.stt) {
      setOverLay(false);
      return;
    }
    setOverLay(true);
  }, [addUser, edit.stt, sideNav]);

  useEffect(() => {
    dispatch(getUser())
      .then(unwrapResult)
      .then((result) => {
        setAllUser(result.users);
      })
      .catch((error) => {
        console.log({ error });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const btnContent = [
    { tab: 0, content: 'Tất cả', color: 'green' },
    { tab: 1, content: 'Root', color: '#ed6c02' },
    { tab: 2, content: 'Admin', color: '#0288d1' },
    { tab: 3, content: 'Quản lý', color: '#0a66b7' },
    { tab: 4, content: 'Người giao hàng', color: 'green' },
    { tab: 5, content: 'Khách hàng', color: '#fe2c55' },
  ];

  return (
    <Box sx={{ ...muiCustomStyles }}>
      <Box
        sx={{
          minWidth: 'calc(768px-2rem)',
          position: 'relative',
        }}
      >
        <TableContainer sx={{ boxShadow: 'unset' }} component={Paper}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              pb: '10px',
              '&  .btn': {
                fontSize: '1.2rem',
                padding: '10px',
                '& *': { justifyContent: 'center' },
              },
            }}
          >
            <Typography fontSize={'2.4rem'} fontWeight={700}>
              Danh sách người dùng
            </Typography>
            <MyButton
              effect
              color={{ mainColor: 'green' }}
              onClick={() => setAddUser(true)}
              style={{ padding: '3px 8px' }}
              className="btn"
            >
              Tạo mới
            </MyButton>
          </Box>
          <Box
            sx={{
              borderRadius: '6px',
              display: 'flex',
              gap: '5px',
              justifyContent: 'start',
              padding: '10px',
              mb: '10px',
              backgroundColor: '#00000005',
              border: '1px solid #0000000a',
            }}
          >
            {btnContent.map((btn) => (
              <MyButton
                key={btn.tab}
                text
                fontWeight={700}
                color={{ mainColor: btn.color }}
                style={{ borderBottom: btn.tab === tab ? `2px solid ${btn.color}` : '2px solid transparent' }}
                padding={'1px 9px'}
                onClick={() => setTab(btn.tab)}
              >
                {btn.content}
              </MyButton>
            ))}
          </Box>
          <Table
            sx={{
              mt: '10px',
              width: '100%',
              '& span.Mui-checked , span.MuiCheckbox-indeterminate': {
                color: '#333 !important ',
              },
              '& *': {
                '& .MuiTableCell-root': {
                  padding: '5px',
                  borderBottomColor: '#00000024',
                },
              },
            }}
            aria-label="collapsible table"
          >
            <TableHead
              sx={{
                backgroundColor: '#f9f9f9',
                border: '1px solid #0000000a',
                '& *': { fontWeight: '700 !important' },
              }}
            >
              <TableRow>
                <TableCell align="center" sx={{ width: '45px' }}>
                  STT
                </TableCell>
                <TableCell>Email address</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Role</TableCell>
                <TableCell align="right">Create date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allUser.map((user, index) => {
                return <Row setEdit={setEdit} key={user.id} user={user} STT={index + 1} />;
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {overLay && (
        <Box
          sx={{
            // display: { 0: 'block', 768: 'none' },
            position: 'fixed',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            opacity: 0.6,
            transition: 'bottom 0.3s linear 0s',
            backgroundColor: '#212121',
          }}
          onClick={() => {
            setEdit(false);
            setAddUser(false);
            setSideNav(false);
          }}
        />
      )}
      {edit.stt && <Edit setEdit={setEdit} edit={edit} />}
      {/* {addUser && <CreateNewUser setAddUser={setAddUser} edit={edit} />} */}
      {addUser && <CreateNewUser setAddUser={setAddUser} edit={edit} />}
    </Box>
  );
}
