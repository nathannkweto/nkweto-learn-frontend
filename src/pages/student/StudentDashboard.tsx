import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Paper, Stack,
    CircularProgress, Button, Alert, Chip
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
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
            } catch (err) {
                console.error('Failed to fetch topics', err);
                setError('Could not load topics.');
            } finally {
                setLoading(false);
            }
        };

        // Fix: Use 'void' to explicitly mark the floating promise as handled
        void fetchTopics();
    }, []);

    return (
        <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh', py: 6 }}>
            <Container maxWidth="md">
                <Box sx={{ mb: 5 }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{ fontWeight: 800, mb: 1, color: '#1e293b' }}
                    >
                        Your Curriculum
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Select a topic below to view available quizzes and lessons.
                    </Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Stack spacing={2}>
                        {topics.map((topic) => (
                            <Paper
                                key={topic.id}
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        backgroundColor: 'rgba(25, 118, 210, 0.02)',
                                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.03)',
                                    }
                                }}
                            >
                                <Box sx={{ flex: 1, pr: 2 }}>
                                    {/* Fix: Moved 'alignItems' into 'sx' to satisfy TS overload */}
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        sx={{ mb: 1, alignItems: 'center' }}
                                    >
                                        <Chip
                                            label={topic.category}
                                            size="small"
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: '0.7rem',
                                                backgroundColor: '#e2e8f0'
                                            }}
                                        />
                                    </Stack>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                        {topic.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" noWrap>
                                        {topic.description}
                                    </Typography>
                                </Box>

                                <Button
                                    variant="contained"
                                    disableElevation
                                    onClick={() => navigate(`/student/topics/${topic.id}`)}
                                    endIcon={<ChevronRightIcon />}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        px: 3
                                    }}
                                >
                                    Start
                                </Button>
                            </Paper>
                        ))}
                    </Stack>
                )}
            </Container>
        </Box>
    );
};