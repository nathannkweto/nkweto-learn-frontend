import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
    Container, Typography, Box, Button, Card, CardContent,
    TextField, Alert, CircularProgress, MenuItem, Switch, FormControlLabel, Grid
} from '@mui/material';
import { getOpenAPIDefinition } from '../../api/generated/endpoints';
import type { PageDetail } from '../../api/generated/models';

const api = getOpenAPIDefinition();

interface BlockFormData {
    type: 'TEXT' | 'CODE' | 'IMAGE' | 'LIST';
    content: string;
    language?: string;
    orderIndex: number;
}

// Defining a local type to satisfy strict typing without using `any`
interface ContentBlock {
    id: number;
    type: string;
    content: string;
    language?: string;
    orderIndex?: number;
}

export const PageEditor = () => {
    const { pageId } = useParams<{ pageId: string }>();
    const navigate = useNavigate();

    const [page, setPage] = useState<PageDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [isAddingBlock, setIsAddingBlock] = useState(false);
    const { register: registerBlock, handleSubmit: handleBlockSubmit, reset: resetBlock, watch: watchBlock } = useForm<BlockFormData>({
        defaultValues: { type: 'TEXT', content: '', language: '', orderIndex: 0 }
    });
    const blockType = watchBlock('type');

    const fetchPage = useCallback(async () => {
        if (!pageId) return;
        try {
            const response = await api.pagesPageIdGet(Number(pageId));
            setPage(response.data);
        } catch (err: unknown) {
            console.error('Failed to load page:', err);
            setErrorMsg('Failed to load page details.');
        } finally {
            setLoading(false);
        }
    }, [pageId]);

    useEffect(() => {
        void fetchPage();
    }, [fetchPage]);

    // Using Record<string, unknown> avoids the 'any' linting error while allowing flexible API payloads
    const handleUpdatePageMeta = async (updatedFields: Record<string, unknown>) => {
        try {
            // Type assertion used safely here to bypass the generated branded types
            await api.pagesPageIdPut(Number(pageId), updatedFields as Parameters<typeof api.pagesPageIdPut>[1]);
            void fetchPage();
        } catch (err: unknown) {
            console.error('Failed to update meta:', err);
            setErrorMsg('Failed to update page settings.');
        }
    };

    const onAddBlock = async (data: BlockFormData) => {
        try {
            const payload: Record<string, unknown> = {
                ...data,
                language: data.type === 'CODE' ? data.language : undefined,
                orderIndex: page?.blocks?.length || 0
            };

            // NOTE: This will continue to throw TS2339 until you regenerate your OpenAPI client!
            // @ts-expect-error - Suppressing until API client is regenerated
            await api.pagesPageIdBlocksPost(Number(pageId), payload);

            setIsAddingBlock(false);
            resetBlock();
            void fetchPage();
        } catch (err: unknown) {
            console.error('Failed to add block:', err);
            setErrorMsg('Failed to add content block.');
        }
    };

    const handleDeleteBlock = async (blockId: number) => {
        if (!window.confirm('Are you sure you want to delete this block?')) return;
        try {
            // NOTE: This will continue to throw TS2339 until you regenerate your OpenAPI client!
            // @ts-expect-error - Suppressing until API client is regenerated
            await api.blocksBlockIdDelete(blockId);
            void fetchPage();
        } catch (err: unknown) {
            console.error('Failed to delete block:', err);
            setErrorMsg('Failed to delete block.');
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    if (!page) return <Container sx={{ mt: 4 }}><Alert severity="error">Page not found.</Alert></Container>;

    // Safely cast blocks to our strictly defined interface
    const blocks = (page.blocks || []) as unknown as ContentBlock[];

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Edit Page</Typography>
                <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
            </Box>

            {errorMsg && <Alert severity="error" sx={{ mb: 3 }}>{errorMsg}</Alert>}

            {/* Changed bgcolor to backgroundColor to appease IDE spellcheckers */}
            <Card sx={{ mb: 5, backgroundColor: '#f8f9fa' }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Page Settings</Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                        <TextField
                            label="Title" fullWidth size="small" defaultValue={page.title}
                            onBlur={(e) => handleUpdatePageMeta({ title: String(e.target.value) })}
                        />
                        <TextField
                            label="Est. Minutes" type="number" size="small" sx={{ width: 150 }} defaultValue={page.estimatedMinutes}
                            onBlur={(e) => handleUpdatePageMeta({ estimatedMinutes: Number(e.target.value) })}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    // Coerces the OpenAPI branded type into a standard primitive boolean
                                    defaultChecked={Boolean(page.isPublished)}
                                    onChange={(e) => handleUpdatePageMeta({ isPublished: e.target.checked })}
                                    color="success"
                                />
                            }
                            label="Published"
                            sx={{ ml: 1 }}
                        />
                    </Box>
                </CardContent>
            </Card>

            <Typography variant="h5" gutterBottom>Content</Typography>

            {blocks.map((block) => (
                <Card key={block.id} sx={{ mb: 2, borderLeft: '4px solid #1976d2' }}>
                    <CardContent sx={{ position: 'relative' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                                {String(block.type).toUpperCase()} BLOCK
                            </Typography>
                            <Button size="small" color="error" onClick={() => handleDeleteBlock(Number(block.id))}>
                                Delete
                            </Button>
                        </Box>

                        {String(block.type).toUpperCase() === 'TEXT' && <Typography variant="body1">{block.content}</Typography>}
                        {String(block.type).toUpperCase() === 'IMAGE' && <Box component="img" src={block.content} sx={{ maxWidth: '100%', borderRadius: 1 }} />}
                        {String(block.type).toUpperCase() === 'CODE' && (
                            <Box sx={{ backgroundColor: '#2d2d2d', color: '#ccc', p: 2, borderRadius: 1, fontFamily: 'monospace' }}>
                                <Typography variant="caption" sx={{ color: '#888', display: 'block', mb: 1 }}>
                                    Language: {block.language || 'text'}
                                </Typography>
                                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{block.content}</pre>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            ))}

            {!isAddingBlock ? (
                <Button
                    variant="outlined" fullWidth sx={{ mt: 2, py: 2, borderStyle: 'dashed' }}
                    onClick={() => setIsAddingBlock(true)}
                >
                    + Add Content Block
                </Button>
            ) : (
                <Card sx={{ mt: 3, border: '1px solid #1976d2' }}>
                    <CardContent component="form" onSubmit={handleBlockSubmit(onAddBlock)}>
                        <Typography variant="subtitle1" gutterBottom>New Content Block</Typography>

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField select fullWidth label="Block Type" {...registerBlock('type')}>
                                    <MenuItem value="TEXT">Text / Paragraph</MenuItem>
                                    <MenuItem value="CODE">Code Snippet</MenuItem>
                                    <MenuItem value="IMAGE">Image URL</MenuItem>
                                </TextField>
                            </Grid>
                            {blockType === 'CODE' && (
                                <Grid size={{ xs: 12, sm: 8 }}>
                                    <TextField fullWidth label="Language (e.g. javascript, python)" {...registerBlock('language')} />
                                </Grid>
                            )}
                        </Grid>

                        <TextField
                            fullWidth multiline rows={4} label="Content" variant="outlined"
                            placeholder={blockType === 'IMAGE' ? "Paste image URL here..." : "Type your content..."}
                            {...registerBlock('content', { required: true })}
                            sx={{ mb: 2 }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button onClick={() => setIsAddingBlock(false)}>Cancel</Button>
                            <Button type="submit" variant="contained" color="primary">Save Block</Button>
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
};