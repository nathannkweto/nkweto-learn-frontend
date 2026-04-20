import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Button, Card, CardContent,
    Grid, CircularProgress, Alert, Breadcrumbs, Link, Chip, Divider
} from '@mui/material';
import { getOpenAPIDefinition } from '../../api/generated/endpoints';
import type { TopicsTopicIdGet200Response } from '../../api/generated/models';

const api = getOpenAPIDefinition();

export const TopicDetails = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const navigate = useNavigate();

    const [topic, setTopic] = useState<TopicsTopicIdGet200Response | null>(null);
    const [pages, setPages] = useState<any[]>([]); // Fallback to any[] if Page model is missing
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTopicAndPages = async () => {
            if (!topicId) return;
            try {
                setLoading(true);
                const [topicRes, pagesRes] = await Promise.all([
                    api.topicsTopicIdGet(topicId),
                    api.topicsTopicIdPagesGet(topicId)
                ]);
                setTopic(topicRes.data);
                setPages(pagesRes.data);
            } catch (err) {
                console.error('Failed to fetch topic data', err);
                setError('Could not load topic details or pages. Did you regenerate your API client?');
            } finally {
                setLoading(false);
            }
        };

        void fetchTopicAndPages(); // Fixed ignored promise
    }, [topicId]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    if (error || !topic) return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Breadcrumbs sx={{ mb: 2 }}>
                <Link color="inherit" sx={{ cursor: 'pointer', textDecoration: 'none' }} onClick={() => navigate('/teacher/dashboard')}>
                    Dashboard
                </Link>
                <Typography color="text.primary">{String(topic.title)}</Typography>
            </Breadcrumbs>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>{String(topic.title)}</Typography>
                <Typography variant="subtitle1" color="textSecondary">{String(topic.description)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">Pages</Typography>
                <Button variant="contained" color="primary" onClick={() => navigate(`/teacher/topics/${topic.id}/pages/create`)}>
                    + Create Page
                </Button>
            </Box>

            {pages.length === 0 ? (
                <Typography color="textSecondary" sx={{ mb: 4 }}>No pages created for this topic yet.</Typography>
            ) : (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {pages.map((page) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={page.id}>
                            <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }} onClick={() => navigate(`/teacher/pages/${page.id}/edit`)}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="h6" noWrap title={page.title}>{page.title}</Typography>
                                        <Chip
                                            label={page.isPublished ? 'Published' : 'Draft'}
                                            color={page.isPublished ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </Box>
                                    <Typography variant="body2" color="textSecondary">
                                        Estimated: {page.estimatedMinutes} mins
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Order: {page.orderIndex}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Divider sx={{ my: 4 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">Quizzes</Typography>
                <Button variant="contained" color="secondary" onClick={() => navigate(`/teacher/topics/${topic.id}/create-quiz`)}>
                    + Create Quiz
                </Button>
            </Box>

            {(!topic.quizzes || topic.quizzes.length === 0) ? (
                <Typography color="textSecondary">No quizzes created for this topic yet.</Typography>
            ) : (
                <Grid container spacing={3}>
                    {topic.quizzes.map((quiz) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={quiz.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" noWrap title={quiz.title}>{quiz.title}</Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                        Created: {new Date(quiz.created_at || '').toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};