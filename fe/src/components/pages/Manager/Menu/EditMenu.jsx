import { Box } from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import { MyButton } from '_/components/common';
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
                    const menuData = {
                        id,
                        name: capitalize(data.get('name')),
                        slug: removeVietnameseTones(data.get('name')).toLowerCase().replace(/ /g, '-'),
                        catalog: capitalize(data.get('catalog')),
                        catalogSlug: removeVietnameseTones(data.get('catalog')).toLowerCase().replace(/ /g, '-'),
                        desc: editorRef.current ? editorRef.current.getContent() : '',
                        price: data.get('price'),
                        unit: capitalize(data.get('unit')),
                        ...res,
                    };
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
        setMenu({ ...menu, preView: false });
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
                    <MyTextField fullWidth type="file" onChange={handleImageChange} />
                </Box>
                <Editor
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue={menu.desc ? menu.desc : desc}
                    init={{
                        placeholder: 'Mô tả...',
                        height: '400px',
                        selector: 'textarea',
                        plugins:
                            'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss',
                        toolbar:
                            'undo redo | blocks fontsize | bold italic underline  | link image media table  |  align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                        tinycomments_mode: 'embedded',
                        tinycomments_author: 'Author name',
                        mergetags_list: [
                            { value: 'First.Name', title: 'First Name' },
                            { value: 'Email', title: 'Email' },
                        ],
                        // image_title: true,
                        // automatic_uploads: true,
                        // file_picker_types: 'image',
                        // file_picker_callback: function (cb, value, meta) {
                        //     var input = document.createElement('input');
                        //     input.setAttribute('type', 'file');
                        //     input.setAttribute('accept', 'image/*');
                        //     var url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
                        //     var xhr = new XMLHttpRequest();
                        //     var fd = new FormData();
                        //     xhr.open('POST', url, true);

                        //     input.onchange = function () {
                        //         var file = this.files[0];
                        //         var reader = new FileReader();
                        //         xhr.onload = function () {
                        //             if (xhr.readyState === 4 && xhr.status === 200) {
                        //                 // File uploaded successfully
                        //                 var response = JSON.parse(xhr.responseText);

                        //                 // https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg
                        //                 var url = response.secure_url;
                        //                 // console.log(url)
                        //                 // Create a thumbnail of the uploaded image, with 150px width
                        //                 cb(url, { title: response.original_filename });
                        //             }
                        //         };

                        //         reader.onload = function () {
                        //             var id = 'blobid' + new Date().getTime();
                        //             var blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
                        //             var base64 = reader.result.split(',')[1];

                        //             var blobInfo = blobCache.create(id, file, base64);
                        //             blobCache.add(blobInfo);

                        //             // call the callback and populate the Title field with the file name

                        //             fd.append('upload_preset', unsignedUploadPreset);
                        //             fd.append('tags', 'browser_upload');
                        //             fd.append('file', blobInfo.blob(), blobInfo.filename());

                        //             xhr.send(fd);
                        //         };

                        //         reader.readAsDataURL(file);
                        //     };

                        //     input.click();
                        // },
                        // images_upload_handler: (blobInfo, success, failure) => {
                        //     let data = new FormData();
                        //     var reader = new FileReader();
                        //     // var file = this.files[0];
                        //     var url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
                        //     data.append('file', blobInfo.blob(), blobInfo.filename());
                        //     data.append('upload_preset', unsignedUploadPreset);
                        //     data.append('tags', 'browser_upload');
                        //     axios
                        //         .post(url, data)
                        //         .then(function (res) {
                        //             success(res.data.secure_url);
                        //         })
                        //         .catch(function (err) {
                        //             console.log(err);
                        //         });
                        //     reader.readAsDataURL(blobInfo.blob());
                        // },
                    }}
                />
                <Box sx={{ margin: '15px 0', display: 'flex', gap: '10px', justifyContent: 'end' }}>
                    <MyButton color={{ bgColor: 'orange' }} type="submit">
                        Lưu
                    </MyButton>
                    <MyButton color={{ bgColor: 'red' }} type="button" onClick={handleClearContent}>
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
