import { Box } from '@mui/material';
import { MyButton } from '_/components/common';
import { capitalize, isEmptyObj } from '_/utills';
import axios from 'axios';
import { useState } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';
import { useAuth } from '_/context/AuthContext';
import { useThemMui } from '_/context/ThemeMuiContext';
import { updateCatalog, updateMenu } from '_/redux/slices';
import removeVietnameseTones from '_/utills/removeVietnameseTones';
import { useDispatch } from 'react-redux';

const EditMenu = ({ edit, setEdit }) => {
    const { value } = edit;
    const { id, name } = value;
    const dispatch = useDispatch();
    const { setLoading } = useThemMui();
    const { setSnackbar } = useAuth();
    const [image, setImage] = useState(null);
    const [catalog, setCatalog] = useState({ name: null, slug: null });
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData(e.currentTarget);
            const name = removeVietnameseTones(data.get('name')).toLowerCase().replace(/ /g, '-');
            await uploadImage(name)
                .then((res) => {
                    const slug = removeVietnameseTones(data.get('name')).toLowerCase().replace(/ /g, '-');
                    const image_url = isEmptyObj(res)
                        ? { image_url: `${slug}.png`, thumb_url: `${slug}-thumb.png`, poster_url: `${slug}-poster.png` }
                        : res;
                    const catalogData = {
                        id,
                        name: capitalize(data.get('name')),
                        slug: removeVietnameseTones(data.get('name')).toLowerCase().replace(/ /g, '-'),

                        ...image_url,
                    };
                    setCatalog(catalogData);
                    return catalogData;
                })
                .then((catalog) => {
                    dispatch(updateCatalog(catalog))
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
                    setLoading(false);
                    setEdit({ stt: false, value: {} });
                    setSnackbar({ open: true, message: 'unknow error', status: 'error' });
                });
        } catch (error) {
            // setLoading(false);
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

    const handleClearContent = () => {
        setCatalog({ ...catalog, preView: false });
    };

    return (
        <Box
            sx={{
                borderRadius: { 768: '10px' },
                padding: '20px 20px 37px',
                maxWidth: '768px',
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
                    <MyTextField
                        defaultValue={catalog.name || name}
                        size="small"
                        label="Tên danh mục"
                        fullWidth
                        id="name"
                        name="name"
                        type=""
                        autoFocus
                        required
                    />

                    <MyTextField fullWidth type="file" onChange={handleImageChange} />
                </Box>

                <Box sx={{ margin: '15px 0', display: 'flex', gap: '10px', justifyContent: 'end' }}>
                    <MyButton color={{ bgColor: 'orange' }} type="submit">
                        Lưu
                    </MyButton>
                    <MyButton color={{ bgColor: 'red' }} type="button" onClick={handleClearContent}>
                        Hủy
                    </MyButton>
                </Box>
            </form>
            {/* {catalog.preView && (
                <Box sx={{ border: '1px solid #333', padding: '10px' }}>
                    <Detail catalog={catalog} />
                </Box>
            )} */}
        </Box>
    );
};

export default EditMenu;
