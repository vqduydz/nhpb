import Box from '@mui/material/Box';
import { unwrapResult } from '@reduxjs/toolkit';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { DropWrapper, MyButton } from '_/components/common';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';
import { useAuth } from '_/context/AuthContext';
import { useThemMui } from '_/context/ThemeMuiContext';
import { updateUser } from '_/redux/slices';
import { capitalize } from '_/utills';

export default function EditUser({ edit, setEdit }) {
  const dispatch = useDispatch();
  const { currentUser, setSnackbar } = useAuth();
  const { setLoading } = useThemMui();
  const { value } = edit;
  const { id, firstName, lastName, phoneNumber, gender, role } = value;
  const [roleSelect, setRoleSelect] = useState(role);
  const [genderSelect, setGenderSelect] = useState(gender);
  const roleList = ['Root', 'Admin', 'Manage', 'Deliver', 'Customer'];
  const genderList = ['Female', 'Male', 'Other'];

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const dataUpdate = {
      id,
      firstName: capitalize(data.get('firstName')),
      lastName: capitalize(data.get('lastName')),
      phoneNumber: data.get('phoneNumber'),
      gender: genderSelect,
      role: roleSelect,
    };

    dispatch(updateUser(dataUpdate))
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
        setSnackbar({ open: true, message, status });
      })
      .catch((e) => {
        console.log(e);
        setEdit({ stt: false, value: {} });
        setSnackbar({ open: true, message: 'unknow error', status: 'error' });
      });
  };

  const checkCurrentRole = (roles = []) => roles.includes(currentUser.role);
  const checkRole = (roles = []) => roles.includes(role);

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
        <form
          onSubmit={handleSubmit}
          style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
          <Box className="inner">
            <MyTextField
              required
              size="small"
              label="First name"
              fullWidth
              name="firstName"
              type=""
              autoFocus
              defaultValue={firstName}
            />
            <MyTextField
              required
              defaultValue={lastName}
              size="small"
              label="Last name"
              fullWidth
              name="lastName"
              type=""
            />
            <MyTextField
              defaultValue={phoneNumber}
              size="small"
              label="Enter Phone Number"
              fullWidth
              name="phoneNumber"
              type="number"
            />
          </Box>
          <Box className="inner">
            <DropWrapper
              droplist={genderList}
              itemSelect={genderSelect}
              setItemSelect={setGenderSelect}
              label="Gender"
            />
            <DropWrapper droplist={roleList} itemSelect={roleSelect} setItemSelect={setRoleSelect} label="Role" />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'end', gap: '5px', '& button': { padding: '3px 15px' } }}>
            <MyButton color={{ bgColor: 'green', mainColor: '#fff' }} type="submit">
              Update
            </MyButton>
            <MyButton
              onClick={() => setEdit({ stt: false, value: {} })}
              type="button"
              color={{ bgColor: '#fe2c55', mainColor: '#fff' }}
            >
              Cancle
            </MyButton>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
