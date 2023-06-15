import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { MyButton } from '_/components/common';
import { Inner, muiCustomStyles } from '_/components/common/CustomComponents/CustomMui';
import { useAuth } from '_/context/AuthContext';
import { useThemMui } from '_/context/ThemeMuiContext';
import { deleteCatalog, getCatalog } from '_/redux/slices';
import { dateTimeFormate } from '_/utills';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import FileUpload from '../FileUpload';
import CreateNewCatalog from './CreateNewCatalog';
import EditMenu from './EditCatalog';

export default function CatalogManage() {
  const [edit, setEdit] = useState({ stt: false, value: {} });
  const [upload, setUpload] = useState(false);
  const [addCatalog, setAddCatalog] = useState(false);
  const [overLay, setOverLay] = useState(false);
  const [sideNav, setSideNav] = useState(false);
  const [catalogs, setCatalogs] = useState({ items: [], pathImage: '' });
  const dispatch = useDispatch();
  const { setLoading, loading } = useThemMui();
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
  return (
    <Box sx={{ ...muiCustomStyles }}>
      <Box sx={{ pb: '20px', pt: '20px' }}>
        <Box>
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
            <Typography variant="h4">Current catalog list</Typography>{' '}
            <Box sx={{ display: 'flex', gap: '10px' }}>
              <MyButton
                effect
                color={{ mainColor: 'green' }}
                onClick={() => setAddCatalog(true)}
                style={{ padding: '3px 8px' }}
                className="btn"
              >
                Add new catalog
              </MyButton>
              <MyButton
                effect
                color={{ mainColor: 'blue' }}
                onClick={() => setUpload(true)}
                style={{ padding: '3px 8px' }}
                className="btn"
              >
                Import
              </MyButton>{' '}
            </Box>
          </Box>
          <hr style={{ marginTop: '5px', marginBottom: '5px', border: 0, borderTop: '1px solid #000' }} />
          <Box
            sx={{
              borderRadius: '6px 6px 0 0',
              padding: '15px 10px',
              backgroundColor: '#00000005',
              border: '1px solid #0000000a',
              display: 'flex',
              flexDirection: 'row',
              textAlign: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              '& p': {
                flex: 1,
                fontWeight: 700,
              },
            }}
          >
            <Typography sx={{ width: '100px' }} textAlign={'left'}>
              Hình ảnh
            </Typography>
            <Typography textAlign={'center'}>Tên danh mục</Typography>
            <Typography textAlign={'center'}>Create date </Typography>
            <Typography textAlign={'right'}>Action</Typography>
          </Box>
          {items.map((catalog, index) => (
            <Box
              key={index}
              sx={{
                padding: '15px 10px',
                backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff',
                border: '1px solid #0000000a',
                display: 'flex',
                flexDirection: 'row',
                gap: '10px',
                justifyContent: 'space-between',
                '& p': { flex: 1 },
              }}
            >
              <Typography sx={{ width: '100px' }} align="left">
                <img src={imagePath + catalog.thumb_url} alt="Uploaded" width={80} height={60} />
              </Typography>
              <Typography textAlign={'center'}>{catalog.name}</Typography>
              <Typography textAlign={'center'}>{dateTimeFormate(catalog.createdAt)}</Typography>
              <Typography>
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
                    onClick={() => handleDelete()}
                    className={' btn del-btn'}
                    aria-label="delete"
                  >
                    <DeleteIcon className="icon" />
                  </MyButton>
                </Box>
              </Typography>
            </Box>
          ))}
        </Box>
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
