import { Box, Typography } from '@mui/material';
import { MyButton } from '_/components/common';
import { capitalize } from '_/utills';
import axios from 'axios';
import { useState } from 'react';
// import Detail from './Detail';
import { unwrapResult } from '@reduxjs/toolkit';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';
import { useAuth } from '_/context/AuthContext';
import { useThemMui } from '_/context/ThemeMuiContext';
import { createNewCatalog } from '_/redux/slices';
import removeVietnameseTones from '_/utills/removeVietnameseTones';
import { useDispatch } from 'react-redux';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

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
      const name = removeVietnameseTones(data.get('name')).toLowerCase().replace(/ /g, '-');
      await uploadImage(name)
        .then((res) => {
          const menuData = {
            name: capitalize(data.get('name')),
            slug: removeVietnameseTones(data.get('name')).toLowerCase().replace(/ /g, '-'),
            ...res,
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
        '& .btn': {
          marginBottom: '15px',
          padding: '5px',
          width: '100%',
          boxShadow: '0 0 3px 1px #00000012',
          '&:hover': {
            backgroundColor: '#888888',
          },
          span: {
            justifyContent: 'center',
          },
        },

        '& .tox': {
          '& .tox-statusbar': { display: 'none' },
        },
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
            <AddPhotoAlternateIcon fontSize="medium" sx={{ mr: '5px' }} /> Chọn ảnh
          </label>
          <input hidden id="upload-image" name="uploadImage" required type="file" onChange={handleImageChange} />
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
      {/* {menu.preView && (
                <Box sx={{ border: '1px solid #333', padding: '10px' }}>
                    <Detail menu={menu} />
                </Box>
            )} */}
    </Box>
  );
};

export default CreateNewCatalog;
