import { Box, Typography } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
// import Detail from './Detail';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { MyButton } from '_/components/common';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';
import { useAuth } from '_/context/AuthContext';
import { useThemMui } from '_/context/ThemeMuiContext';
import { createNewCatalog } from '_/redux/slices';
import { capitalize } from '_/utills';
import removeVietnameseTones from '_/utills/removeVietnameseTones';

const CreateNewCatalog = ({ setAddCatalog }) => {
  const dispatch = useDispatch();
  const { setLoading } = useThemMui();
  const { setSnackbar } = useAuth();
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData(e.currentTarget);
      const slug = removeVietnameseTones(data.get('name')).toLowerCase().replace(/ /g, '-');
      await uploadImage(slug)
        .then((image_url) => {
          const menuData = {
            name: capitalize(data.get('name')),
            slug,
            image_url,
          };
          return menuData;
        })
        .then((menu) => {
          dispatch(createNewCatalog(menu))
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
                setAddCatalog();
              }
              setLoading(false);
              setSnackbar({ open: true, message, status });
            })
            .catch((e) => {
              setLoading(false);
              setAddCatalog();
              setSnackbar({ open: true, message: 'unknow error', status: 'error' });
            });
        })
        .catch((e) => {
          setLoading(false);
          setAddCatalog();
          setSnackbar({ open: true, message: 'unknow error', status: 'error' });
        });
    } catch (error) {
      setLoading(false);
    }
  };
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const uploadImage = async (name) => {
    try {
      const formData = new FormData();
      formData.append('image', image, name);
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
        borderRadius: '6px',
        padding: '20px',
        width: '680px',
        margin: '0 auto',
        backgroundColor: '#fff',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        '& .inner': { display: 'flex', gap: '10px' },
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            mt: '15px',
          }}
        >
          <MyTextField size="small" label="Tên danh mục" id="name" fullWidth name="name" type="" autoFocus required />

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
            <input hidden id="upload-image" name="uploadImage" required type="file" onChange={handleImageChange} />
            {image ? (
              <Typography> {image?.name} </Typography>
            ) : (
              <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                <AddPhotoAlternateIcon fontSize="medium" sx={{ mr: '5px' }} /> Chọn ảnh
              </Typography>
            )}
          </label>
        </Box>

        <Box sx={{ mt: '15px', display: 'flex', gap: '10px', justifyContent: 'end' }}>
          <MyButton color={{ bgColor: 'orange' }} type="submit">
            Lưu
          </MyButton>
          <MyButton color={{ bgColor: 'red' }} type="button" onClick={() => setAddCatalog()}>
            Hủy
          </MyButton>
        </Box>
      </form>
    </Box>
  );
};

export default CreateNewCatalog;
