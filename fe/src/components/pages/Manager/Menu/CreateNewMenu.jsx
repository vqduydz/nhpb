import { Editor, MyButton } from '_/components/common';
import { useRef, useState } from 'react';
import { Box } from '@mui/material';
import axios from 'axios';
import { capitalize } from '_/utills';
// import Detail from './Detail';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';
import removeVietnameseTones from '_/utills/removeVietnameseTones';
import { useDispatch } from 'react-redux';
import { useThemMui } from '_/context/ThemeMuiContext';
import { useAuth } from '_/context/AuthContext';
import { createNewMenu } from '_/redux/slices';
import { unwrapResult } from '@reduxjs/toolkit';

const CreateNewMenu = ({ setAddMenu }) => {
  const dispatch = useDispatch();
  const { setLoading } = useThemMui();
  const { setSnackbar } = useAuth();
  const editorRef = useRef(null);
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData(e.currentTarget);
      const name = removeVietnameseTones(data.get('name')).toLowerCase().replace(/ /g, '-');
      await uploadImage(name)
        .then((res) => {
          const { image_url, thumb_url, poster_url } = res;
          const menuData = {
            name: capitalize(data.get('name')),
            slug: removeVietnameseTones(data.get('name')).toLowerCase().replace(/ /g, '-'),
            catalog: capitalize(data.get('catalog')),
            catalogSlug: removeVietnameseTones(data.get('catalog')).toLowerCase().replace(/ /g, '-'),
            desc: editorRef.current ? editorRef.current.value : '',
            price: data.get('price'),
            unit: data.get('unit'),
            image_url,
            thumb_url,
            poster_url,
          };
          return menuData;
        })
        .then((menu) => {
          dispatch(createNewMenu(menu))
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
        padding: '20px 20px 37px',
        maxWidth: '1440px',
        width: '100%',
        minWidth: '768px',
        margin: '0 auto',
        backgroundColor: '#fff',
        position: 'fixed',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
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
            mb: '15px',
            mt: '15px',
          }}
        >
          <MyTextField size="small" label="Tên món ăn" fullWidth id="name" name="name" type="" autoFocus required />
          <MyTextField size="small" label="catalog" fullWidth id="catalog" name="catalog" type="" required />
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
          <MyTextField required fullWidth type="file" onChange={handleImageChange} />
        </Box>
        <Editor outRef={editorRef} />
        <Box sx={{ margin: '15px 0', display: 'flex', gap: '10px' }}>
          <MyButton color={{ bgColor: 'orange' }} type="submit">
            Lưu
          </MyButton>
          <MyButton color={{ bgColor: 'red' }} type="button" onClick={() => setAddMenu()}>
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

export default CreateNewMenu;
