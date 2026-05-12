import React, { useState } from 'react';
import { Box, Typography, Button, Container, TextField, MenuItem, CircularProgress, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import 'react-quill-new/dist/quill.bubble.css';

import { CodeSnippet } from './CodeSnippet';
import { useFragment } from '../../../graphql/generated';
import type { FragmentType } from '../../../graphql/generated';
import {
    PageFieldsFragmentDoc,
    PageBlockFieldsFragmentDoc,
} from '../../../graphql/generated/graphql';
import type { PageBlockFieldsFragment } from '../../../graphql/generated/graphql';
import { getOpenAPIDefinition } from '../../../api/generated/endpoints';

const api = getOpenAPIDefinition();

interface Props {
    page: FragmentType<typeof PageFieldsFragmentDoc>;
    onNext: () => void;
    onPrev: () => void;
    onProjectAction: () => void;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    hasProject: boolean;
}

export const TeacherPageView: React.FC<Props> = ({
                                                     page,
                                                     onNext,
                                                     onPrev,
                                                     onProjectAction,
                                                     hasNextPage,
                                                     hasPrevPage,
                                                     hasProject
                                                 }) => {
    const theme = useTheme();
    const data = useFragment(PageFieldsFragmentDoc, page);
    const unmaskedBlocks = useFragment(PageBlockFieldsFragmentDoc, data.blocks);

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // --- Title State ---
    const [title, setTitle] = useState<string>(data.title || '');
    const [prevTitleData, setPrevTitleData] = useState(data.title);

    // Sync title if the underlying page data changes (e.g., user navigates to next page)
    if (data.title !== prevTitleData) {
        setPrevTitleData(data.title);
        setTitle(data.title || '');
    }

    // --- Blocks State ---
    const [blocks, setBlocks] = useState<PageBlockFieldsFragment[]>(
        (unmaskedBlocks as PageBlockFieldsFragment[]) || []
    );
    const [prevUnmaskedBlocks, setPrevUnmaskedBlocks] = useState(unmaskedBlocks);

    if (unmaskedBlocks !== prevUnmaskedBlocks) {
        setPrevUnmaskedBlocks(unmaskedBlocks);
        setBlocks((unmaskedBlocks as PageBlockFieldsFragment[]) || []);
    }

    const handleAddBlock = (type: 'TEXT' | 'CODE') => {
        const newBlock = {
            id: `new-${Date.now()}`,
            type: type,
            content: '',
            language: type === 'CODE' ? 'javascript' : null,
        } as PageBlockFieldsFragment;
        setBlocks([...blocks, newBlock]);
    };

    const handleUpdateBlock = (id: string, newContent: string) => {
        setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, content: newContent } : b)));
    };

    const handleUpdateLanguage = (id: string, newLanguage: string) => {
        setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, language: newLanguage } : b)));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setErrorMsg(null);
        try {
            // 1. Update the Page Title (if it changed)
            if (title !== data.title) {
                await api.updatePage(parseInt(data.id, 10), {
                    title: title
                });
            }

            // 2. Update/Create Blocks
            await Promise.all(
                blocks.map((block, index) => {
                    if (block.id.startsWith('new-')) {
                        return api.createBlock(parseInt(data.id, 10), {
                            type: block.type as "TEXT" | "CODE",
                            content: block.content,
                            language: block.language ?? undefined,
                            orderIndex: index,
                        });
                    }
                    return api.updateBlock(parseInt(block.id, 10), {
                        content: block.content,
                        language: block.language ?? undefined,
                        orderIndex: index,
                    });
                })
            );
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to save page:', err);
            setErrorMsg('Failed to save changes. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Container
            maxWidth="md"
            sx={{
                py: 6,
                backgroundColor: 'background.default',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                '& .ql-editor': { color: 'text.primary' },
                '& .ql-toolbar': {
                    borderColor: 'divider',
                    backgroundColor: 'background.default',
                    '& .ql-stroke': { stroke: theme.palette.text.primary },
                    '& .ql-fill': { fill: theme.palette.text.primary },
                    '& .ql-picker': { color: 'text.primary' },
                },
                '& .ql-container': { borderColor: 'divider' },
                '& .ql-tooltip': {
                    backgroundColor: 'background.paper',
                    borderColor: 'divider',
                    color: 'text.primary',
                    boxShadow: theme.shadows[4],
                }
            }}
        >
            {errorMsg && <Alert severity="error" sx={{ mb: 3 }}>{errorMsg}</Alert>}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, gap: 2 }}>

                {/* Dynamically render TextField or Typography based on isEditing */}
                {isEditing ? (
                    <TextField
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isSaving}
                        variant="outlined"
                        placeholder="Enter Page Title"
                        sx={{
                            '& .MuiInputBase-input': {
                                fontSize: '2rem',
                                fontWeight: 700,
                            }
                        }}
                    />
                ) : (
                    <Typography variant="h3" sx={{ fontWeight: 700, flexGrow: 1 }}>
                        {title}
                    </Typography>
                )}

                <Button
                    variant="contained"
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    disabled={isSaving}
                    startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
                    sx={{ flexShrink: 0 }}
                >
                    {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Page'}
                </Button>
            </Box>

            <Box sx={{ mb: 4, flexGrow: 1 }}>
                {blocks.length === 0 && !isEditing && (
                    <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                        This page has no content yet. Click "Edit Page" to add some!
                    </Typography>
                )}

                {blocks.map((block) => (
                    <Box
                        key={block.id}
                        sx={{
                            mb: 4,
                            border: isEditing ? '1px dashed' : 'none',
                            borderColor: 'divider',
                            p: isEditing ? 2 : 0,
                            borderRadius: 1,
                        }}
                    >
                        {block.type === 'TEXT' ? (
                            <ReactQuill
                                key={`quill-${block.id}-${isEditing ? 'edit' : 'view'}`}
                                value={block.content}
                                onChange={(content) => handleUpdateBlock(block.id, content)}
                                readOnly={!isEditing || isSaving}
                                theme={isEditing ? 'snow' : 'bubble'}
                            />
                        ) : (
                            <>
                                {isEditing ? (
                                    <Box>
                                        <TextField
                                            select
                                            label="Language"
                                            size="small"
                                            value={block.language || 'javascript'}
                                            onChange={(e) => handleUpdateLanguage(block.id, e.target.value)}
                                            disabled={isSaving}
                                            sx={{ mb: 1, width: 200 }}
                                        >
                                            <MenuItem value="html">HTML</MenuItem>
                                            <MenuItem value="css">CSS</MenuItem>
                                            <MenuItem value="javascript">JAVASCRIPT</MenuItem>
                                            <MenuItem value="jsx">JSX</MenuItem>
                                            <MenuItem value="typescript">TYPESCRIPT</MenuItem>
                                            <MenuItem value="tsx">TSX</MenuItem>
                                            <MenuItem value="bash">BASH</MenuItem>
                                            <MenuItem value="txt">TXT</MenuItem>
                                        </TextField>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={5}
                                            variant="outlined"
                                            value={block.content}
                                            onChange={(e) => handleUpdateBlock(block.id, e.target.value)}
                                            disabled={isSaving}
                                            sx={{ fontFamily: 'monospace' }}
                                        />
                                    </Box>
                                ) : (
                                    <CodeSnippet code={block.content} language={block.language || 'javascript'} />
                                )}
                            </>
                        )}
                    </Box>
                ))}

                {isEditing && (
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
                        <Button variant="outlined" onClick={() => handleAddBlock('TEXT')} disabled={isSaving}>
                            + Add Text Block
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={() => handleAddBlock('CODE')} disabled={isSaving}>
                            + Add Code Block
                        </Button>
                    </Box>
                )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6, pt: 4, borderTop: 1, borderColor: 'divider' }}>
                <Button
                    variant="outlined"
                    onClick={onPrev}
                >
                    {hasPrevPage ? 'Previous Page' : 'Back to Lesson'}
                </Button>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={onProjectAction}
                    >
                        {hasProject ? 'Go to Project' : 'Create Project'}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={onNext}
                    >
                        {hasNextPage ? 'Next Page' : 'Create Next Page'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};