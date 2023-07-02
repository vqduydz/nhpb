import { FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select } from '@mui/material';
import Box from '@mui/material/Box';
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { MyButton } from '_/components/common';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';
import { useAuth } from '_/context/AuthContext';
import { useThemMui } from '_/context/ThemeMuiContext';
import { updateUser } from '_/redux/slices';
import { capitalize } from '_/utills';

export default function EditUser({ edit, setEdit }) {
  const dispatch = useDispatch();
  const { currentUser, setSnackbar } = useAuth();
  const { value } = edit;
  const { id, firstName, lastName, phoneNumber, address, gender, role } = value;
  const { setLoading } = useThemMui();
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const dataUpdate = {
      id,
      firstName: capitalize(data.get('firstName')),
      lastName: capitalize(data.get('lastName')),
      phoneNumber: data.get('phoneNumber'),
      gender: data.get('gender'),
      address: data.get('address'),
      role: role === 'Root' ? 'Root' : data.get('role'),
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
          borderRadius: { 768: '10px' },
          padding: '55px 20px 37px',
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
        <form onSubmit={handleSubmit}>
          <MyTextField
            required
            sx={{ marginBottom: '2vh' }}
            size="small"
            label="First name"
            fullWidth
            id="firstName"
            name="firstName"
            autoComplete="firstName"
            type=""
            autoFocus
            defaultValue={firstName}
          />
          <MyTextField
            required
            defaultValue={lastName}
            sx={{ marginBottom: '2vh' }}
            size="small"
            label="Last name"
            fullWidth
            id="lastName"
            name="lastName"
            autoComplete="lastName"
            type=""
          />
          <MyTextField
            defaultValue={phoneNumber}
            sx={{ marginBottom: '2vh' }}
            size="small"
            label="Enter Phone Number"
            fullWidth
            name="phoneNumber"
            type="number"
            id="phoneNumber"
            autoComplete="phoneNumber"
          />
          <MyTextField
            defaultValue={address}
            sx={{ marginBottom: '2vh' }}
            size="small"
            label="Enter address"
            fullWidth
            name="address"
            type=""
            id="address"
            autoComplete="address"
          />
          <FormLabel id="gender">Gender</FormLabel>
          <RadioGroup
            sx={{ '& .MuiRadio-root.Mui-checked': { color: '#333' } }}
            defaultValue={gender}
            row
            aria-labelledby="gender"
            name="gender"
          >
            <FormControlLabel value="Female" control={<Radio />} label="Female" />
            <FormControlLabel value="Male" control={<Radio />} label="Male" />
            <FormControlLabel value="Other" control={<Radio />} label="Other" />
          </RadioGroup>

          <InputLabel id="role">Role</InputLabel>
          <Select
            labelId="role"
            id="role"
            required
            sx={{
              width: '100%',
              '& fieldset.MuiOutlinedInput-notchedOutline': { border: '1px solid #0000003b !important' },
            }}
            size="small"
            name="role"
            defaultValue={role}
          >
            <MenuItem
              disabled={
                checkRole(['Root']) ||
                checkCurrentRole(['Root', 'Admin', 'UserManage']) ||
                (role === currentUser.role) === 'Root'
              }
              value="Root"
            >
              Root
            </MenuItem>
            <MenuItem disabled={checkRole(['Admin', 'Root']) || checkCurrentRole(['UserManage'])} value="Admin">
              Admin
            </MenuItem>
            <MenuItem disabled={role === 'Root' || checkCurrentRole(['Root', 'Admin'])} value="UserManage">
              User Manage
            </MenuItem>
            <MenuItem
              disabled={role === 'Root' || checkCurrentRole(['Root', 'Admin', 'UserManage'])}
              value="ContentManage"
            >
              Content Manage
            </MenuItem>
            <MenuItem
              disabled={role === 'Root' || checkCurrentRole(['Root', 'Admin', 'UserManage'])}
              value="OrderManage"
            >
              Order Manage
            </MenuItem>
            <MenuItem disabled={role === 'Root' || checkCurrentRole(['Root', 'Admin', 'UserManage'])} value="Doctor">
              Doctor
            </MenuItem>
            <MenuItem disabled={role === 'Root' || checkCurrentRole(['Root', 'Admin', 'UserManage'])} value="Customer">
              Customer
            </MenuItem>
          </Select>
          <MyButton effect color={{ mainColor: 'orange' }} style={{ width: '100%', marginTop: '10px' }} type="submit">
            Update
          </MyButton>
        </form>
      </Box>
    </Box>
  );
}
