import { Box, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { MyButton } from '_/components/common';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';
import { useAuth } from '_/context/AuthContext';
import { useThemMui } from '_/context/ThemeMuiContext';
import { routes } from '_/routes';
import { resetPasswordApi } from '_/services/api/userApi';
import AuthWrapper from './AuthWrapper';

function ResetPass() {
    const { text: message, setSnackbar } = useAuth();
    const text = message.auth;
    const { setLoading } = useThemMui();
    const navigate = useNavigate();
    const { token } = useParams();
    const handleRS = async (event) => {
        setLoading(true);
        try {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const password = {
                password: data.get('resetPassword'),
            };
            const res = await resetPasswordApi(token, password);
            setLoading(false);
            const message = res.message === 'Password reset successfully' ? text.passwordReset : res.message;
            setSnackbar({ open: true, message: message, status: 'success' });
            navigate(routes.login);
        } catch (error) {
            setLoading(false);
            const message =
                error.errorMessage === 'Invalid email'
                    ? text.ivalidEmail
                    : error.errorMessage === 'Invalid or expired token'
                    ? text.expiredLink
                    : text.serverError;
            setSnackbar({ open: true, message: message, status: 'error' });
        }
    };
    return (
        <AuthWrapper>
            <form onSubmit={handleRS}>
                <MyTextField
                    sx={{ margin: '15px 0' }}
                    size="small"
                    label={text.enterNewPassword}
                    required
                    fullWidth
                    id="resetPassword"
                    name="resetPassword"
                    autoComplete="resetPassword"
                    type="password"
                    autoFocus
                />
                <MyButton
                    fontSize={1.5}
                    effect
                    color={{ mainColor: 'orange' }}
                    className="btn"
                    type="submit"
                    style={{ width: '100%' }}
                >
                    {text.resetPassword}
                </MyButton>
            </form>
            <Box sx={{ mt: '10px', '& *': { fontSize: '1.4rem' } }}>
                <Box sx={{ display: 'inline-flex' }}>
                    <MyButton effect to={routes.login} text>
                        {text.login}
                    </MyButton>
                    <Typography sx={{ margin: '0 5px', display: 'flex', alignItems: 'center' }}>----</Typography>
                    <MyButton effect to={routes.register} text>
                        {text.register}
                    </MyButton>
                    <Typography sx={{ margin: '0 5px', display: 'flex', alignItems: 'center' }}>----</Typography>
                    <MyButton effect to={routes.forgotpassword} text>
                        {text.forgotPassword}
                    </MyButton>
                </Box>
            </Box>
        </AuthWrapper>
    );
}

export default ResetPass;
