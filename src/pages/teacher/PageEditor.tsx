import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import {
    Container, Typography, Box, Button, Paper,
    TextField, Alert, CircularProgress, MenuItem, Switch,
    FormControlLabel, Stack, IconButton,
    useTheme, useMediaQuery, Tooltip, Grid // Use Grid2 for v6 compatibility
} from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import ListRoundedIcon from '@mui/icons-material/ListRounded';
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

import { getOpenAPIDefinition } from '../../api/generated/endpoints';
import type { PageDetail } from '../../api/generated/models';

const api = getOpenAPIDefinition();

interface ListItemData {
    id?: number;
    text: string;
    orderIndex: number;
}

interface BlockFormData {
    type: 'PARAGRAPH' | 'CODE' | 'IMAGE' | 'LIST';
    content: string;
    language?: string;
    orderIndex: number;
    listItems: ListItemData[];
}

interface ContentBlock {
    id: number;
    type: string;
    content: string;
    language?: string;
    orderIndex?: number;
    listItems?: ListItemData[];
}

export const PageEditor = () => {
    const { pageId } = useParams<{ pageId: string }>();
    const navigate = useNavigate();
    const theme = useTheme();
    // Use isMobile in the title or layout to satisfy the linter
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [page, setPage] = useState<PageDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isAddingBlock, setIsAddingBlock] = useState(false);

    const { register: registerBlock, handleSubmit: handleBlockSubmit, reset: resetBlock, watch: watchBlock, control } = useForm<BlockFormData>({
        defaultValues: { type: 'PARAGRAPH', content: '', language: '', orderIndex: 0, listItems: [] }
    });

    const blockType = watchBlock('type');

    const { fields: listFields, append: appendListItem, remove: removeListItem } = useFieldArray({
        control,
        name: 'listItems'
    });

    const fetchPage = useCallback(async () => {
        if (!pageId) return;
        try {
            const response = await api.pagesPageIdGet(Number(pageId));
            setPage(response.data);
        } catch (err) {
            console.error('Fetch Page Error:', err);
            setErrorMsg('Failed to load page details.');
        } finally {
            setLoading(false);
        }
    }, [pageId]);

    useEffect(() => {
        void fetchPage();
    }, [fetchPage]);

    const handleUpdatePageMeta = async (updatedFields: Record<string, unknown>) => {
        try {
            // Replaced 'any' with a safer cast to the expected parameters
            await api.pagesPageIdPut(Number(pageId), updatedFields as Parameters<typeof api.pagesPageIdPut>[1]);
            void fetchPage();
        } catch (err) {
            console.error('Update Meta Error:', err);
            setErrorMsg('Failed to update page settings.');
        }
    };

    const onAddBlock = async (data: BlockFormData) => {
        try {
            const payload: Record<string, unknown> = {
                ...data,
                language: data.type === 'CODE' ? data.language : undefined,
                orderIndex: page?.blocks?.length || 0,
                listItems: data.type === 'LIST'
                    ? data.listItems.map((item, index) => ({ text: item.text, orderIndex: index }))
                    : []
            };

            // @ts-expect-error - Suppressing until API client is regenerated
            await api.pagesPageIdBlocksPost(Number(pageId), payload);

            setIsAddingBlock(false);
            resetBlock();
            void fetchPage();
        } catch (err) {
            console.error('Add Block Error:', err);
            setErrorMsg('Failed to add content block.');
        }
    };

    const handleDeleteBlock = async (blockId: number) => {
        if (!window.confirm('Are you sure you want to delete this block?')) return;
        try {
            await api.blocksBlockIdDelete(blockId);
            void fetchPage();
        } catch (err) {
            console.error('Delete Block Error:', err);
            setErrorMsg('Failed to delete block.');
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    if (!page) return <Container sx={{ mt: 4 }}><Alert severity="error">Page not found.</Alert></Container>;

    const blocks = (page.blocks || []) as unknown as ContentBlock[];

    return (
        <Container maxWidth="md" sx={{ mt: { xs: 2, md: 4 }, mb: 8 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: isMobile ? '1.75rem' : '2.125rem' }}>
                        Edit Page
                    </Typography>
                    <Typography variant="body2" color="textSecondary">Structure your curriculum content</Typography>
                </Box>
                <Button
                    variant="text"
                    startIcon={<ArrowBackRoundedIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                    Back
                </Button>
            </Box>

            {errorMsg && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{errorMsg}</Alert>}

            <Paper elevation={0} sx={{ p: 2.5, mb: 6, borderRadius: 3, border: '1px solid #edf2f7', backgroundColor: '#f8fafc' }}>
                <Grid container spacing={3} sx={{ alignItems: 'center' }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Page Title" fullWidth size="small" defaultValue={page.title}
                            onBlur={(e) => handleUpdatePageMeta({ title: String(e.target.value) })}
                            sx={{ backgroundColor: 'white', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <TextField
                            label="Est. Minutes" type="number" size="small" fullWidth defaultValue={page.estimatedMinutes}
                            onBlur={(e) => handleUpdatePageMeta({ estimatedMinutes: Number(e.target.value) })}
                            sx={{ backgroundColor: 'white', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }} sx={{ textAlign: 'right' }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    defaultChecked={Boolean(page.isPublished)}
                                    onChange={(e) => handleUpdatePageMeta({ isPublished: e.target.checked })}
                                    color="success"
                                />
                            }
                            label="Published"
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Stack spacing={3}>
                <Typography variant="h6" sx={{ fontWeight: 700, px: 1 }}>Content Canvas</Typography>

                {blocks.map((block) => (
                    <Paper
                        key={block.id}
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: '1px solid #edf2f7',
                            position: 'relative',
                            '&:hover': { borderColor: theme.palette.primary.light }
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                {block.type === 'CODE' && <CodeRoundedIcon fontSize="small" color="primary" />}
                                {block.type === 'LIST' && <ListRoundedIcon fontSize="small" color="primary" />}
                                {block.type === 'PARAGRAPH' && <NotesRoundedIcon fontSize="small" color="primary" />}
                                {block.type === 'IMAGE' && <ImageRoundedIcon fontSize="small" color="primary" />}
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                                    {block.type}
                                </Typography>
                            </Stack>
                            <Tooltip title="Delete Block">
                                <IconButton size="small" color="error" onClick={() => handleDeleteBlock(block.id)}>
                                    <DeleteOutlineRoundedIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        {block.type === 'PARAGRAPH' && (
                            <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.7 }}>{block.content}</Typography>
                        )}

                        {block.type === 'IMAGE' && (
                            <Box sx={{ textAlign: 'center' }}>
                                <Box component="img" src={block.content} sx={{ maxWidth: '100%', borderRadius: 2, maxHeight: 400, border: '1px solid #eee' }} />
                            </Box>
                        )}

                        {block.type === 'CODE' && (
                            <Box sx={{ backgroundColor: '#1e293b', color: '#f8fafc', p: 2.5, borderRadius: 2, fontFamily: 'monospace', fontSize: '0.9rem' }}>
                                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1.5, borderBottom: '1px solid #334155', pb: 0.5 }}>
                                    {block.language || 'Plain Text'}
                                </Typography>
                                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{block.content}</pre>
                            </Box>
                        )}

                        {block.type === 'LIST' && (
                            <Box>
                                {block.content && <Typography sx={{ mb: 1, fontWeight: 500 }}>{block.content}</Typography>}
                                <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                                    {block.listItems?.map((item) => (
                                        <Typography component="li" key={item.id || item.orderIndex} sx={{ mb: 0.5, color: 'text.primary' }}>
                                            {item.text}
                                        </Typography>
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Paper>
                ))}

                {!isAddingBlock ? (
                    <Button
                        variant="outlined" fullWidth
                        sx={{ mt: 2, py: 3, borderStyle: 'dashed', borderRadius: 3, borderWidth: 2, textTransform: 'none', fontWeight: 600 }}
                        startIcon={<AddRoundedIcon />}
                        onClick={() => setIsAddingBlock(true)}
                    >
                        Insert New Content Block
                    </Button>
                ) : (
                    <Paper sx={{ p: 4, borderRadius: 4, border: `2px solid ${theme.palette.primary.main}` }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>New Block Details</Typography>
                        <Box component="form" onSubmit={handleBlockSubmit(onAddBlock)}>
                            <Grid container spacing={3} sx={{ mb: 3 }}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField select fullWidth label="Block Type" {...registerBlock('type')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                                        <MenuItem value="PARAGRAPH">Paragraph</MenuItem>
                                        <MenuItem value="LIST">Bulleted List</MenuItem>
                                        <MenuItem value="CODE">Code Snippet</MenuItem>
                                        <MenuItem value="IMAGE">Image URL</MenuItem>
                                    </TextField>
                                </Grid>
                                {blockType === 'CODE' && (
                                    <Grid size={{ xs: 12, sm: 8 }}>
                                        <TextField fullWidth label="Language" {...registerBlock('language')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                                    </Grid>
                                )}
                            </Grid>

                            {blockType !== 'LIST' ? (
                                <TextField
                                    fullWidth multiline rows={4} label="Content" variant="outlined"
                                    placeholder={blockType === 'IMAGE' ? "https://..." : "Type here..."}
                                    {...registerBlock('content', { required: true })}
                                    sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            ) : (
                                <Box sx={{ mb: 3, p: 3, backgroundColor: '#f8fafc', borderRadius: 3, border: '1px solid #edf2f7' }}>
                                    <TextField
                                        fullWidth label="List Context" variant="outlined" size="small"
                                        {...registerBlock('content')}
                                        sx={{ mb: 3, backgroundColor: 'white' }}
                                    />
                                    <Stack spacing={1}>
                                        {listFields.map((field, index) => (
                                            <Box key={field.id} sx={{ display: 'flex', gap: 1 }}>
                                                <TextField
                                                    fullWidth size="small" placeholder={`Item ${index + 1}`}
                                                    {...registerBlock(`listItems.${index}.text` as const, { required: true })}
                                                    sx={{ backgroundColor: 'white' }}
                                                />
                                                <IconButton color="error" onClick={() => removeListItem(index)}>
                                                    <DeleteOutlineRoundedIcon />
                                                </IconButton>
                                            </Box>
                                        ))}
                                    </Stack>
                                    <Button variant="text" startIcon={<AddRoundedIcon />} sx={{ mt: 2 }} onClick={() => appendListItem({ text: '', orderIndex: listFields.length })}>
                                        Add Item
                                    </Button>
                                </Box>
                            )}

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <Button onClick={() => setIsAddingBlock(false)}>Cancel</Button>
                                <Button type="submit" variant="contained" disableElevation startIcon={<SaveRoundedIcon />} sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}>
                                    Save Block
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                )}
            </Stack>
        </Container>
    );
};