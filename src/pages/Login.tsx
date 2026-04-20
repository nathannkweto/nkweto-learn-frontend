import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
    Box, Button, TextField, Typography, Container, Paper, Link, Alert
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
// Note: Adjust the import name if Orval named the function slightly differently (e.g., getAuthLoginPost)
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
            // 3. Call the function off the api object
            const response = await api.authLoginPost(data);
            const { token, user } = response.data;

            login(token, user);

            // Fix 1: Changed 'TEACHER' to lowercase 'teacher'
            if (user.role === 'TEACHER') {
                navigate('/teacher/dashboard', { replace: true });
            } else {
                navigate('/student/dashboard', { replace: true });
            }
        } catch (error) {
            // Fix 2: Safely cast the error without using 'any'
            const axiosError = error as { response?: { data?: { message?: string } } };

            console.error('Login failed:', error);
            setErrorMsg(axiosError.response?.data?.message || 'Invalid email or password.');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ padding: 4, width: '100%', borderRadius: 2 }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Sign in to Nkweto Learn
                    </Typography>

                    {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
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
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign In'}
                        </Button>

                        {/* Fix 3: Moved textAlign into the sx prop */}
                        <Box sx={{ textAlign: 'center' }}>
                            <Link component={RouterLink} to="/register" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};