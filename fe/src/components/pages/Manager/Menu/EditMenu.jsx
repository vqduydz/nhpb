import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Box, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import axios from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { MyButton } from '_/components/common';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';
import { useAuth } from '_/context/AuthContext';
import { useThemMui } from '_/context/ThemeMuiContext';
import { updateMenu } from '_/redux/slices';
import { capitalize } from '_/utills';
import removeVietnameseTones from '_/utills/removeVietnameseTones';
import CatalogDrop from './CatalogDrop';

const EditMenu = ({ edit, setEdit, cataloglist }) => {
  const { value } = edit;
  const { id, name, price, unit, max_order } = value;
  const dispatch = useDispatch();
  const { setLoading } = useThemMui();
  const { setSnackbar } = useAuth();
  const [image, setImage] = useState(null);
  const [menu, setMenu] = useState({
    name: null,
    slug: null,
    catalog: null,
    catalogSlug: null,
    desc: null,
    price: null,
    unit: null,
    image: null,
  });
  const [catalog, setCatalog] = useState(value.catalog);

  const handleUpdateMenu = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData(e.currentTarget);
      const slug = removeVietnameseTones(data.get('name')).toLowerCase().replace(/ /g, '-');
      await uploadImage(slug)
        .then((res) => {
          const image_url = `${slug}.png`;
          const menuData = {
            id,
            name: capitalize(data.get('name')),
            slug,
            catalog: capitalize(data.get('catalog')),
            catalogSlug: removeVietnameseTones(data.get('catalog')).toLowerCase().replace(/ /g, '-'),
            price: data.get('price'),
            max_order: data.get('max_order'),
            unit: capitalize(data.get('unit')),
            image_url,
          };
          setMenu(menuData);
          dispatch(updateMenu(menuData))
            .then(unwrapResult)
            .then((result) => {
              let message, status;
              if (result.error) {
                message = result.error;
                status = 'error';
              } else {
                message = result.message;
                status = 'success';
                setEdit({ stt: false, value: {} });
              }
              setLoading(false);
              setSnackbar({ open: true, message, status });
            })
            .catch((e) => {
              setLoading(false);
              setEdit({ stt: false, value: {} });
              setSnackbar({ open: true, message: 'unknow error', status: 'error' });
            });
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
          setEdit({ stt: false, value: {} });
          setSnackbar({ open: true, message: 'unknow error', status: 'error' });
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const uploadImage = async (name) => {
    try {
      if (!image) return {};
      const formData = new FormData();
      formData.append('image', image, name);
      const url = `${process.env.REACT_APP_API_ENDPOINT}/upload`;
      const response = await axios.post(url, formData);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancle = () => {
    setEdit({ stt: false, value: {} });
    setMenu({ ...menu, preView: false });
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
      <form onSubmit={handleUpdateMenu}>
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
          <MyTextField
            defaultValue={menu.name || name}
            size="small"
            label="Tên món ăn"
            fullWidth
            id="name"
            name="name"
            type=""
            autoFocus
            required
          />
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
          <MyTextField
            defaultValue={menu.price || price}
            size="small"
            label="Đơn giá"
            fullWidth
            id="price"
            name="price"
            type="number"
            required
          />
          <MyTextField
            defaultValue={menu.unit || unit}
            size="small"
            label="Đơn vị tính"
            fullWidth
            id="unit"
            name="unit"
            required
            type=""
          />
          <MyTextField
            defaultValue={menu.max_order || max_order}
            size="small"
            label="SL đặt tối đa"
            fullWidth
            id="max_order"
            name="max_order"
            required
            type="number"
          />
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
          <MyButton color={{ bgColor: 'red' }} type="button" onClick={handleCancle}>
            Hủy
          </MyButton>
        </Box>
      </form>
    </Box>
  );
};

export default EditMenu;
