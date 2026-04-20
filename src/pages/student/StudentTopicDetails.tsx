import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Button, Card, CardContent,
    Grid, CircularProgress, Alert, Breadcrumbs, Link, Paper, Stack
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayCircleIcon from '@mui/icons-material/PlayCircle'; // Fixed import
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
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
        void fetchTopic();
    }, [topicId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress thickness={5} />
            </Box>
        );
    }

    if (!topic) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error" variant="filled" sx={{ borderRadius: 3 }}>
                    Topic not found.
                </Alert>
            </Container>
        );
    }

    return (
        <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh', pb: 8 }}>
            {/* Header Section */}
            <Box sx={{ backgroundColor: '#ffffff', borderBottom: '1px solid', borderColor: 'divider', pt: 4, pb: 6, mb: 6 }}>
                <Container maxWidth="lg">
                    <Breadcrumbs sx={{ mb: 3 }}>
                        <Link
                            color="inherit"
                            sx={{ cursor: 'pointer', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                            onClick={() => navigate('/student/dashboard')}
                        >
                            Dashboard
                        </Link>
                        <Typography color="text.primary" sx={{ fontWeight: 500 }}>{String(topic.title)}</Typography>
                    </Breadcrumbs>

                    <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 2, color: '#1e293b' }}>
                        {String(topic.title)}
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, maxWidth: 800, lineHeight: 1.6 }}>
                        {String(topic.description)}
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg">
                <Grid container spacing={5}>
                    {/* Lessons Section */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Stack direction="row" spacing={1.5} sx={{ mb: 3, alignItems: 'center' }}>
                            <PlayCircleIcon color="primary" />
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>Lessons</Typography>
                        </Stack>

                        {(!topic.pages || topic.pages.length === 0) ? (
                            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, border: '1px dashed', borderColor: 'divider', backgroundColor: 'transparent' }}>
                                <Typography color="textSecondary">No lessons available yet.</Typography>
                            </Paper>
                        ) : (
                            <Stack spacing={2}>
                                {topic.pages.map((page) => (
                                    <Card
                                        key={page.id}
                                        elevation={0}
                                        sx={{
                                            borderRadius: 3,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            transition: '0.2s',
                                            '&:hover': { boxShadow: '0px 4px 20px rgba(0,0,0,0.05)', borderColor: 'primary.light' }
                                        }}
                                    >
                                        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{String(page.title)}</Typography>
                                                    <Stack direction="row" spacing={2} sx={{ alignItems: 'center', color: 'text.secondary' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <AccessTimeIcon sx={{ fontSize: 18 }} />
                                                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                                                {String(page.estimatedMinutes)} mins
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </Box>
                                                <Button
                                                    variant="contained"
                                                    disableElevation
                                                    onClick={() => navigate(`/student/topics/${topic.id}/pages/${page.id}`)}
                                                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                                                >
                                                    Start
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        )}
                    </Grid>

                    {/* Quizzes Section */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Stack direction="row" spacing={1.5} sx={{ mb: 3, alignItems: 'center' }}>
                            <AssignmentTurnedInIcon sx={{ color: '#10b981' }} />
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>Assessments</Typography>
                        </Stack>

                        {(!topic.quizzes || topic.quizzes.length === 0) ? (
                            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, backgroundColor: '#f1f5f9' }}>
                                <Typography color="textSecondary">Quizzes will appear here once assigned.</Typography>
                            </Paper>
                        ) : (
                            <Stack spacing={2}>
                                {topic.quizzes.map((quiz) => (
                                    <Paper
                                        key={quiz.id}
                                        sx={{
                                            p: 3,
                                            borderRadius: 3,
                                            border: '1px solid #e2e8f0',
                                            backgroundColor: '#ffffff',
                                            boxShadow: '0px 2px 4px rgba(0,0,0,0.02)'
                                        }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                                            {String(quiz.title)}
                                        </Typography>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            color="success"
                                            onClick={() => navigate(`/student/quizzes/${quiz.id}/take`)}
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 700,
                                                borderColor: '#10b981',
                                                color: '#059669',
                                                '&:hover': { borderColor: '#059669', backgroundColor: '#f0fdf4' }
                                            }}
                                        >
                                            Take Quiz
                                        </Button>
                                    </Paper>
                                ))}
                            </Stack>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};