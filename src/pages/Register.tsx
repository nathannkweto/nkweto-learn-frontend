import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
    Box, Button, TextField, Typography, Container, Paper, Link, Alert
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { getOpenAPIDefinition } from '../api/generated/endpoints';
import type { RegisterRequest } from '../api/generated/models';

const api = getOpenAPIDefinition();

export const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterRequest>();

    const onSubmit = async (data: RegisterRequest) => {
        setErrorMsg(null);
        try {
            const response = await api.authRegisterPost(data);
            const { token, user } = response.data;

            login(token, user);

            if (user.role === 'teacher') {
                navigate('/teacher/dashboard', { replace: true });
            } else {
                navigate('/student/dashboard', { replace: true });
            }
        } catch (error) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            console.error('Registration failed:', error);
            setErrorMsg(axiosError.response?.data?.message || 'Registration failed. Please try again.');
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
                            fontWeight: 700 // Fix: Moved from prop to sx
                        }}
                    >
                        Welcome
                    </Typography>

                    <Typography
                        variant="body2"
                        align="center"
                        sx={{ color: 'text.secondary', mb: 4 }}
                    >
                        Create your account to join the React lessons
                    </Typography>

                    {errorMsg && (
                        <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
                            {errorMsg}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Full Name"
                            autoFocus
                            {...register('name', { required: 'Name is required' })}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            slotProps={{
                                htmlInput: { sx: { borderRadius: 2 } }
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email Address"
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            slotProps={{
                                htmlInput: { sx: { borderRadius: 2 } }
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 8, message: 'Password must be at least 8 characters' }
                            })}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            slotProps={{
                                htmlInput: { sx: { borderRadius: 2 } }
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isSubmitting}
                            disableElevation
                            sx={{
                                mt: 4,
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
                            {isSubmitting ? 'Creating account...' : 'Create Account'}
                        </Button>

                        <Box sx={{ textAlign: 'center' }}>
                            <Link
                                component={RouterLink}
                                to="/login"
                                variant="body2"
                                sx={{
                                    textDecoration: 'none',
                                    color: 'primary.main',
                                    fontWeight: 500,
                                    '&:hover': { textDecoration: 'underline' }
                                }}
                            >
                                {"Click here to Login if you have an account"}
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};