import { FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MyButton } from '_/components/common';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';

import { useAuth } from '_/context/AuthContext';
import { useThemMui } from '_/context/ThemeMuiContext';
import { createNewUser, getToken, login } from '_/redux/slices';
import { routes } from '_/routes';
import { capitalize } from '_/utills';
import AuthWrapper from './AuthWrapper';
import { unwrapResult } from '@reduxjs/toolkit';
import { useEffect } from 'react';

export default function Register() {
    const { setLoading } = useThemMui();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { text: message, setSnackbar, currentUser } = useAuth();
    const text = message.auth;
    useEffect(() => {
        if (currentUser) navigate(routes.home);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);
    const handleSubmit = async (event) => {
        setLoading(true);
        try {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const dataUser = {
                firstName: capitalize(data.get('firstName')),
                lastName: capitalize(data.get('lastName')),
                email: data.get('email'),
                password: data.get('password'),
                confirmpassword: data.get('confirmpassword'),
                // address: data.get('address'),
                gender: data.get('gender'),
                // birthday: data.get('birthday'),
                phoneNumber: data.get('phoneNumber'),
                image: data.get('image'),
                role: 'Customer',
            };

            if (dataUser.password !== dataUser.confirmpassword) {
                setSnackbar({ open: true, message: 'Password & confirmpassword not match!', status: 'error' });
                setLoading(false);
                return;
            } else if (
                new Date(dataUser.birthday).getFullYear() > new Date().getFullYear() ||
                new Date(dataUser.birthday).getFullYear() < 1920
            ) {
                setLoading(false);
                setSnackbar({ open: true, message: 'Birth year is illegal!', status: 'error' });
                return;
            } else {
                dispatch(createNewUser(dataUser))
                    .then(unwrapResult)
                    .then(() => {
                        const loginInfo = {
                            email: data.get('email'),
                            password: data.get('password'),
                        };
                        dispatch(getToken(loginInfo))
                            .then(unwrapResult)
                            .then((res) => {
                                const { token } = res;
                                dispatch(login(token))
                                    .then(unwrapResult)
                                    .then((res) => {
                                        const { message } = res;
                                        setLoading(false);
                                        setSnackbar({ open: true, message, status: 'success' });
                                    });
                            })
                            .catch((e) => {
                                console.log({ e });
                                setLoading(false);
                                setSnackbar({ open: true, message: e.errorMessage, status: 'error' });
                            });
                    })
                    .catch((e) => {
                        console.log({ e });
                        setLoading(false);
                        setSnackbar({ open: true, message: e.errorMessage, status: 'error' });
                    });
            }
        } catch (e) {
            console.log({ e });
            setLoading(false);
            setSnackbar({ open: true, message: e.errorMessage, status: 'error' });
        }
    };

    return (
        <AuthWrapper>
            <form onSubmit={handleSubmit}>
                <MyTextField
                    sx={{ marginTop: '15px' }}
                    size="small"
                    label={text.enterFirstName}
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
                    label={text.enterLastName}
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
                    label={text.enterEmail}
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
                    label={text.enterPassword}
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
                    label={text.confirmPassword}
                    required
                    fullWidth
                    name="confirmpassword"
                    type="password"
                    id="confirmpassword"
                    autoComplete="current-password"
                />
                <MyTextField
                    sx={{ marginTop: '15px' }}
                    size="small"
                    label={text.enterPhoneNumber}
                    fullWidth
                    name="phoneNumber"
                    type="number"
                    required
                    id="phoneNumber"
                    autoComplete="phoneNumber"
                />
                {/* <MyTextField
                    sx={{ marginTop: '15px' }}
                    size="small"
                    label={text.enterAddress}
                    fullWidth
                    name="address"
                    type=""
                    id="address"
                    autoComplete="address"
                /> */}
                {/* <FormLabel sx={{ margin: '10px 0 0 0' }} htmlFor="birthday" id="gender">
                    {text.birthday}
                </FormLabel>
                <MyTextField
                    required
                    size="small"
                    fullWidth
                    name="birthday"
                    type="date"
                    id="birthday"
                    autoComplete="birthday"
                /> */}
                <Box sx={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <FormLabel id="gender">{text.gender}</FormLabel>
                    <RadioGroup defaultValue="Female" row aria-labelledby="gender" name="gender">
                        <FormControlLabel value="Male" control={<Radio />} label={text.male} />
                        <FormControlLabel value="Female" control={<Radio />} label={text.female} />
                        <FormControlLabel value="Other" control={<Radio />} label={text.other} />
                    </RadioGroup>
                </Box>

                <MyButton
                    fontSize={1.5}
                    effect
                    color={{ mainColor: 'green' }}
                    className="btn"
                    type="submit"
                    style={{ width: '100%' }}
                >
                    {text.register}
                </MyButton>
            </form>
            <Box sx={{ mt: '10px', '& *': { fontSize: '1.4rem' } }}>
                <Box sx={{ display: 'inline-flex' }}>
                    <Typography sx={{ margin: '0 5px', display: 'flex', alignItems: 'center' }}>
                        {text.alreadyHaveAnAccount}
                    </Typography>
                    <MyButton effect to={'/login'} text>
                        {text.login}
                    </MyButton>
                </Box>
            </Box>
        </AuthWrapper>
    );
}
