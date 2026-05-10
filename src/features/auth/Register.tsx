import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Box, Button, TextField, Link, Alert, Stack } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { getOpenAPIDefinition } from '../../api/generated/endpoints';
import type { RegisterRequest } from '../../api/generated/models';
import { AuthLayout } from '../../layouts/AuthLayout';
import axios from 'axios';

const api = getOpenAPIDefinition();

export const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterRequest>();

    const onSubmit = async (data: RegisterRequest) => {
        try {
            setErrorMsg(null);

            const response = await api.authRegisterPost(data);

            if (response.data) {
                login(response.data.token, response.data.user);
                navigate('/');
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const backendMessage = err.response?.data?.message || 'Registration failed. Please try again.';
                setErrorMsg(backendMessage);
            } else {
                setErrorMsg('An unexpected error occurred.');
            }
            console.error('Registration error:', err);
        }
    };

    return (
        <AuthLayout title="Welcome" subtitle="Create your account to join the React lessons">
            {errorMsg && <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>{errorMsg}</Alert>}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: '100%' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                    <TextField
                        required
                        fullWidth
                        label="First Name"
                        {...register('firstName', { required: 'First name is required' })}
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                        slotProps={{ htmlInput: { sx: { borderRadius: 2 } } }}
                    />
                    <TextField
                        required
                        fullWidth
                        label="Last Name"
                        {...register('lastName', { required: 'Last name is required' })}
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                        slotProps={{ htmlInput: { sx: { borderRadius: 2 } } }}
                    />
                </Stack>

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Email Address"
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    slotProps={{ htmlInput: { sx: { borderRadius: 2 } } }}
                    sx={{ mb: 2 }}
                />

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    {...register('password', { required: 'Password required', minLength: { value: 8, message: 'Min 8 chars' }})}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    slotProps={{ htmlInput: { sx: { borderRadius: 2 } } }}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isSubmitting}
                    disableElevation
                    sx={{ mt: 4, mb: 3, py: 1.5, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                    {isSubmitting ? 'Creating account...' : 'Create Account'}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                    <Link component={RouterLink} to="/login" variant="body2" sx={{ textDecoration: 'none', fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}>
                        Click here to Login if you have an account
                    </Link>
                </Box>
            </Box>
        </AuthLayout>
    );
};