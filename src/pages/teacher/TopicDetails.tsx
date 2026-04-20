import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Button, Paper,
    CircularProgress, Alert, Breadcrumbs, Link, Chip, Divider,
    Stack, useTheme, useMediaQuery, IconButton
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { getOpenAPIDefinition } from '../../api/generated/endpoints';
// Import Page and QuizSummary directly to avoid 'any'
import type { TopicsTopicIdGet200Response, Page, QuizSummary } from '../../api/generated/models';

const api = getOpenAPIDefinition();

export const TopicDetails = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const navigate = useNavigate();
    const theme = useTheme();
    // Use isMobile to fix the "unused variable" error
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [topic, setTopic] = useState<TopicsTopicIdGet200Response | null>(null);
    const [pages, setPages] = useState<Page[]>([]); // Typed correctly
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
                // Use the error variable to satisfy ESLint
                console.error('Fetch error:', err);
                setError('Could not load topic details. Please refresh the page.');
            } finally {
                setLoading(false);
            }
        };
        void fetchTopicAndPages();
    }, [topicId]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    if (error || !topic) return <Container sx={{ mt: 4 }}><Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert></Container>;

    // Type Casting Helpers to satisfy the OpenAPI object-wrapper quirk
    const title = String(topic.title);
    const description = String(topic.description);

    return (
        <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, mb: 8 }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
                <Link
                    underline="hover"
                    color="inherit"
                    sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}
                    onClick={() => navigate('/teacher/dashboard')}
                >
                    Dashboard
                </Link>
                <Typography color="text.primary" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    {title}
                </Typography>
            </Breadcrumbs>

            <Box sx={{ mb: 6 }}>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em', fontSize: isMobile ? '2rem' : '3rem' }}>
                    {title}
                </Typography>
                <Typography variant="h6" color="textSecondary" sx={{ fontWeight: 400, maxWidth: '800px' }}>
                    {description}
                </Typography>
            </Box>

            {/* Pages Section */}
            <Box sx={{ mb: 6 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>Curriculum Pages</Typography>
                        {!isMobile && <Typography variant="body2" color="textSecondary">The reading material for this topic</Typography>}
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddRoundedIcon />}
                        onClick={() => navigate(`/teacher/topics/${topic.id}/pages/create`)}
                        disableElevation
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                    >
                        Add Page
                    </Button>
                </Box>

                {pages.length === 0 ? (
                    <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 3, borderStyle: 'dashed' }}>
                        <Typography color="textSecondary">No pages created yet.</Typography>
                    </Paper>
                ) : (
                    <Stack spacing={1.5}>
                        {pages.map((page: Page) => (
                            <Paper
                                key={page.id}
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    border: '1px solid #edf2f7',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    transition: '0.2s',
                                    '&:hover': { backgroundColor: '#f8fafc', borderColor: theme.palette.primary.light }
                                }}
                            >
                                <Box sx={{
                                    width: 40, height: 40, borderRadius: 2, backgroundColor: 'primary.lighter',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main'
                                }}>
                                    <ArticleRoundedIcon />
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{page.title}</Typography>
                                    <Stack direction="row" spacing={2} sx={{ color: 'text.secondary' }}>
                                        <Typography variant="caption">Order: {page.orderIndex}</Typography>
                                        <Typography variant="caption">•</Typography>
                                        <Typography variant="caption">{page.estimatedMinutes} mins read</Typography>
                                    </Stack>
                                </Box>
                                <Chip
                                    label={page.isPublished ? 'Published' : 'Draft'}
                                    size="small"
                                    color={page.isPublished ? 'success' : 'default'}
                                    sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                                />
                                <IconButton onClick={() => navigate(`/teacher/pages/${page.id}/edit`)}>
                                    <EditNoteRoundedIcon />
                                </IconButton>
                            </Paper>
                        ))}
                    </Stack>
                )}
            </Box>

            <Divider sx={{ mb: 6 }} />

            {/* Quizzes Section */}
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>Assessments</Typography>
                        {!isMobile && <Typography variant="body2" color="textSecondary">Knowledge checks for your students</Typography>}
                    </Box>
                    <Button
                        variant="outlined"
                        startIcon={<AddRoundedIcon />}
                        onClick={() => navigate(`/teacher/topics/${topic.id}/create-quiz`)}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                    >
                        New Quiz
                    </Button>
                </Box>

                {(!topic.quizzes || topic.quizzes.length === 0) ? (
                    <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 3, borderStyle: 'dashed' }}>
                        <Typography color="textSecondary">No quizzes created yet.</Typography>
                    </Paper>
                ) : (
                    <Stack spacing={1.5}>
                        {topic.quizzes.map((quiz: QuizSummary) => (
                            <Paper
                                key={quiz.id}
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    border: '1px solid #edf2f7',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    cursor: 'pointer',
                                    '&:hover': { backgroundColor: '#f8fafc', borderColor: theme.palette.secondary.light }
                                }}
                                onClick={() => navigate(`/teacher/topics/${topic.id}/quizzes/${quiz.id}`)}
                            >
                                <Box sx={{
                                    width: 40, height: 40, borderRadius: 2, backgroundColor: '#f5f3ff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed'
                                }}>
                                    <QuizRoundedIcon />
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{quiz.title}</Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {/* FIXED: Using created_at as per your error message */}
                                        Created on {new Date(quiz.created_at || '').toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <ChevronRightRoundedIcon color="disabled" />
                            </Paper>
                        ))}
                    </Stack>
                )}
            </Box>
        </Container>
    );
};