import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Button, Divider, Container,
    CircularProgress, Alert, Breadcrumbs, Link, Stack
} from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// You can choose different themes (e.g., atomDark, solarizedlight, dracula)
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getOpenAPIDefinition } from '../../api/generated/endpoints';
import type { PageDetail, Page, TopicsTopicIdGet200Response } from '../../api/generated/models';

const api = getOpenAPIDefinition();

interface ListItemData {
    id?: number;
    text: string;
    orderIndex: number;
}

interface ContentBlock {
    id: number;
    type: string;
    content: string;
    language?: string;
    listItems?: ListItemData[];
}

export const StudentPageView = () => {
    const { topicId, pageId } = useParams<{ topicId: string, pageId: string }>();
    const navigate = useNavigate();

    const [page, setPage] = useState<PageDetail | null>(null);
    const [topicPages, setTopicPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [topic, setTopic] = useState<TopicsTopicIdGet200Response | null>(null); // NEW

    useEffect(() => {
        const fetchData = async () => {
            if (!pageId || !topicId) return;
            try {
                const [pageRes, topicRes] = await Promise.all([
                    api.pagesPageIdGet(Number(pageId)),
                    api.topicsTopicIdGet(topicId)
                ]);

                setPage(pageRes.data);
                setTopicPages(topicRes.data.pages || []);
                setTopic(topicRes.data);
            } catch (err: unknown) {
                console.error('Failed to fetch data:', err);
            } finally {
                setLoading(false);
            }
        };
        void fetchData();
    }, [pageId, topicId]);

    // NEW: Scroll to top whenever the pageId changes
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth' // Change to 'auto' if you prefer an instant jump instead of a smooth scroll
        });
    }, [pageId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!page) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error" variant="outlined" sx={{ borderRadius: 3 }}>
                    Lesson content not found.
                </Alert>
            </Container>
        );
    }

    const blocks = (page.blocks || []) as unknown as ContentBlock[];

    const currentIndex = topicPages.findIndex((p) => p.id !== undefined && p.id === Number(pageId));
    const prevPage = currentIndex > 0 ? topicPages[currentIndex - 1] : null;
    const nextPage = currentIndex >= 0 && currentIndex < topicPages.length - 1 ? topicPages[currentIndex + 1] : null;

    const topicName = topic?.title ? String(topic.title) : 'Topic';

    return (
        <Box sx={{ backgroundColor: '#ffffff', minHeight: '100vh', pb: 10 }}>
            {/* Top Navigation Bar */}
            <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', py: 2, mb: 4, backgroundColor: '#fcfcfc' }}>
                <Container maxWidth="md">
                    <Stack
                        direction="row"
                        sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        <Breadcrumbs separator="/" aria-label="breadcrumb">
                            <Link
                                color="inherit"
                                sx={{ cursor: 'pointer', textDecoration: 'none', '&:hover': { color: 'primary.main' }, fontSize: '0.875rem' }}
                                onClick={() => navigate('/student/dashboard')}
                            >
                                Dashboard
                            </Link>
                            {topicId && (
                                <Link
                                    color="inherit"
                                    sx={{ cursor: 'pointer', textDecoration: 'none', '&:hover': { color: 'primary.main' }, fontSize: '0.875rem' }}
                                    onClick={() => navigate(`/student/topics/${topicId}`)}
                                >
                                    {topicName}
                                </Link>
                            )}
                            <Typography color="text.primary" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                                {String(page.title)}
                            </Typography>
                        </Breadcrumbs>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            size="small"
                            onClick={() => navigate(-1)}
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                            Back
                        </Button>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="md">
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 2, color: '#1e293b' }}>
                        {String(page.title)}
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{ alignItems: 'center', color: 'text.secondary' }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTimeIcon sx={{ fontSize: 20 }} />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {String(page.estimatedMinutes)} minute read
                            </Typography>
                        </Box>
                    </Stack>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {blocks.map((block) => {
                        const type = String(block.type).toUpperCase();

                        if (type === 'PARAGRAPH') {
                            return (
                                <Typography
                                    key={block.id}
                                    variant="body1"
                                    sx={{
                                        fontSize: '1.15rem',
                                        lineHeight: 1.8,
                                        color: '#334155',
                                        fontWeight: 400
                                    }}
                                >
                                    {block.content}
                                </Typography>
                            );
                        }

                        if (type === 'IMAGE') {
                            return (
                                <Box key={block.id} sx={{ my: 2 }}>
                                    <Box
                                        component="img"
                                        src={block.content}
                                        alt="Lesson illustration"
                                        sx={{
                                            maxWidth: '100%',
                                            height: 'auto',
                                            borderRadius: 3,
                                            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                </Box>
                            );
                        }

                        if (type === 'CODE') {
                            return (
                                <Box sx={{
                                    borderRadius: 3, // Match the 12px radius of your other cards
                                    overflow: 'hidden',
                                    backgroundColor: '#1e293b', // The primary background color
                                    border: '1px solid #334155'
                                }}>
                                    {/* Header Bar */}
                                    <Box sx={{
                                        px: 2,
                                        py: 1,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        borderBottom: '1px solid #334155', // Subtle divider
                                        backgroundColor: 'rgba(0,0,0,0.2)' // Slightly darker for the header
                                    }}>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            {block.language || 'text'}
                                        </Typography>
                                    </Box>

                                    {/* The Highlighter */}
                                    <SyntaxHighlighter
                                        language={block.language?.toLowerCase() || 'text'}
                                        style={atomDark}
                                        customStyle={{
                                            margin: 0,
                                            padding: '20px',
                                            fontSize: '0.85rem',
                                            lineHeight: '1.6',
                                            backgroundColor: 'transparent', // Inherits #1e293b from parent Box
                                        }}
                                        codeTagProps={{
                                            style: { fontFamily: "'Fira Code', 'Courier New', monospace" }
                                        }}
                                        wrapLongLines={true}
                                    >
                                        {block.content}
                                    </SyntaxHighlighter>
                                </Box>
                            );
                        }

                        if (type === 'LIST') {
                            return (
                                <Box key={block.id} sx={{ pl: 1 }}>
                                    {block.content && (
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1e293b' }}>
                                            {block.content}
                                        </Typography>
                                    )}
                                    <Box component="ul" sx={{ mt: 0, pl: 3 }}>
                                        {block.listItems?.map((item) => (
                                            <Box component="li" key={item.id} sx={{ mb: 1.5, color: '#334155', fontSize: '1.1rem' }}>
                                                {item.text}
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            );
                        }

                        return null;
                    })}
                </Box>

                <Divider sx={{ my: 8 }} />

                {/* Bottom Navigation */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        variant="outlined"
                        size="large"
                        disabled={!prevPage}
                        startIcon={<ArrowBackIcon />}
                        onClick={() => prevPage?.id && navigate(`/student/topics/${topicId}/pages/${prevPage.id}`)}
                        sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 10,
                            textTransform: 'none',
                            fontSize: '1.05rem',
                            fontWeight: 600
                        }}
                    >
                        Previous
                    </Button>

                    {nextPage ? (
                        <Button
                            variant="contained"
                            size="large"
                            endIcon={<ArrowForwardIcon />}
                            onClick={() => nextPage?.id && navigate(`/student/topics/${topicId}/pages/${nextPage.id}`)}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 10,
                                textTransform: 'none',
                                fontSize: '1.05rem',
                                fontWeight: 600,
                                boxShadow: '0px 8px 20px rgba(25, 118, 210, 0.25)'
                            }}
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => navigate(`/student/topics/${topicId}`)}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 10,
                                textTransform: 'none',
                                fontSize: '1.05rem',
                                fontWeight: 600,
                                boxShadow: '0px 8px 20px rgba(46, 125, 50, 0.25)'
                            }}
                        >
                            Finish Topic
                        </Button>
                    )}
                </Box>
            </Container>
        </Box>
    );
};