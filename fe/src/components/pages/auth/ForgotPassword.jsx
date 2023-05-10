import { Box, Typography } from '@mui/material';
import { MyButton } from '_/components/common';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';

import { useAuth } from '_/context/AuthContext';
import { useThemMui } from '_/context/ThemeMuiContext';
import { routes } from '_/routes';
import { forgotPasswordApi } from '_/services/api/userApi';
import AuthWrapper from './AuthWrapper';

function ForgotPassword() {
    const { setLoading } = useThemMui();
    const { text: message, setSnackbar } = useAuth();
    const text = message.auth;
    const handleSubmit = async (event) => {
        setLoading(true);
        try {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const dataUser = {
                email: data.get('email'),
            };
            await forgotPasswordApi(dataUser);
            setLoading(false);
            const message = `${text.mailSent} ${dataUser.email} ${text.instruct}.`;
            setSnackbar({ open: true, message: message, status: 'success' });
        } catch (error) {
            setLoading(false);
            const message =
                error.errorMessage === 'Invalid email'
                    ? text.ivalidEmail
                    : error.errorMessage === 'Failed to send email'
                    ? text.mailSendFailed
                    : text.serverError;
            setSnackbar({ open: true, message: message, status: 'error' });
        }
    };

    return (
        <AuthWrapper>
            <form onSubmit={handleSubmit}>
                <MyTextField
                    sx={{ margin: '15px 0' }}
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
                <MyButton
                    fontSize={1.5}
                    effect
                    color={{ mainColor: 'blue' }}
                    className="btn"
                    type="submit"
                    style={{ width: '100%' }}
                >
                    {text.forgotPassword}
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
                </Box>
            </Box>
        </AuthWrapper>
    );
}

export default ForgotPassword;
