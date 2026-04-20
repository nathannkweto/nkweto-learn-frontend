import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
    Box, Button, TextField, Typography, Container, Paper, Link, Alert
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { getOpenAPIDefinition } from '../api/generated/endpoints';
import type { LoginRequest } from '../api/generated/models';

const api = getOpenAPIDefinition();

export const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginRequest>();

    const onSubmit = async (data: LoginRequest) => {
        setErrorMsg(null);
        try {
            const response = await api.authLoginPost(data);
            const { token, user } = response.data;

            login(token, user);

            if (user.role === 'teacher') {
                navigate('/teacher/dashboard', { replace: true });
            } else {
                navigate('/student/dashboard', { replace: true });
            }
        } catch (error) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            console.error('Login failed:', error);
            setErrorMsg(axiosError.response?.data?.message || 'Invalid email or password.');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f7fa',
                padding: 2,
            }}
        >
            <Container component="main" maxWidth="xs" sx={{ padding: 0 }}>
                <Paper
                    elevation={0}
                    sx={{
                        padding: { xs: 4, sm: 5 },
                        width: '100%',
                        borderRadius: 4,
                        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: '#ffffff'
                    }}
                >
                    <Typography
                        component="h1"
                        variant="h4"
                        align="center"
                        gutterBottom
                        sx={{
                            color: 'text.primary',
                            mb: 1,
                            fontWeight: 700 // Fix: Move fontWeight inside sx
                        }}
                    >
                        React Lessons
                    </Typography>

                    <Typography
                        variant="body2"
                        align="center"
                        sx={{ color: 'text.secondary', mb: 4 }}
                    >
                        Sign in or create an account to start
                    </Typography>

                    {errorMsg && (
                        <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
                            {errorMsg}
                        </Alert>
                    )}

                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                        sx={{ width: '100%' }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            autoComplete="email"
                            autoFocus
                            {...register('email', { required: 'Email is required' })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            slotProps={{
                                htmlInput: { sx: { borderRadius: 2 } }
                            }}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            {...register('password', { required: 'Password is required' })}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            slotProps={{
                                htmlInput: { sx: { borderRadius: 2 } }
                            }}
                            sx={{ mb: 1 }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isSubmitting}
                            disableElevation
                            sx={{
                                mt: 3,
                                mb: 3,
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 600,
                                '&:hover': {
                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                }
                            }}
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign In'}
                        </Button>

                        <Box sx={{ textAlign: 'center' }}>
                            <Link
                                component={RouterLink}
                                to="/register"
                                variant="body2"
                                sx={{
                                    textDecoration: 'none',
                                    color: 'primary.main',
                                    fontWeight: 500,
                                    '&:hover': { textDecoration: 'underline' }
                                }}
                            >
                                {"Click here to create an account"}
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};