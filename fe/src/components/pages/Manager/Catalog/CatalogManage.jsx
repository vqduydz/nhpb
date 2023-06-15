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
import { useThemMui } from '_/context/ThemeMuiContext';
import { deleteCatalog, getCatalog } from '_/redux/slices';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CreateNewCatalog from './CreateNewCatalog';
import EditMenu from './EditCatalog';
import Row from './Row';
import FileUpload from '../FileUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '_/context/AuthContext';
import { dateTimeFormate } from '_/utills';

export default function CatalogManage() {
  const [edit, setEdit] = useState({ stt: false, value: {} });
  const [upload, setUpload] = useState(false);
  const [addCatalog, setAddCatalog] = useState(false);
  const [overLay, setOverLay] = useState(false);
  const [sideNav, setSideNav] = useState(false);
  const [catalogs, setCatalogs] = useState({ items: [], pathImage: '' });
  const { loading, setLoading } = useThemMui();
  const dispatch = useDispatch();
  const { setSnackbar } = useAuth();
  const { items, imagePath } = catalogs;
  useEffect(() => {
    if (!sideNav && !addCatalog && !edit.stt) {
      setOverLay(false);
      return;
    }
    setOverLay(true);
  }, [addCatalog, edit?.stt, sideNav]);

  useEffect(() => {
    dispatch(getCatalog())
      .then(unwrapResult)
      .then((result) => {
        setCatalogs({ items: result.catalogsWithMenus, imagePath: result.imagePath });
      })
      .catch((error) => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);
  const handleDelete = (id) => {
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

  const render = () =>
    items.map((item, index) => {
      const { id, slug, name, catalog, price, unit, thumb_url, createdAt } = item;
      return (
        <Box
          key={index}
          sx={{
            display: 'flex',
            padding: '10px',
            backgroundColor: index % 2 === 0 ? '#fff' : '#f5f5f5',
            border: '1px solid #0000000a',
            justifyContent: 'space-between',
            alignItems: 'center',
            '& p': {
              fontWeight: 500,
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
            <Typography textAlign={'center'} sx={{ minWidth: '30px' }}>
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
            <Typography color={'#337ab7'} fontSize={'1.6rem'}>
              {name}
            </Typography>
          </Box>
          <Box
            sx={{
              gap: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography textAlign={'center'} width={'200px'} fontSize={'1.6rem'}>
              {dateTimeFormate(createdAt)}
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
          Danh sách danh mục
        </Typography>
        <Box sx={{ display: 'flex', gap: '10px' }}>
          <MyButton
            effect
            color={{ mainColor: 'green' }}
            onClick={() => setAddCatalog(true)}
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
          <Typography textAlign={'center'} sx={{ minWidth: '30px' }}>
            STT
          </Typography>
          <Typography sx={{ minWidth: '80px' }}>Hình ảnh</Typography>
          <Typography>Tên danh mục</Typography>
        </Box>
        <Box
          sx={{
            gap: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography textAlign={'center'} width={'200px'}>
            Ngày tạo
          </Typography>
          <Typography sx={{ minWidth: '100px' }}>Hành động</Typography>
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
            setAddCatalog(false);
            setSideNav(false);
          }}
        />
      )}
      {edit.stt && <EditMenu setEdit={setEdit} edit={edit} />}
      {addCatalog && <CreateNewCatalog setAddCatalog={setAddCatalog} edit={edit} />}
      {upload && <FileUpload setUpload={setUpload} catalogs />}
    </Box>
  );
}
