import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Box, Button, TextField, Link, Alert } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { getOpenAPIDefinition } from '../../api/generated/endpoints';
import type { LoginRequest } from '../../api/generated/models';
import { AuthLayout } from '../../layouts/AuthLayout';

const api = getOpenAPIDefinition();

export const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginRequest>();

    const onSubmit = async (data: LoginRequest) => {
        try {
            setErrorMsg(null);

            // Note: Your generator might name this api.postAuthLogin depending on settings since operationId is missing in the spec
            const response = await api.authLoginPost(data);

            if (response.data) {
                // Pass BOTH the token and the user object as defined in AuthResponse
                login(response.data.token, response.data.user);
                navigate('/');
            }
        } catch (err) {
            setErrorMsg('Invalid email or password. Please try again.');
            console.error('Login error:', err);
        }
    };

    return (
        <AuthLayout title="React Lessons" subtitle="Sign in or create an account to start">
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
                    label="Email Address"
                    autoFocus
                    {...register('email', { required: 'Email is required' })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{ mb: 2 }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    {...register('password', { required: 'Password is required' })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    sx={{ mb: 1 }}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isSubmitting}
                    disableElevation
                    sx={{ mt: 3, mb: 3, py: 1.5, borderRadius: 1, textTransform: 'none', fontWeight: 600 }}
                >
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                    <Link
                        component={RouterLink}
                        to="/register"
                        variant="body2"
                        sx={{ textDecoration: 'none', fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}
                    >
                        Click here to create an account
                    </Link>
                </Box>
            </Box>
        </AuthLayout>
    );
};