import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
    Container, Typography, Box, Button, Paper,
    TextField, Alert, Breadcrumbs, Link, Stack, Divider
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { getOpenAPIDefinition } from '../../api/generated/endpoints';
import type { PageCreate } from '../../api/generated/models';

const api = getOpenAPIDefinition();

interface PageCreateForm {
    title: string;
    estimatedMinutes: number;
}

export const CreatePage = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const navigate = useNavigate();

    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [nextOrderIndex, setNextOrderIndex] = useState<number>(0);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PageCreateForm>({
        defaultValues: { title: '', estimatedMinutes: 10 }
    });

    useEffect(() => {
        const fetchTopicData = async () => {
            if (!topicId) return;
            try {
                // Fixed TS2345: Removed Number() wrapper to pass topicId as a string
                const response = await api.topicsTopicIdGet(topicId);
                const currentPagesCount = response.data.pages?.length || 0;
                setNextOrderIndex(currentPagesCount);
            } catch (err) {
                console.error('Failed to fetch topic data for order index calculation:', err);
            }
        };

        void fetchTopicData();
    }, [topicId]);

    const onSubmit = async (data: PageCreateForm) => {
        if (!topicId) return;
        setErrorMsg(null);

        try {
            const payload: PageCreate = {
                title: data.title,
                estimatedMinutes: data.estimatedMinutes,
                orderIndex: nextOrderIndex
            };

            const response = await api.topicsTopicIdPagesPost(topicId, payload);
            navigate(`/teacher/pages/${response.data.id}/edit`);

        } catch (error: unknown) {
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
        <Container maxWidth="md" sx={{ mt: { xs: 2, md: 4 }, mb: 8 }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
                <Link
                    underline="hover"
                    color="inherit"
                    sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}
                    onClick={() => navigate(`/teacher/topics/${topicId}`)}
                >
                    Topic Details
                </Link>
                <Typography color="text.primary" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    New Page
                </Typography>
            </Breadcrumbs>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}>
                    Create New Page
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Set up the basic information. You'll add the page content in the next step.
                </Typography>
            </Box>

            {errorMsg && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {errorMsg}
                </Alert>
            )}

            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, md: 5 },
                    borderRadius: 4,
                    border: '1px solid #edf2f7',
                    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.02)'
                }}
            >
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            label="Page Title"
                            placeholder="e.g. Introduction to React Hooks"
                            {...register('title', { required: 'Title is required' })}
                            error={!!errors.title}
                            helperText={errors.title?.message}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />

                        <TextField
                            fullWidth
                            type="number"
                            label="Estimated Minutes"
                            {...register('estimatedMinutes', { valueAsNumber: true, min: 1 })}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />

                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                            <Button
                                startIcon={<ArrowBackRoundedIcon />}
                                onClick={() => navigate(`/teacher/topics/${topicId}`)}
                                disabled={isSubmitting}
                                sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
                            >
                                Back to Topic
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                                disableElevation
                                startIcon={<SaveRoundedIcon />}
                                sx={{
                                    borderRadius: 2,
                                    px: 4,
                                    py: 1.2,
                                    textTransform: 'none',
                                    fontWeight: 600
                                }}
                            >
                                {isSubmitting ? 'Creating...' : 'Create & Add Content'}
                            </Button>
                        </Box>
                    </Stack>
                </Box>
            </Paper>
        </Container>
    );
};