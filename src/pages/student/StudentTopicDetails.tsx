import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Button, Card, CardContent,
    Grid, CircularProgress, Alert, Breadcrumbs, Link
} from '@mui/material';
import { getOpenAPIDefinition } from '../../api/generated/endpoints';
import type { TopicsTopicIdGet200Response } from '../../api/generated/models';

const api = getOpenAPIDefinition();

export const StudentTopicDetails = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const navigate = useNavigate();

    const [topic, setTopic] = useState<TopicsTopicIdGet200Response | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopic = async () => {
            if (!topicId) return;
            try {
                const response = await api.topicsTopicIdGet(topicId);
                setTopic(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        void fetchTopic(); // 'void' satisfies the strict linter
    }, [topicId]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    if (!topic) return <Container sx={{ mt: 4 }}><Alert severity="error">Topic not found.</Alert></Container>;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Breadcrumbs sx={{ mb: 2 }}>
                <Link color="inherit" sx={{ cursor: 'pointer', textDecoration: 'none' }} onClick={() => navigate('/student/dashboard')}>
                    Dashboard
                </Link>
                <Typography color="text.primary">{String(topic.title)}</Typography>
            </Breadcrumbs>

            <Typography variant="h4" gutterBottom>{String(topic.title)}</Typography>
            <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 4 }}>
                {String(topic.description)}
            </Typography>

            <Typography variant="h5" sx={{ mb: 2 }}>Lessons</Typography>

            {/* Now TS knows topic.pages exists and what type it is! */}
            {(!topic.pages || topic.pages.length === 0) ? (
                <Typography color="textSecondary" sx={{ mb: 4 }}>No lessons here yet. Check back later!</Typography>
            ) : (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {topic.pages.map((page) => (
                        <Grid key={page.id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>{String(page.title)}</Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                        {/* Assuming your Page spec has estimatedMinutes. If not, update it or remove this line */}
                                        {String(page.estimatedMinutes)} mins
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        onClick={() => navigate(`/student/topics/${topic.id}/pages/${page.id}`)}
                                    >
                                        Start Lesson
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Typography variant="h5" sx={{ mb: 2 }}>Available Quizzes</Typography>

            {(!topic.quizzes || topic.quizzes.length === 0) ? (
                <Typography color="textSecondary">No quizzes here yet. Check back later!</Typography>
            ) : (
                <Grid container spacing={3}>
                    {topic.quizzes.map((quiz) => (
                        <Grid key={quiz.id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>{String(quiz.title)}</Typography>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{ mt: 2 }}
                                        onClick={() => navigate(`/student/quizzes/${quiz.id}/take`)}
                                    >
                                        Take Quiz
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};