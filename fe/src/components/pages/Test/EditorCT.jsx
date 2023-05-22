import { MyButton } from '_/components/common';
import { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Box } from '@mui/material';
import axios from 'axios';
import { capitalize } from '_/utills';
import Detail from './Detail';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';
import removeVietnameseTones from '_/utills/removeVietnameseTones';

const EditorCT = () => {
    const editorRef = useRef(null);
    const [image, setImage] = useState(null);
    const [menu, setMenu] = useState({
        preView: false,
        name: null,
        slug: null,
        catalog: null,
        catalogSlug: null,
        detail: null,
        price: null,
        unit: null,
        image: null,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData(e.currentTarget);
            const name = removeVietnameseTones(data.get('name')).toLowerCase().replace(/ /g, '-');
            await uploadImage(name).then((res) => {
                const { image_url, thumb_url, poster_url } = res;
                const menuData = {
                    preView: true,
                    name: capitalize(data.get('name')),
                    slug: data.get('name'),
                    catalog: capitalize(data.get('catalog')),
                    catalogSlug: data.get('catalog'),
                    detail: editorRef.current ? editorRef.current.getContent() : '',
                    price: data.get('price'),
                    unit: data.get('unit'),
                    image_url,
                    thumb_url,
                    poster_url,
                };
                setMenu(menuData);
            });
        } catch (error) {}
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

    const handleClearContent = () => {
        setMenu({ ...menu, preView: false });
    };

    console.log({ menu });

    return (
        <Box
            sx={{
                '& .tox': {
                    '& .tox-statusbar': { display: 'none' },
                },
            }}
        >
            <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                        defaultValue={menu.name || ''}
                        size="small"
                        label="Tên món ăn"
                        fullWidth
                        id="name"
                        name="name"
                        autoComplete="name"
                        type=""
                        autoFocus
                    />
                    <MyTextField
                        defaultValue={menu.catalog || ''}
                        size="small"
                        label="catalog"
                        fullWidth
                        id="catalog"
                        name="catalog"
                        autoComplete="catalog"
                        type=""
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
                        defaultValue={menu.price || ''}
                        size="small"
                        label="Đơn giá"
                        fullWidth
                        id="price"
                        name="price"
                        autoComplete="price"
                        type="number"
                        autoFocus
                    />
                    <MyTextField
                        defaultValue={menu.unit || ''}
                        size="small"
                        label="Đơn vị tính"
                        fullWidth
                        id="unit"
                        name="unit"
                        autoComplete="unit"
                        type=""
                    />
                    <MyTextField fullWidth type="file" onChange={handleImageChange} />
                </Box>
                <Editor
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue={menu.detail ? menu.detail : ''}
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
                <Box sx={{ margin: '15px 0', display: 'flex', gap: '10px' }}>
                    <MyButton color={{ bgColor: 'orange' }} type="submit">
                        Lưu
                    </MyButton>
                    <MyButton color={{ bgColor: 'red' }} type="button" onClick={handleClearContent}>
                        Hủy
                    </MyButton>
                </Box>
            </form>
            {menu.preView && (
                <Box sx={{ border: '1px solid #333', padding: '10px' }}>
                    {/* <span> Content of tinymce :</span>
                    <Box>Tên món ăn : {menu.name}</Box>
                    <Box>Catalog : {menu.catalog}</Box>
                    <Box dangerouslySetInnerHTML={{ __html: menu.detail }} /> */}

                    <Detail menu={menu} />
                </Box>
            )}
        </Box>
    );
};

export default EditorCT;

// plugins:
// 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss',
// toolbar:
// 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
