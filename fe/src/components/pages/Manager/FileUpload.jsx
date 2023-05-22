import { Box } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { MyButton } from '_/components/common';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';
import { useThemMui } from '_/context/ThemeMuiContext';
import { importCatalogs, importMenus } from '_/redux/slices';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

const FileUpload = ({ setUpload, menus = false, catalogs = false, users = false }) => {
    const [file, setFile] = useState(null);
    const { setLoading } = useThemMui();
    const dispatch = useDispatch();
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };
    const handleUpload = (e) => {
        setLoading(true);
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        if (menus) {
            dispatch(importMenus(formData))
                .then(unwrapResult)
                .then((result) => {
                    setUpload(false);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log({ error });
                    setUpload(false);
                    setLoading(false);
                });
            return;
        }
        if (catalogs) {
            dispatch(importCatalogs(formData))
                .then(unwrapResult)
                .then((result) => {
                    setUpload(false);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log({ error });
                    setUpload(false);
                    setLoading(false);
                });
            return;
        }
        if (users) {
            dispatch(importMenus(formData))
                .then(unwrapResult)
                .then((result) => {
                    setUpload(false);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log({ error });
                    setUpload(false);
                    setLoading(false);
                });
            return;
        }
    };

    return (
        <Box>
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10pxp',
                    justifyItems: 'center',
                    alignContent: 'center',
                    backgroundColor: '#555',
                    opacity: 0.5,
                }}
                onClick={() => setUpload()}
            />
            <form onSubmit={handleUpload} encType="multipart/form-data">
                <Box
                    sx={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%,-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        justifyItems: 'center',
                        alignContent: 'center',
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '6px',
                    }}
                >
                    <MyTextField type="file" onChange={handleFileChange} />
                    <Box
                        sx={{
                            display: 'flex',
                            // flexDirection: 'column',
                            gap: '10px',
                            justifyContent: 'end',
                        }}
                    >
                        <MyButton type="submit" color={{ bgColor: 'green' }}>
                            Import
                        </MyButton>
                        <MyButton type="button" color={{ bgColor: 'red' }} onClick={() => setUpload()}>
                            Hủy
                        </MyButton>
                    </Box>
                </Box>
            </form>
        </Box>
    );
};

export default FileUpload;
