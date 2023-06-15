import { Box, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { MyButton } from '_/components/common';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';
import { useAuth } from '_/context/AuthContext';
import { getToken, login } from '_/redux/slices';
import { routes } from '_/routes';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AuthWrapper from './AuthWrapper';
import { useThemMui } from '_/context/ThemeMuiContext';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { text: message, setSnackbar, currentUser } = useAuth();
  const { setLoading } = useThemMui();
  const text = message.auth;

  useEffect(() => {
    if (currentUser) navigate(routes.home);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const userData = {
      email: data.get('email'),
      password: data.get('password'),
    };

    dispatch(getToken(userData))
      .then(unwrapResult)
      .then((res) => {
        const { token } = res;
        dispatch(login(token))
          .then(unwrapResult)
          .then((res) => {
            setLoading(false);
            const { message } = res;
            setSnackbar({ open: true, message: message, status: 'success' });
          });
      })
      .catch((e) => {
        setLoading(false);
        const message = e.errorMessage;
        setSnackbar({ open: true, message: message, status: 'error' });
      });
  };

  return (
    <AuthWrapper>
      <form onSubmit={handleSubmit}>
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
          autoFocus
        />
        <MyTextField
          sx={{ margin: '15px 0' }}
          size="small"
          label={text.enterPassword}
          required
          fullWidth
          name="password"
          type="password"
          id="password"
          autoComplete="current-password"
        />

        <MyButton color={{ mainColor: 'red' }} fontSize={1.5} effect type="submit" style={{ width: '100%' }}>
          {text.login}
        </MyButton>
      </form>
      <Box sx={{ mt: '10px', '& *': { fontSize: '1.4rem' } }}>
        <MyButton
          effect
          to={routes.forgotpassword}
          text
          style={{
            padding: 0,
          }}
        >
          {text.forgotPassword}
        </MyButton>

        <Box sx={{ display: 'inline-flex' }}>
          <Typography sx={{ margin: '0 5px', display: 'flex', alignItems: 'center' }}>
            {text.haveNotAccount} ?
          </Typography>
          <MyButton effect to={routes.register} text>
            {text.register}
          </MyButton>
        </Box>
      </Box>
    </AuthWrapper>
  );
}
