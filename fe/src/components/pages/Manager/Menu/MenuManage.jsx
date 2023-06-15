import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { MyButton } from '_/components/common';
import { useAuth } from '_/context/AuthContext';
import { useThemMui } from '_/context/ThemeMuiContext';
import { deleteMenu, getMenu } from '_/redux/slices';
import { renderPrice } from '_/utills';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import FileUpload from '../FileUpload';
import CreateNewUser from './CreateNewMenu';
import EditMenu from './EditMenu';

export default function MenuManage() {
  const [edit, setEdit] = useState({ stt: false, value: {} });
  const { setLoading } = useThemMui();
  const { setSnackbar } = useAuth();
  const [addMenu, setAddMenu] = useState(false);
  const [upload, setUpload] = useState(false);
  const [overLay, setOverLay] = useState(false);
  const [sideNav, setSideNav] = useState(false);
  const [menus, setMenus] = useState({ items: [], pathImage: '' });
  const { loading } = useThemMui();
  const dispatch = useDispatch();
  const { items, imagePath } = menus;

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
        setMenus({ items: result.menus, imagePath: result.imagePath });
      })
      .catch((error) => {
        console.log({ error });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const handleDelete = (id) => {
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

  const render = () =>
    items.map((item, index) => {
      const { id, slug, name, catalog, price, unit, thumb_url } = item;
      return (
        <Box
          key={index}
          sx={{
            display: 'flex',
            padding: '10px',
            backgroundColor: index % 2 === 0 ? '#fff' : '#f5f5f5',
            border: '1px solid #0000000a',
            justifyContent: 'space-between',
            '& p': {
              fontWeight: 500,
            },
          }}
        >
          <Box
            sx={{
              gap: '10px',
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography sx={{ minWidth: '30px' }} textAlign={'center'}>
              {index + 1}
            </Typography>
            <Box
              sx={{
                backgroundImage: `url(${imagePath}${thumb_url})`,
                minWidth: '80px',
                height: '60px',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
              }}
            />
            <MyButton
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}
              to={`/mon-an/${slug}`}
              text
            >
              <Typography fontSize={'1.6rem'} sx={{ textAlign: 'left' }}>
                {name}
              </Typography>
              <Typography fontStyle={'italic'} color={'#fe2c55'} fontSize={'1.2rem'} sx={{ textAlign: 'left' }}>
                {catalog}
              </Typography>
            </MyButton>
          </Box>
          <Box
            sx={{
              gap: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography sx={{ minWidth: '100px' }} textAlign={'center'} color={'#fe2c55'}>
              {renderPrice(price)}
            </Typography>
            <Typography sx={{ minWidth: '80px' }} textAlign={'center'}>
              {unit}
            </Typography>
            <Box
              justifyContent={'end'}
              sx={{
                width: '100px',
                display: 'flex',
                gap: '5px',
                justifyContent: 'center',
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
                  setEdit({ stt: true, value: item });
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
                onClick={() => {
                  handleDelete(id);
                }}
                className={' btn del-btn'}
                aria-label="delete"
              >
                <DeleteIcon className="icon" />
              </MyButton>
            </Box>
          </Box>
        </Box>
      );
    });

  return (
    <Box
      sx={{
        pt: '10px',
        border: '1px solid #0000000a',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: '10px',
          padding: '0 10px',
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
      <Box
        sx={{
          padding: '15px 10px',
          backgroundColor: '#00000005',
          border: '1px solid #0000000a',
          display: 'flex',
          justifyContent: 'space-between',
          '& p': {
            fontWeight: 700,
          },
        }}
      >
        <Box
          sx={{
            gap: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography sx={{ minWidth: '30px' }} textAlign={'center'}>
            STT
          </Typography>
          <Typography sx={{ minWidth: '80px' }} textAlign={'center'}>
            Hình ảnh
          </Typography>
          <Typography textAlign={'center'}>Tên món ăn</Typography>
        </Box>
        <Box
          sx={{
            gap: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography sx={{ minWidth: '100px' }} textAlign={'center'}>
            Đơn giá
          </Typography>
          <Typography sx={{ minWidth: '80px' }} textAlign={'center'}>
            Đơn vị tính
          </Typography>
          <Typography sx={{ minWidth: '100px' }} textAlign={'right'}>
            Hành động
          </Typography>
        </Box>
      </Box>

      {render()}
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
      {addMenu && <CreateNewUser setAddMenu={setAddMenu} edit={edit} />}
      {upload && <FileUpload setUpload={setUpload} menus />}
    </Box>
  );
}
