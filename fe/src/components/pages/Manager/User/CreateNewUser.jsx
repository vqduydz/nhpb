import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { unwrapResult } from '@reduxjs/toolkit';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { DropWrapper, MyButton } from '_/components/common';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';
import { useAuth } from '_/context/AuthContext';
import { useThemMui } from '_/context/ThemeMuiContext';
import { createNewUser } from '_/redux/slices';
import { capitalize } from '_/utills';

export default function CreateNewUser1({ setAddUser }) {
  const dispatch = useDispatch();
  const { setLoading } = useThemMui();
  const { setSnackbar } = useAuth();
  const [notif, setNotif] = useState();
  const [role, setRole] = useState('Customer');
  const [gender, setGender] = useState('Female');
  const roleList = ['Root', 'Admin', 'Manage', 'Deliver', 'Customer'];
  const genderList = ['Female', 'Male', 'Other'];

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
      gender,
      role,
    };

    if (dataUser.password !== dataUser.confirmpassword) {
      setLoading(false);
      setNotif('Password & confirm password not match');
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
          setLoading(false);
          setNotif(e.errorMessage);
        });
  };

  return (
    <Box>
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
        <Typography fontWeight={500} fontSize={'2.4rem'}>
          Create New User
        </Typography>
        <form
          onSubmit={handleSubmit}
          style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
          <Box className="inner">
            <MyTextField
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
              size="small"
              label="Last name"
              required
              fullWidth
              id="lastName"
              name="lastName"
              autoComplete="lastName"
              type=""
            />
          </Box>
          <Box className="inner">
            <MyTextField
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
              size="small"
              label="Enter Phone Number"
              fullWidth
              name="phoneNumber"
              type="number"
              id="phoneNumber"
              autoComplete="phoneNumber"
            />
          </Box>
          <Box className="inner">
            <MyTextField
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
              size="small"
              label="Confirm Password"
              required
              fullWidth
              name="confirmpassword"
              type="password"
              id="confirmpassword"
              autoComplete="current-password"
            />
          </Box>
          {notif ? (
            <Typography lineHeight={'10px'} sx={{ color: 'red', height: '10px', fontSize: '1.4rem' }}>
              {notif}
            </Typography>
          ) : (
            <Typography
              sx={{
                color: 'red',
                height: '10px',
                fontSize: '1.4rem',
                position: 'relative',
                '::after': {
                  display: 'block',
                  position: 'absolute',
                  top: '50%',
                  content: `''`,
                  height: '1px',
                  width: '100%',
                  backgroundColor: '#0000003b',
                },
              }}
            />
          )}
          <Box className="inner" sx={{ justifyContent: 'space-between' }}>
            <DropWrapper droplist={genderList} itemSelect={gender} setItemSelect={setGender} label="Gender" />
            <DropWrapper droplist={roleList} itemSelect={role} setItemSelect={setRole} label="Role" />
            <Box sx={{ display: 'flex', justifyContent: 'end', gap: '5px', '& button': { padding: '3px 15px' } }}>
              <MyButton color={{ bgColor: 'green', mainColor: '#fff' }} type="submit">
                Create
              </MyButton>
              <MyButton onClick={() => setAddUser()} type="button" color={{ bgColor: '#fe2c55', mainColor: '#fff' }}>
                Cancle
              </MyButton>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
