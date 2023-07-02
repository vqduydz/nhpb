import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Box, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import axios from 'axios';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { MyButton } from '_/components/common';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';
import { useAuth } from '_/context/AuthContext';
import { useThemMui } from '_/context/ThemeMuiContext';
import { createNewMenu } from '_/redux/slices';
import { capitalize } from '_/utills';
import removeVietnameseTones from '_/utills/removeVietnameseTones';
import CatalogDrop from './CatalogDrop';

const CreateNewMenu = ({ setAddMenu, cataloglist }) => {
  const dispatch = useDispatch();
  const { setLoading } = useThemMui();
  const { setSnackbar } = useAuth();
  const editorRef = useRef(null);
  const [image, setImage] = useState(null);
  const [catalog, setCatalog] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!image) {
      setLoading(false);
      alert('Vui lòng chọn hình ảnh.');
      return;
    }
    if (!catalog.trim()) {
      setLoading(false);
      alert('Vui lòng chọn catalog.');
      return;
    }
    try {
      const data = new FormData(e.currentTarget);
      const slug = removeVietnameseTones(data.get('name')).toLowerCase().replace(/ /g, '-');

      await uploadImage(slug)
        .then((image_url) => {
          const menuData = {
            name: capitalize(data.get('name')),
            slug,
            catalog: capitalize(data.get('catalog')),
            catalogSlug: removeVietnameseTones(data.get('catalog')).toLowerCase().replace(/ /g, '-'),
            desc: editorRef.current ? editorRef.current.value : '',
            price: data.get('price'),
            unit: data.get('unit'),
            image_url,
          };
          dispatch(createNewMenu(menuData))
            .then(unwrapResult)
            .then((result) => {
              setLoading(false);
              let message, status;
              if (result.error) {
                message = result.error;
                status = 'error';
              } else {
                message = result.message;
                status = 'success';
                setAddMenu();
              }
              setLoading(false);
              setSnackbar({ open: true, message, status });
            })
            .catch((e) => {
              setLoading(false);
              setAddMenu();
              setSnackbar({ open: true, message: 'unknow error', status: 'error' });
            });
        })
        .catch((e) => {
          setLoading(false);
          setAddMenu();
          setSnackbar({ open: true, message: 'unknow error', status: 'error' });
        });
    } catch (error) {
      setLoading(false);
    }
  };
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const uploadImage = async (slug) => {
    try {
      const formData = new FormData();
      formData.append('image', image, slug);
      const url = `${process.env.REACT_APP_API_ENDPOINT}/upload`;
      const response = await axios.post(url, formData);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        borderRadius: { 768: '10px' },
        padding: '20px',
        maxWidth: '768px',
        width: '100%',
        minWidth: '480px',
        margin: '0 auto',
        backgroundColor: '#fff',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        boxShadow: '0 0 10px 5px #00000012',
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            mb: '15px',
            mt: '15px',
          }}
        >
          <MyTextField size="small" label="Tên món ăn" fullWidth id="name" name="name" type="" autoFocus required />
          <CatalogDrop cataloglist={cataloglist} catalog={catalog} setCatalog={setCatalog} />
        </Box>
        <Box
          sx={{
            mb: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <MyTextField size="small" label="Đơn giá" fullWidth id="price" name="price" type="number" required />
          <MyTextField size="small" label="Đơn vị tính" fullWidth id="unit" name="unit" required type="" />
          <label
            style={{
              border: '1px solid #0000003b',
              borderRadius: '3px',
              cursor: 'pointer',
              minWidth: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              padding: '5px',
            }}
            htmlFor="upload-image"
          >
            <input hidden id="upload-image" type="file" accept="image/*" onChange={handleImageChange} />
            {image ? (
              <Typography> {image?.name} </Typography>
            ) : (
              <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                <AddPhotoAlternateIcon fontSize="medium" sx={{ mr: '5px' }} /> Chọn ảnh
              </Typography>
            )}
          </label>
        </Box>
        <Box sx={{ margin: '15px 0', display: 'flex', gap: '10px', justifyContent: 'end' }}>
          <MyButton color={{ bgColor: 'orange' }} type="submit">
            Lưu
          </MyButton>
          <MyButton color={{ bgColor: 'red' }} type="button" onClick={() => setAddMenu()}>
            Hủy
          </MyButton>
        </Box>
      </form>
    </Box>
  );
};

export default CreateNewMenu;
