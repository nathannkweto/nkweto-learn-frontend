import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Paper, Button, Divider, Container,
    CircularProgress, Alert, Breadcrumbs, Link
} from '@mui/material';
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

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    if (!page) return <Container sx={{ mt: 4 }}><Alert severity="error">Lesson content not found.</Alert></Container>;

    const blocks = (page.blocks || []) as unknown as ContentBlock[];

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
            <Breadcrumbs sx={{ mb: 4 }}>
                <Link color="inherit" sx={{ cursor: 'pointer', textDecoration: 'none' }} onClick={() => navigate('/student/dashboard')}>
                    Dashboard
                </Link>
                {topicId && (
                    <Link color="inherit" sx={{ cursor: 'pointer', textDecoration: 'none' }} onClick={() => navigate(`/student/topics/${topicId}`)}>
                        Topic Overview
                    </Link>
                )}
                {/* Fix: Safely cast title to String */}
                <Typography color="text.primary">{String(page.title)}</Typography>
            </Breadcrumbs>

            <Paper sx={{ p: { xs: 3, md: 5 }, mb: 4, borderRadius: 2 }}>
                {/* Fix: Safely cast title to String */}
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {String(page.title)}
                </Typography>
                {/* Fix: Safely cast estimatedMinutes to String */}
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Estimated time: {String(page.estimatedMinutes)} minutes
                </Typography>

                <Divider sx={{ my: 4 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {blocks.map((block) => {
                        const type = String(block.type).toUpperCase();

                        if (type === 'PARAGRAPH') {
                            return (
                                <Typography key={block.id} variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                                    {block.content}
                                </Typography>
                            );
                        }

                        if (type === 'IMAGE') {
                            return (
                                <Box key={block.id} sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                    <Box component="img" src={block.content} alt="Lesson illustration" sx={{ maxWidth: '100%', borderRadius: 2, boxShadow: 1 }} />
                                </Box>
                            );
                        }

                        if (type === 'CODE') {
                            return (
                                <Box key={block.id} sx={{ backgroundColor: '#1e1e1e', color: '#d4d4d4', p: 3, borderRadius: 2, overflowX: 'auto' }}>
                                    {block.language && (
                                        <Typography variant="caption" sx={{ color: '#858585', mb: 1, display: 'block', textTransform: 'uppercase' }}>
                                            {block.language}
                                        </Typography>
                                    )}
                                    <pre style={{ margin: 0, fontFamily: 'Consolas, Monaco, monospace', fontSize: '0.95rem' }}>
                                        {block.content}
                                    </pre>
                                </Box>
                            );
                        }

                        if (type === 'LIST') {
                            return (
                                <Box key={block.id} sx={{ pl: 2 }}>
                                    {block.content && (
                                        <Typography variant="body1" sx={{ fontSize: '1.1rem', mb: 1 }}>
                                            {block.content}
                                        </Typography>
                                    )}
                                    <Box component="ul" sx={{ mt: 0, fontSize: '1.1rem', lineHeight: 1.8 }}>
                                        {block.listItems?.map((item) => (
                                            <li key={item.id}>{item.text}</li>
                                        ))}
                                    </Box>
                                </Box>
                            );
                        }

                        return null;
                    })}
                </Box>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 4 }}>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                    Back
                </Button>
            </Box>
        </Container>
    );
};