import {
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import { unwrapResult } from '@reduxjs/toolkit';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { MyButton } from '_/components/common';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';
import { useThemMui } from '_/context/ThemeMuiContext';
import { createNewUser } from '_/redux/slices';
import { capitalize } from '_/utills';
import { useAuth } from '_/context/AuthContext';

export default function CreateNewUser1({ setAddUser }) {
  const dispatch = useDispatch();
  const { setLoading } = useThemMui();
  const { setSnackbar } = useAuth();
  const [notif, setNotif] = useState();
  const handleSubmit = async (event) => {
    setNotif();
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const dataUser = {
      firstName: capitalize(data.get('firstName')),
      lastName: capitalize(data.get('lastName')),
      email: data.get('email'),
      password: data.get('password'),
      confirmpassword: data.get('confirmpassword'),
      phoneNumber: data.get('phoneNumber'),
      address: data.get('address'),
      gender: data.get('gender'),
      role: data.get('role'),
    };

    if (dataUser.password !== dataUser.confirmpassword) {
      setSnackbar({ open: true, message: 'Password & confirmpassword not match', status: 'error' });
      setLoading(false);
      return;
    } else
      dispatch(createNewUser(dataUser))
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
            setAddUser();
          }
          setSnackbar({ open: true, message, status });
        })
        .catch((e) => {
          setAddUser();
          setSnackbar({ open: true, message: 'unknow error', status: 'error' });
        });
  };

  return (
    <Box>
      <Box
        sx={{
          borderRadius: { 768: '10px' },
          padding: '20px 20px 37px',
          maxWidth: { 768: '350px' },
          width: '100%',
          minWidth: '300px',
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
        }}
      >
        <Typography sx={{ fontWeight: 'bold' }} status="h4">
          Create New User
        </Typography>
        <form onSubmit={handleSubmit}>
          <MyTextField
            sx={{ marginTop: '15px' }}
            size="small"
            label="First name"
            required
            fullWidth
            id="firstName"
            name="firstName"
            autoComplete="firstName"
            type=""
            autoFocus
          />
          <MyTextField
            sx={{ marginTop: '15px' }}
            size="small"
            label="Last name"
            required
            fullWidth
            id="lastName"
            name="lastName"
            autoComplete="lastName"
            type=""
          />
          <MyTextField
            sx={{ marginTop: '15px' }}
            size="small"
            label="Enter Email"
            required
            fullWidth
            id="email"
            name="email"
            autoComplete="email"
            type="email"
          />
          <MyTextField
            sx={{ marginTop: '15px' }}
            size="small"
            label="Enter Password"
            required
            fullWidth
            name="password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <MyTextField
            sx={{ marginTop: '15px' }}
            size="small"
            label="Confirm Password"
            required
            fullWidth
            name="confirmpassword"
            type="password"
            id="confirmpassword"
            autoComplete="current-password"
          />
          <Box sx={{ height: '1.3rem', marginTop: '1vh', display: 'flex', alignItems: 'end' }}>
            {notif ? (
              <Typography sx={{ color: 'red', height: '100%', fontSize: '1.2rem' }} status="body2">
                {notif}
              </Typography>
            ) : (
              <Box sx={{ width: '100%', height: '1px', borderTop: '1px solid #f1f1f1' }} />
            )}
          </Box>
          <MyTextField
            sx={{ marginTop: '15px' }}
            size="small"
            label="Enter Phone Number"
            fullWidth
            name="phoneNumber"
            type="number"
            id="phoneNumber"
            autoComplete="phoneNumber"
          />
          <MyTextField
            sx={{ margin: '15px 0' }}
            size="small"
            label="Enter address"
            fullWidth
            name="address"
            type=""
            id="address"
            autoComplete="address"
          />
          <FormLabel id="gender">Gender</FormLabel>
          <RadioGroup defaultValue="Female" row aria-labelledby="gender" name="gender">
            <FormControlLabel value="Female" control={<Radio />} label="Female" />
            <FormControlLabel value="Male" control={<Radio />} label="Male" />
            <FormControlLabel value="Other" control={<Radio />} label="Other" />
          </RadioGroup>
          <InputLabel id="role">Role</InputLabel>
          <Select
            labelId="role"
            id="role"
            required
            sx={{ width: '100%' }}
            size="small"
            name="role"
            defaultValue="Doctor"
          >
            <MenuItem value="Root">Root</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Doctor">Doctor</MenuItem>
            <MenuItem value="UserManage">User Manage</MenuItem>
            <MenuItem value="ContentManage">Content Manage</MenuItem>
            <MenuItem value="OrdersManage">Order Manage</MenuItem>
          </Select>

          <MyButton effect color={{ mainColor: 'green' }} style={{ width: '100%', marginTop: '10px' }} type="submit">
            Create
          </MyButton>
        </form>
      </Box>
    </Box>
  );
}
