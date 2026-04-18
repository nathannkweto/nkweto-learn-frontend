import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Button, Card, CardContent,
    Grid, CircularProgress, Alert, Breadcrumbs, Link
} from '@mui/material';
import { getOpenAPIDefinition } from '../../api/generated/endpoints';
import type { TopicsTopicIdGet200Response } from '../../api/generated/models';

const api = getOpenAPIDefinition();

export const TopicDetails = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const navigate = useNavigate();
    const [topic, setTopic] = useState<TopicsTopicIdGet200Response | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTopic = async () => {
            if (!topicId) return;
            try {
                setLoading(true);
                const response = await api.topicsTopicIdGet(topicId);
                setTopic(response.data);
            } catch (err: any) {
                console.error('Failed to fetch topic details', err);
                setError('Could not load topic details.');
            } finally {
                setLoading(false);
            }
        };
        fetchTopic();
    }, [topicId]);

    if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;
    if (error || !topic) return <Container mt={4}><Alert severity="error">{error}</Alert></Container>;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Breadcrumbs sx={{ mb: 2 }}>
                <Link color="inherit" sx={{ cursor: 'pointer' }} onClick={() => navigate('/teacher/dashboard')}>
                    Dashboard
                </Link>
                <Typography color="text.primary">{topic.title}</Typography>
            </Breadcrumbs>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom>{topic.title}</Typography>
                    <Typography variant="subtitle1" color="textSecondary">{topic.description}</Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/teacher/topics/${topic.id}/create-quiz`)}
                >
                    + Create Quiz
                </Button>
            </Box>

            <Typography variant="h5" mb={2}>Quizzes</Typography>

            {(!topic.quizzes || topic.quizzes.length === 0) ? (
                <Typography color="textSecondary">No quizzes created for this topic yet.</Typography>
            ) : (
                <Grid container spacing={3}>
                    {topic.quizzes.map((quiz) => (
                        <Grid item xs={12} sm={6} md={4} key={quiz.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{quiz.title}</Typography>
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