import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Paper, Button, Divider, Container,
    CircularProgress, Alert, Breadcrumbs, Link, Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getOpenAPIDefinition } from '../../api/generated/endpoints';
import type { PageDetail } from '../../api/generated/models';

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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            if (!pageId) return;
            try {
                const response = await api.pagesPageIdGet(Number(pageId));
                setPage(response.data);
            } catch (err: unknown) {
                console.error('Failed to fetch page content:', err);
            } finally {
                setLoading(false);
            }
        };
        void fetchPage();
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

    return (
        <Box sx={{ backgroundColor: '#ffffff', minHeight: '100vh', pb: 10 }}>
            {/* Top Navigation Bar */}
            <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', py: 2, mb: 4, backgroundColor: '#fcfcfc' }}>
                <Container maxWidth="md">
                    {/* Fix: Moved justifyContent and alignItems into sx */}
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
                                    Topic
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

                    {/* Fix: Moved alignItems into sx */}
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
                                <Paper
                                    key={block.id}
                                    elevation={0}
                                    sx={{
                                        backgroundColor: '#0f172a',
                                        color: '#e2e8f0',
                                        p: 3,
                                        borderRadius: 3,
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {block.language && (
                                        <Box sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            px: 2,
                                            py: 0.5,
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                            borderRadius: '0 0 0 8px'
                                        }}>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                                                {block.language}
                                            </Typography>
                                        </Box>
                                    )}
                                    <pre style={{ margin: 0, fontFamily: '"Fira Code", "Cascadia Code", monospace', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                        <code>{block.content}</code>
                                    </pre>
                                </Paper>
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

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => navigate(`/student/topics/${topicId}`)}
                        sx={{
                            px: 6,
                            py: 1.5,
                            borderRadius: 10,
                            textTransform: 'none',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            boxShadow: '0px 8px 20px rgba(25, 118, 210, 0.25)'
                        }}
                    >
                        Complete
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};