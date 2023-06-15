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
import { MyButton } from '_/components/common';
import { muiCustomStyles } from '_/components/common/CustomComponents/CustomMui';
import { useThemMui } from '_/context/ThemeMuiContext';
import { getMenu } from '_/redux/slices';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import FileUpload from '../FileUpload';
import CreateNewUser from './CreateNewMenu';
import EditMenu from './EditMenu';
import Row from './Row';

export default function MenuManage() {
  const [edit, setEdit] = useState({ stt: false, value: {} });
  const [addMenu, setAddMenu] = useState(false);
  const [upload, setUpload] = useState(false);
  const [overLay, setOverLay] = useState(false);
  const [sideNav, setSideNav] = useState(false);
  const [menus, setMenus] = useState({ items: [], pathImage: '' });
  const [access, setAccess] = useState({ permission: false, message: '' });
  const { loading } = useThemMui();
  const dispatch = useDispatch();
  const { items, imagePath } = menus;
  const { permission, message } = access;
  useEffect(() => {
    if (!sideNav && !addMenu && !edit.stt) {
      setOverLay(false);
      return;
    }
    setOverLay(true);
  }, [addMenu, edit?.stt, sideNav]);

  useEffect(() => {
    dispatch(getMenu())
      .then(unwrapResult)
      .then((result) => {
        setAccess({ permission: true });
        setMenus({ items: result.menus, imagePath: result.imagePath });
      })
      .catch((error) => {
        setAccess({ permission: false, message: error.errorMessage });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

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
              '&  .btn': {
                fontSize: '1.2rem',
                padding: '10px',
                '& *': { justifyContent: 'center' },
              },
            }}
          >
            <Typography fontSize={'2.4rem'} fontWeight={700}>
              Danh sách món ăn - đồ uống
            </Typography>
            <Box sx={{ display: 'flex', gap: '10px' }}>
              <MyButton
                effect
                color={{ mainColor: 'green' }}
                onClick={() => setAddMenu(true)}
                style={{ padding: '3px 8px' }}
                className="btn"
              >
                Tạo mới
              </MyButton>
              <MyButton
                effect
                color={{ mainColor: 'blue' }}
                onClick={() => setUpload(true)}
                style={{ padding: '3px 8px' }}
                className="btn"
              >
                Import
              </MyButton>
            </Box>
          </Box>

          <Table
            sx={{
              mt: '10px',
              border: '1px solid #00000024',
              width: '100%',
              '& span.Mui-checked , span.MuiCheckbox-indeterminate': {
                color: '#333 !important ',
              },
              '& *': {
                '& .MuiTableCell-root': {
                  padding: '5px 1px',
                },
              },
            }}
            aria-label="collapsible table"
          >
            <TableHead
              sx={{
                backgroundColor: '#f9f9f9',
                borderRadius: '6px 6px 0 0',
                '& *': { fontWeight: '700 !important' },
              }}
            >
              <TableRow>
                <TableCell align="center" sx={{ minWidth: '30px' }}>
                  STT
                </TableCell>
                <TableCell sx={{ width: '90px' }} align="center">
                  Hình ảnh
                </TableCell>
                <TableCell>Tên món ăn</TableCell>
                <TableCell align="center">Đơn giá</TableCell>
                <TableCell align="center">Đơn vị</TableCell>
                <TableCell sx={{ width: '90px' }} align="center">
                  Ngày tạo
                </TableCell>

                <TableCell sx={{ minWidth: '60px' }} align="center">
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((menu, index) => {
                return <Row imagePath={imagePath} setEdit={setEdit} key={menu.id} menu={menu} STT={index + 1} />;
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
            setAddMenu(false);
            setSideNav(false);
          }}
        />
      )}
      {edit.stt && <EditMenu setEdit={setEdit} edit={edit} />}
      {/* {addMenu && <CreateNewUser setAddMenu={setAddMenu} edit={edit} />} */}
      {addMenu && <CreateNewUser setAddMenu={setAddMenu} edit={edit} />}
      {upload && <FileUpload setUpload={setUpload} menus />}
    </Box>
  );
}
