import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
    Container, Typography, Box, Button, Card, CardContent,
    TextField, Alert, Breadcrumbs, Link
} from '@mui/material';
import { getOpenAPIDefinition } from '../../api/generated/endpoints';
import type { PageCreate } from '../../api/generated/models';

const api = getOpenAPIDefinition();

interface PageCreateForm {
    title: string;
    estimatedMinutes: number;
    orderIndex: number;
}

export const CreatePage = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PageCreateForm>({
        defaultValues: { title: '', estimatedMinutes: 10, orderIndex: 0 }
    });

    const onSubmit = async (data: PageCreateForm) => {
        if (!topicId) return;
        setErrorMsg(null);
        try {
            // Map form to the exact PageCreate interface required by OpenAPI
            const payload: PageCreate = {
                title: data.title,
                estimatedMinutes: data.estimatedMinutes,
                orderIndex: data.orderIndex
            };

            // Cast topicId to Number to satisfy OpenAPI generated types
            const response = await api.topicsTopicIdPagesPost(topicId, payload);
            navigate(`/teacher/pages/${response.data.id}/edit`);

        } catch (error: unknown) {
            // Safely handle the error without using 'any'
            type ErrorWithResponse = { response?: { data?: { message?: string } } };
            const isApiError = (err: unknown): err is ErrorWithResponse =>
                typeof err === 'object' && err !== null && 'response' in err;

            if (isApiError(error)) {
                setErrorMsg(error.response?.data?.message || 'Failed to create page.');
            } else {
                setErrorMsg('An unexpected error occurred while creating the page.');
            }
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
            <Breadcrumbs sx={{ mb: 4 }}>
                <Link color="inherit" sx={{ cursor: 'pointer', textDecoration: 'none' }} onClick={() => navigate(`/teacher/topics/${topicId}`)}>
                    Back to Topic
                </Link>
                <Typography color="text.primary">Create Page</Typography>
            </Breadcrumbs>

            <Typography variant="h4" gutterBottom>Create New Page</Typography>
            {errorMsg && <Alert severity="error" sx={{ mb: 3 }}>{errorMsg}</Alert>}

            <Card>
                <CardContent>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <TextField
                            fullWidth margin="normal" label="Page Title" variant="outlined"
                            {...register('title', { required: 'Title is required' })}
                            error={!!errors.title}
                            helperText={errors.title?.message}
                        />
                        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                            <TextField
                                fullWidth margin="normal" type="number" label="Estimated Minutes"
                                {...register('estimatedMinutes', { valueAsNumber: true, min: 1 })}
                            />
                            <TextField
                                fullWidth margin="normal" type="number" label="Order Index (Sorting)"
                                {...register('orderIndex', { valueAsNumber: true })}
                            />
                        </Box>

                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button onClick={() => navigate(`/teacher/topics/${topicId}`)} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating...' : 'Create & Add Content'}
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};