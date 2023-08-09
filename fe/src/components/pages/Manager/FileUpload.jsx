import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Box, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { MyButton } from '_/components/common';
import { useThemMui } from '_/context/ThemeMuiContext';
import { importCatalogs, importMenus, importUsers } from '_/redux/slices';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

const FileUpload = ({ setUpload, menus = false, catalogs = false, users = false }) => {
  console.log(users);
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
      dispatch(importUsers(formData))
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
          <label
            style={{
              border: '1px solid #0000003b',
              borderRadius: '3px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              padding: '5px',
            }}
            htmlFor="upload-file"
          >
            <input
              hidden
              id="upload-file"
              type="file"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileChange}
            />
            {file ? (
              <Typography> {file?.name} </Typography>
            ) : (
              <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                <AttachFileIcon fontSize="medium" sx={{ mr: '5px' }} /> Chọn file
              </Typography>
            )}
          </label>
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
