import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { MyButton, PaginationCustom, SearchBox } from '_/components/common';
import { useAuth } from '_/context/AuthContext';
import { useThemMui } from '_/context/ThemeMuiContext';
import useDebounce from '_/hook/useDebounce';
import { deleteCatalog, getCatalog } from '_/redux/slices';
import { dateTimeFormate } from '_/utills';
import removeVietnameseTones from '_/utills/removeVietnameseTones';
import FileUpload from '../FileUpload';
import CreateNewCatalog from './CreateNewCatalog';
import EditMenu from './EditCatalog';

export default function CatalogManage() {
  const [edit, setEdit] = useState({ stt: false, value: {} });
  const [upload, setUpload] = useState(false);
  const [addCatalog, setAddCatalog] = useState(false);
  const [overLay, setOverLay] = useState(false);
  const [page, setPage] = useState(1);
  const [limit_per_page, setlimit_per_page] = useState(20);
  const [catalogs, setCatalogs] = useState({ items: [], imagePath: '', totalPages: 1, limitPerPage: limit_per_page });
  const { loading, setLoading } = useThemMui();
  const dispatch = useDispatch();
  const { setSnackbar } = useAuth();
  const { items, imagePath, totalPages, limitPerPage } = catalogs;
  const [searchValue, setSearchValue] = useState('');
  const debounce = useDebounce(searchValue, 500);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (!addCatalog && !edit.stt) {
      setOverLay(false);
      return;
    }
    setOverLay(true);
  }, [addCatalog, edit?.stt]);

  useEffect(() => {
    const query = !debounce.trim()
      ? { page, limit_per_page }
      : { page, limit_per_page, name: removeVietnameseTones(debounce).toLowerCase().replace(/ /g, '-') };

    if (debounce.trim()) setLoad(true);
    dispatch(getCatalog(query))
      .then(unwrapResult)
      .then((result) => {
        setLoad(false);
        setCatalogs({
          items: result.catalogs,
          imagePath: result.imagePath,
          totalPages: result.totalPages,
          limitPerPage: result.limit_per_page,
        });
      })
      .catch((error) => {
        setLoad(false);
      });
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, page, limit_per_page, debounce]);

  useEffect(() => {
    setPage(1);
  }, [limit_per_page, debounce]);

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
      const { id, name, image_url, createdAt } = item;
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
              gap: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography textAlign={'center'} sx={{ minWidth: '30px' }}>
              {page > 1 ? (page - 1) * limitPerPage + (index + 1) : index + 1}
            </Typography>
            <Box
              sx={{
                backgroundImage: `url(${imagePath}${image_url})`,
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
              gap: '15px',
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
                  fontSize: '2rem !important',
                },
                '* ': {
                  borderRadius: '3px',
                },
              }}
            >
              <MyButton
                effect
                color={{ mainColor: 'orange' }}
                padding={'5px 8px'}
                onClick={() => {
                  setEdit({ stt: true, value: item });
                }}
                aria-label="delete"
                className={'btn edit-btn'}
              >
                <EditIcon className="icon" />
              </MyButton>
              <MyButton
                effect
                color={{ mainColor: '#fe2c55' }}
                padding={'5px 8px'}
                onClick={() => {
                  handleDelete(id);
                }}
                className={'btn del-btn'}
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
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '10px',
          position: 'sticky',
          top: '56px',
          zIndex: 1,
          mb: '1vh',
          backgroundColor: '#fff',
        }}
      >
        <SearchBox
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          loading={load}
          placeholder="Tìm catalog ..."
          handleCreate={setAddCatalog}
          handleImport={setUpload}
        />
      </Box>

      <Box
        sx={{
          padding: '15px 10px',
          backgroundColor: '#f9f9f9',
          border: '1px solid #0000000a',
          display: 'flex',
          justifyContent: 'space-between',
          position: 'sticky',
          top: '96px',
          zIndex: 1,
          '& p': {
            fontWeight: 700,
          },
        }}
      >
        <Box
          sx={{
            gap: '15px',
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
            gap: '15px',
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

      <PaginationCustom
        limit_per_page={limit_per_page}
        setlimit_per_page={setlimit_per_page}
        total_page={totalPages}
        page={page}
        setPage={setPage}
      />

      {(overLay || edit.stt || addCatalog || upload) && (
        <Box sx={{ zIndex: 3, backgroundColor: '#212121', position: 'relative' }}>
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
            />
          )}
          {edit.stt && <EditMenu setEdit={setEdit} edit={edit} />}
          {addCatalog && <CreateNewCatalog setAddCatalog={setAddCatalog} edit={edit} />}
          {upload && <FileUpload setUpload={setUpload} catalogs />}
        </Box>
      )}
    </>
  );
}
