import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Card, CardContent, CardActions,
    Grid, CircularProgress, Button, Alert, Chip
} from '@mui/material';
import { getOpenAPIDefinition } from '../../api/generated/endpoints';
import type { Topic } from '../../api/generated/models';

const api = getOpenAPIDefinition();

export const StudentDashboard = () => {
    const navigate = useNavigate();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await api.topicsGet();
                setTopics(response.data);
            } catch (err: any) {
                console.error('Failed to fetch topics', err);
                setError('Could not load topics.');
            } finally {
                setLoading(false);
            }
        };
        fetchTopics();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Student Dashboard
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" mb={4}>
                Explore available topics and take quizzes to test your knowledge.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {loading ? (
                <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>
            ) : topics.length === 0 ? (
                <Typography variant="body1" color="textSecondary">No topics available right now.</Typography>
            ) : (
                <Grid container spacing={4}>
                    {topics.map((topic) => (
                        <Grid item key={topic.id} xs={12} sm={6} md={4}>
                            <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Chip label={topic.category} size="small" sx={{ mb: 1 }} />
                                    <Typography gutterBottom variant="h5" component="h2">{topic.title}</Typography>
                                    <Typography>{topic.description}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => navigate(`/student/topics/${topic.id}`)}>
                                        View Quizzes
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};