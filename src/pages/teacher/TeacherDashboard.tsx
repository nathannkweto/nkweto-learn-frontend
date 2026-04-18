import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Box, Button, Card, CardContent, CardActions,
    Grid, Chip, CircularProgress, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, MenuItem, Alert
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { getOpenAPIDefinition } from '../../api/generated/endpoints';
import type { Topic, TopicCreate } from '../../api/generated/models';

const api = getOpenAPIDefinition();

export const TeacherDashboard = () => {
    const navigate = useNavigate();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form state
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TopicCreate>({
        defaultValues: { status: 'draft' }
    });

    const fetchTopics = async () => {
        try {
            setLoading(true);
            const response = await api.topicsGet();
            setTopics(response.data);
        } catch (err: any) {
            console.error('Failed to fetch topics', err);
            setError('Could not load topics. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    const onSubmitTopic = async (data: TopicCreate) => {
        try {
            await api.topicsPost(data);
            setIsDialogOpen(false);
            reset(); // Clear the form
            fetchTopics(); // Refresh the list
        } catch (err: any) {
            console.error('Failed to create topic', err);
            setError(err.response?.data?.message || 'Failed to create topic.');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1">
                    Teacher Dashboard
                </Typography>
                <Button variant="contained" color="primary" onClick={() => setIsDialogOpen(true)}>
                    + Create Topic
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {loading ? (
                <Box display="flex" justifyContent="center" mt={10}>
                    <CircularProgress />
                </Box>
            ) : topics.length === 0 ? (
                <Typography variant="body1" color="textSecondary" align="center" mt={10}>
                    You haven't created any topics yet. Click "Create Topic" to get started.
                </Typography>
            ) : (
                <Grid container spacing={4}>
                    {topics.map((topic) => (
                        <Grid item key={topic.id} xs={12} sm={6} md={4}>
                            <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography variant="overline" color="textSecondary">
                                            {topic.category}
                                        </Typography>
                                        <Chip
                                            label={topic.status}
                                            size="small"
                                            color={topic.status === 'published' ? 'success' : 'default'}
                                        />
                                    </Box>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {topic.title}
                                    </Typography>
                                    <Typography>
                                        {topic.description}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    {/* We will route this to the quiz builder/viewer in the next step */}
                                    <Button size="small" onClick={() => navigate(`/teacher/topics/${topic.id}`)}>
                                        Manage Quizzes
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Create Topic Dialog Modal */}
            <Dialog open={isDialogOpen} onClose={() => !isSubmitting && setIsDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Create a New Topic</DialogTitle>
                <Box component="form" onSubmit={handleSubmit(onSubmitTopic)} noValidate>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="Title"
                            fullWidth
                            required
                            {...register('title', { required: 'Title is required' })}
                            error={!!errors.title}
                            helperText={errors.title?.message}
                        />
                        <TextField
                            margin="dense"
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            required
                            {...register('description', { required: 'Description is required' })}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                        />
                        <TextField
                            margin="dense"
                            label="Category"
                            fullWidth
                            required
                            {...register('category', { required: 'Category is required' })}
                            error={!!errors.category}
                            helperText={errors.category?.message}
                        />
                        <TextField
                            margin="dense"
                            select
                            label="Status"
                            fullWidth
                            {...register('status')}
                        >
                            <MenuItem value="draft">Draft</MenuItem>
                            <MenuItem value="published">Published</MenuItem>
                        </TextField>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Create Topic'}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Container>
    );
};