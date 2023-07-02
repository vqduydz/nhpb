import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { MyButton, PaginationCustom } from '_/components/common';
import { useAuth } from '_/context/AuthContext';
import { useThemMui } from '_/context/ThemeMuiContext';
import { deleteMenu, getCatalog, getMenu } from '_/redux/slices';
import { renderPrice } from '_/utills';
import FileUpload from '../FileUpload';
import { Wrapper } from '../Wrapper';
import CreateNewUser from './CreateNewMenu';
import EditMenu from './EditMenu';
import Preview from './Preview';
import SearchBox from './SearchBox';

export default function MenuManage() {
  const { loading, setLoading } = useThemMui();
  const { setSnackbar } = useAuth();
  const dispatch = useDispatch();
  const [edit, setEdit] = useState({ stt: false, value: {} });
  const [addMenu, setAddMenu] = useState(false);
  const [upload, setUpload] = useState(false);
  const [overLay, setOverLay] = useState(false);
  const [sideNav, setSideNav] = useState(false);
  const [page, setPage] = useState(1);
  const [limit_per_page, setlimit_per_page] = useState(20);
  const [menus, setMenus] = useState({ items: [], pathImage: '', totalPages: 1, limitPerPage: limit_per_page });
  const { items, imagePath, totalPages, limitPerPage } = menus;
  const [preview, setPreview] = useState({ slug: '', open: false });
  const { open, slug } = preview;
  const [catalogs, setCatalogs] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [menusSearch, setMenusSearch] = useState({ items: [], imagePath: '' });

  useEffect(() => {
    if (!sideNav && !addMenu && !edit.stt && !open) {
      setOverLay(false);
      return;
    }
    setOverLay(true);
  }, [addMenu, edit?.stt, sideNav, open]);

  useEffect(() => {
    dispatch(getMenu({ page, limit_per_page }))
      .then(unwrapResult)
      .then((result) => {
        setMenus({
          items: result.menus,
          imagePath: result.imagePath,
          totalPages: result.totalPages,
          limitPerPage: result.limit_per_page,
        });
      })
      .catch((error) => {
        console.log({ error });
      });
    dispatch(getCatalog())
      .then(unwrapResult)
      .then((res) => {
        const catalogs = res.catalogs;
        const cataloglist = catalogs.map((catalog) => catalog.name);
        setCatalogs(cataloglist);
      })
      .catch((error) => {
        console.log({ error });
      });
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, page, limit_per_page]);

  useEffect(() => {
    setPage(1);
  }, [limit_per_page]);

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
      setLoading(false);
      setSnackbar({ open: true, message: 'Cancel delete', status: 'info' });
    }
  };

  const render = () => {
    const menusRender = searchValue ? menusSearch.items : items;
    return menusRender.map((item, index) => {
      const { id, slug, name, catalog, price, unit, image_url } = item;
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
            <MyButton
              onClick={() => {
                setPreview({ slug, open: true });
              }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}
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
  };

  return (
    <Wrapper>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: '10px',
          padding: '0 10px',
          '& .btn': {
            fontSize: '1.2rem',
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
            padding={'3px 8px'}
            className="btn"
          >
            Tạo mới
          </MyButton>
          <MyButton
            effect
            color={{ mainColor: 'blue' }}
            onClick={() => setUpload(true)}
            padding={'3px 8px'}
            className="btn"
          >
            Import
          </MyButton>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'start',
          borderRadius: '6px',
          border: '1px solid #f7d800',
          width: '100%',
          position: 'sticky',
          top: '107px',
          zIndex: '2',
          mb: '1vh',
        }}
      >
        <SearchBox
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          menusSearch={menusSearch}
          setMenusSearch={setMenusSearch}
        />
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

      {!searchValue && (
        <Box sx={{ padding: '10px', display: 'flex', justifyContent: 'center' }}>
          <PaginationCustom
            limit_per_page={limit_per_page}
            setlimit_per_page={setlimit_per_page}
            total_page={totalPages}
            page={page}
            setPage={setPage}
          />
        </Box>
      )}

      {(overLay || edit.stt || addMenu || upload || open) && (
        <Box sx={{ zIndex: 3, backgroundColor: '#212121', position: 'relative' }}>
          {overLay && (
            <Box
              sx={{
                // display: { 0: 'block', 768: 'none'},
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
                setPreview({ ...preview, open: false });
                setEdit(false);
                setAddMenu(false);
                setSideNav(false);
              }}
            />
          )}
          {open && <Preview slug={slug} setPreview={setPreview} />}
          {edit.stt && <EditMenu cataloglist={catalogs} setEdit={setEdit} edit={edit} />}
          {addMenu && <CreateNewUser cataloglist={catalogs} setAddMenu={setAddMenu} edit={edit} />}
          {upload && <FileUpload setUpload={setUpload} menus />}
        </Box>
      )}
    </Wrapper>
  );
}
