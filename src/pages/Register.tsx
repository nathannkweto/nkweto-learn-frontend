import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
    Box, Button, TextField, Typography, Container, Paper, Link, Alert, MenuItem
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { getOpenAPIDefinition } from '../api/generated/endpoints';
import type { RegisterRequest } from '../api/generated/models';

const api = getOpenAPIDefinition();

export const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterRequest>({
        defaultValues: {
            role: 'STUDENT' // Default to student
        }
    });

    const onSubmit = async (data: RegisterRequest) => {
        setErrorMsg(null);
        try {
            const response = await api.authRegisterPost(data);
            const { token, user } = response.data;

            login(token, user);

            if (user.role === 'TEACHER') {
                navigate('/teacher/dashboard', { replace: true });
            } else {
                navigate('/student/dashboard', { replace: true });
            }
        } catch (error) {
            // Safely cast the error to access Axios-specific error properties without using 'any'
            const axiosError = error as { response?: { data?: { message?: string } } };

            console.error('Registration failed:', error);
            setErrorMsg(axiosError.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ padding: 4, width: '100%', borderRadius: 2 }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Create an Account
                    </Typography>

                    {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Full Name"
                            autoFocus
                            {...register('name', { required: 'Name is required' })}
                            error={!!errors.name}
                            helperText={errors.name?.message}
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
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            select
                            label="Role"
                            {...register('role')}
                        >
                            <MenuItem value="student">Student</MenuItem>
                            <MenuItem value="teacher">Teacher</MenuItem>
                        </TextField>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating account...' : 'Sign Up'}
                        </Button>

                        {/* Moved textAlign into the sx prop here */}
                        <Box sx={{ textAlign: 'center' }}>
                            <Link component={RouterLink} to="/login" variant="body2">
                                {"Already have an account? Sign In"}
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};