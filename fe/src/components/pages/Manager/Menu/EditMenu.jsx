import { Box } from '@mui/material';
import { Editor, MyButton } from '_/components/common';
import { capitalize } from '_/utills';
import axios from 'axios';
import { useRef, useState } from 'react';
// import Detail from './Detail';
import { unwrapResult } from '@reduxjs/toolkit';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';
import { useAuth } from '_/context/AuthContext';
import { useThemMui } from '_/context/ThemeMuiContext';
import { updateMenu } from '_/redux/slices';
import removeVietnameseTones from '_/utills/removeVietnameseTones';
import { useDispatch } from 'react-redux';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const EditMenu = ({ edit, setEdit }) => {
  const { value } = edit;
  const { id, name, catalog, price, unit, desc } = value;
  const dispatch = useDispatch();
  const { setLoading } = useThemMui();
  const { setSnackbar } = useAuth();
  const editorRef = useRef(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData(e.currentTarget);
      const name = removeVietnameseTones(data.get('name')).toLowerCase().replace(/ /g, '-');
      await uploadImage(name)
        .then((res) => {
          console.log({ res });
          const menuData =
            //  !editorRef.current.value
            //   ?
            {
              id,
              name: capitalize(data.get('name')),
              slug: removeVietnameseTones(data.get('name')).toLowerCase().replace(/ /g, '-'),
              catalog: capitalize(data.get('catalog')),
              catalogSlug: removeVietnameseTones(data.get('catalog')).toLowerCase().replace(/ /g, '-'),
              price: data.get('price'),
              unit: capitalize(data.get('unit')),
              ...res,
            };
          // : {
          //     id,
          //     name: capitalize(data.get('name')),
          //     slug: removeVietnameseTones(data.get('name')).toLowerCase().replace(/ /g, '-'),
          //     catalog: capitalize(data.get('catalog')),
          //     catalogSlug: removeVietnameseTones(data.get('catalog')).toLowerCase().replace(/ /g, '-'),
          //     desc: editorRef.current.value,
          //     price: data.get('price'),
          //     unit: capitalize(data.get('unit')),
          //     ...res,
          //   };
          setMenu(menuData);
          return menuData;
        })
        .then((menu) => {
          dispatch(updateMenu(menu))
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
          <MyTextField
            defaultValue={menu.catalog || catalog}
            size="small"
            label="catalog"
            fullWidth
            id="catalog"
            name="catalog"
            type=""
            required
          />
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
            autoFocus
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
          <input hidden id="upload-image" name="uploadImage" type="file" onChange={handleImageChange} />
        </Box>
        {/* <Editor outRef={editorRef} sx={{ height: '200px' }} /> */}
        <Box sx={{ margin: '15px 0', display: 'flex', gap: '10px', justifyContent: 'end' }}>
          <MyButton color={{ bgColor: 'orange' }} type="submit">
            Lưu
          </MyButton>
          <MyButton color={{ bgColor: 'red' }} type="button" onClick={handleCancle}>
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

export default EditMenu;
