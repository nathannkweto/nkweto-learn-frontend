import { useEffect, useState, useCallback } from 'react';
import {
    Container, Typography, Box, Button, Paper, Chip, CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    MenuItem, Alert, Stack, Divider, useTheme, useMediaQuery
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { getOpenAPIDefinition } from '../../api/generated/endpoints';
import type { Topic, TopicCreate } from '../../api/generated/models';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

const api = getOpenAPIDefinition();

export const TeacherDashboard = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TopicCreate>({
        defaultValues: { status: 'draft' }
    });

    const fetchTopics = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.topicsGet();
            setTopics(response.data);
        } catch {
            setError('Could not load topics. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Fix: Missing await for async function call
        void fetchTopics();
    }, [fetchTopics]);

    const onSubmitTopic = async (data: TopicCreate) => {
        try {
            await api.topicsPost(data);
            setIsDialogOpen(false);
            reset();
            await fetchTopics(); // Fix: Await the refresh
        } catch (err) {
            const axiosError = err as { response?: { data?: { message?: string } } };
            setError(axiosError.response?.data?.message || 'Failed to create topic.');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 6 }, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
                <Button
                    variant="contained"
                    startIcon={<AddRoundedIcon />}
                    onClick={() => setIsDialogOpen(true)}
                    disableElevation
                    sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 600
                    }}
                >
                    New Topic
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>
            ) : topics.length === 0 ? (
                <Paper
                    variant="outlined"
                    sx={{ p: 6, textAlign: 'center', borderRadius: 4, border: '2px dashed #e0e4e8', bgcolor: 'transparent' }}
                >
                    <Typography variant="h6" color="textSecondary">No topics found</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                        Get started by creating your first educational module.
                    </Typography>
                </Paper>
            ) : (
                <Stack spacing={2}>
                    {topics.map((topic) => (
                        <Paper
                            key={topic.id}
                            elevation={0}
                            sx={{
                                p: { xs: 2, sm: 3 },
                                borderRadius: 3,
                                border: '1px solid #edf2f7',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.04)',
                                    borderColor: 'primary.light',
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            <Box sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { xs: 'flex-start', sm: 'center' },
                                gap: 2
                            }}>
                                {/* FIX 1: Added minWidth: 0 to allow text truncation to work properly in a flex layout */}
                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        sx={{ mb: 0.5, alignItems: 'center' }}
                                    >
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            {topic.category}
                                        </Typography>
                                        <Divider orientation="vertical" flexItem sx={{ height: 12, my: 'auto' }} />
                                        <Chip
                                            label={topic.status}
                                            size="small"
                                            variant="filled"
                                            color={topic.status === 'published' ? 'success' : 'default'}
                                            sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}
                                        />
                                    </Stack>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                        {topic.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {topic.description}
                                    </Typography>
                                </Box>

                                <Button
                                    variant="outlined"
                                    endIcon={<ChevronRightRoundedIcon />}
                                    fullWidth={isMobile}
                                    onClick={() => navigate(`/teacher/topics/${topic.id}`)}
                                    sx={{
                                        // FIX 2: Added flexShrink: 0 to prevent the button from being squished
                                        flexShrink: 0,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        borderColor: '#e2e8f0',
                                        color: 'text.primary',
                                        '&:hover': { borderColor: 'primary.main', backgroundColor: 'rgba(25, 118, 210, 0.04)' }
                                    }}
                                >
                                    Manage
                                </Button>
                            </Box>
                        </Paper>
                    ))}
                </Stack>
            )}

            <Dialog
                open={isDialogOpen}
                onClose={() => !isSubmitting && setIsDialogOpen(false)}
                fullWidth
                maxWidth="sm"
                slotProps={{
                    paper: { sx: { borderRadius: 4, p: 1 } } // Fix: Proper way to pass PaperProps in MUI v6
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Create a New Topic</DialogTitle>
                <Box component="form" onSubmit={handleSubmit(onSubmitTopic)} noValidate>
                    <DialogContent>
                        <Stack spacing={2.5}>
                            <TextField
                                label="Topic Title"
                                fullWidth
                                required
                                {...register('title', { required: 'Title is required' })}
                                error={!!errors.title}
                                helperText={errors.title?.message}
                                slotProps={{ htmlInput: { sx: { borderRadius: 2 } } }}
                            />
                            <TextField
                                label="Description"
                                fullWidth
                                required
                                multiline
                                rows={3}
                                {...register('description', { required: 'Description is required' })}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                            />
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    label="Category"
                                    fullWidth
                                    required
                                    {...register('category', { required: 'Category is required' })}
                                    error={!!errors.category}
                                    helperText={errors.category?.message}
                                />
                                <TextField
                                    select
                                    label="Status"
                                    defaultValue="draft"
                                    sx={{ width: '160px' }}
                                    {...register('status')}
                                >
                                    <MenuItem value="draft">Draft</MenuItem>
                                    <MenuItem value="published">Published</MenuItem>
                                </TextField>
                            </Box>
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 1 }}>
                        <Button onClick={() => setIsDialogOpen(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                            disableElevation
                            sx={{ borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 600 }}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Topic'}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Container>
    );
};