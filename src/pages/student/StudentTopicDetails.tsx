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
                // Fix 1: Removed ': any'
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTopic();
    }, [topicId]);

    // Fix 2: Moved display, justifyContent, and mt into the sx prop
    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    // Fix 2: Moved mt into the sx prop
    if (!topic) return <Container sx={{ mt: 4 }}><Alert severity="error">Topic not found.</Alert></Container>;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Breadcrumbs sx={{ mb: 2 }}>
                <Link color="inherit" sx={{ cursor: 'pointer' }} onClick={() => navigate('/student/dashboard')}>
                    Dashboard
                </Link>
                <Typography color="text.primary">{String(topic.title)}</Typography>
            </Breadcrumbs>

            <Typography variant="h4" gutterBottom>{String(topic.title)}</Typography>

            {/* Fix 2: Moved mb into the sx prop */}
            <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 4 }}>{String(topic.description)}</Typography>

            {/* Fix 2: Moved mb into the sx prop */}
            <Typography variant="h5" sx={{ mb: 2 }}>Available Quizzes</Typography>

            {(!topic.quizzes || topic.quizzes.length === 0) ? (
                <Typography color="textSecondary">No quizzes here yet. Check back later!</Typography>
            ) : (
                <Grid container spacing={3}>
                    {topic.quizzes.map((quiz) => (
                        // Fix 3: Removed 'item' and used the 'size' prop for MUI v6 compatibility
                        <Grid key={quiz.id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>{quiz.title}</Typography>
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