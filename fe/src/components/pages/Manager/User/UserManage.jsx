import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { MyButton } from '_/components/common';
import { useThemMui } from '_/context/ThemeMuiContext';
import { getUser } from '_/redux/slices';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Wrapper } from '../Wrapper';
import CreateNewUser from './CreateNewUser';
import Edit from './EditUser';
import Row from './Row';

export default function UserManage() {
  const [edit, setEdit] = useState({ stt: false, value: {} });
  const [addUser, setAddUser] = useState(false);
  const [overLay, setOverLay] = useState(false);
  const [sideNav, setSideNav] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [rootUsers, setRootUsers] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [manageUsers, setManagerUsers] = useState([]);
  const [customerUsers, setCustomerUsers] = useState([]);
  const [deliverUsers, setDeliverUsers] = useState([]);
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

  useEffect(() => {
    setRootUsers(() => allUser.filter((user) => user.role === 'Root'));
    setAdminUsers(() => allUser.filter((user) => user.role === 'Admin'));
    setManagerUsers(() => allUser.filter((user) => user.role === 'Manager'));
    setCustomerUsers(() => allUser.filter((user) => user.role === 'Customer'));
    setDeliverUsers(() => allUser.filter((user) => user.role === 'Deliver'));
  }, [allUser]);

  const btnContent = [
    { tab: 0, content: 'Tất cả', color: 'green' },
    { tab: 1, content: 'Root', color: '#ed6c02' },
    { tab: 2, content: 'Admin', color: '#0288d1' },
    { tab: 3, content: 'Quản lý', color: '#0a66b7' },
    { tab: 4, content: 'Người giao hàng', color: 'green' },
    { tab: 5, content: 'Khách hàng', color: '#fe2c55' },
  ];
  const render = (tab) => {
    let comp = [],
      content = '';
    switch (tab) {
      case 0:
        comp = allUser;
        content = 'Tất cả';
        break;
      case 1:
        comp = rootUsers;
        content = 'Root';
        break;
      case 2:
        comp = adminUsers;
        content = 'Admin';
        break;
      case 3:
        comp = manageUsers;
        content = 'Quản lý';
        break;
      case 4:
        comp = deliverUsers;
        content = 'Người giao hàng';
        break;
      case 5:
        comp = customerUsers;
        content = 'Khách hàng';
        break;

      default:
        break;
    }

    return comp.length > 0 ? (
      <Table
        sx={{
          mt: '10px',
          width: '100%',
          '& th': {
            '& +th': { borderLeft: '1px solid #00000024' },
            '& +td': { borderLeft: '1px solid #00000024' },
          },
          '& td': {
            '& +td': { borderLeft: '1px solid #00000024' },
            '& +th': { borderLeft: '1px solid #00000024' },
          },

          '& span.Mui-checked , span.MuiCheckbox-indeterminate': {
            color: '#333 !important ',
          },
          '& *': {
            '& .MuiTableCell-root': {
              padding: '10px 5px',
              borderBottomColor: '#00000024',
            },
          },
        }}
        aria-label="collapsible table"
      >
        <TableHead
          sx={{
            backgroundColor: '#f9f9f9',
            '& *': { fontWeight: '700 !important' },
          }}
        >
          <TableRow>
            <TableCell align="center" sx={{ width: '45px' }}>
              STT
            </TableCell>
            <TableCell>Email</TableCell>
            <TableCell sx={{ width: '200px' }} align="center">
              Tên
            </TableCell>
            <TableCell sx={{ width: '100px' }} align="center">
              Quyền
            </TableCell>
            <TableCell sx={{ width: '160px' }} align="center">
              Ngày tạo
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {comp.map((user, index) => {
            return <Row setEdit={setEdit} key={user.id} user={user} STT={index + 1} />;
          })}
        </TableBody>
      </Table>
    ) : (
      <Box
        sx={{
          padding: '40px 0 60px 0',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        <Typography fontSize={'2rem'} fontWeight={700} color={'grey'}>
          {`Hiện tại không có "${content.toLowerCase()}"`}
        </Typography>
      </Box>
    );
  };
  return (
    <Wrapper>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 10px 10px',
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

      {render(tab)}

      {(overLay || edit.stt || addUser) && (
        <Box sx={{ zIndex: 3, backgroundColor: '#212121', position: 'relative' }}>
          {overLay && (
            <Box
              sx={{
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
          {addUser && <CreateNewUser setAddUser={setAddUser} edit={edit} />}
        </Box>
      )}
    </Wrapper>
  );
}
