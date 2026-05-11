import React, { useState } from 'react';
import { Box, Typography, Button, Divider, Paper, CircularProgress, Alert } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import 'react-quill-new/dist/quill.bubble.css';

import { useFragment } from '../../../graphql/generated';
import type { FragmentType } from '../../../graphql/generated';
import { LessonFieldsFragmentDoc } from '../../../graphql/generated/graphql';
import { getOpenAPIDefinition } from '../../../api/generated/endpoints';

const api = getOpenAPIDefinition();

interface Props {
    lesson: FragmentType<typeof LessonFieldsFragmentDoc>;
    onGoToPages: (orderIndex: number) => void;
}

const quillThemeOverrides = {
    '& .ql-editor': { color: 'text.primary' },
    '& .ql-toolbar': {
        borderColor: 'divider',
        backgroundColor: 'background.default',
        borderRadius: '4px 4px 0 0',
        '& .ql-stroke': { stroke: (theme: Theme) => theme.palette.text.primary },
        '& .ql-fill': { fill: (theme: Theme) => theme.palette.text.primary },
        '& .ql-picker': { color: 'text.primary' },
    },
    '& .ql-container': {
        borderColor: 'divider',
        borderRadius: '0 0 4px 4px',
        fontSize: '1.1rem',
    },
    '& .ql-tooltip': {
        backgroundColor: 'background.paper',
        borderColor: 'divider',
        color: 'text.primary',
        boxShadow: (theme: Theme) => theme.shadows[4],
    }
};

export const TeacherLessonView: React.FC<Props> = ({ lesson, onGoToPages }) => {
    const data = useFragment(LessonFieldsFragmentDoc, lesson);

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isCreatingPage, setIsCreatingPage] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [description, setDescription] = useState(data.description || '');
    const hasPages = data.pages && data.pages.length > 0;

    const handleSave = async () => {
        setIsSaving(true);
        setErrorMsg(null);

        try {
            await api.updateLesson(data.id, {
                title: data.title,
                description,
            });

            setIsEditing(false);
        } catch (err) {
            console.error('Failed to update lesson:', err);
            setErrorMsg('Failed to save description. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleGoToPagesAction = async () => {
        if (hasPages) {
            onGoToPages(data.pages[0].orderIndex);
        } else {
            setIsCreatingPage(true);
            setErrorMsg(null);
            try {
                const response = await api.createPage(data.id, {
                    title: 'New Page',
                });

                if (response.data && response.data.orderIndex !== undefined) {
                    onGoToPages(response.data.orderIndex);
                } else {
                    console.error("No ID returned from page creation");
                    setErrorMsg("Failed to load the new page. Please refresh and try again.");
                }
            } catch (err) {
                console.error('Failed to create initial page:', err);
                setErrorMsg('Failed to create the first page. Please try again.');
            } finally {
                setIsCreatingPage(false);
            }
        }
    };

    return (
        <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
            {errorMsg && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {errorMsg}
                </Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
                        Teacher Management
                    </Typography>

                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {data.title}
                    </Typography>
                </Box>

                <Button
                    variant={isEditing ? 'contained' : 'outlined'}
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    disabled={isSaving || isCreatingPage}
                    startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    {isSaving ? 'Saving...' : isEditing ? 'Save Description' : 'Edit Description'}
                </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box
                sx={{
                    mb: 4,
                    // FIX: Apply the theme overrides dynamically based on edit state
                    ...(isEditing ? quillThemeOverrides : {
                        '& .ql-container': { border: 'none', fontSize: '1.1rem' },
                        '& .ql-toolbar': { display: 'none' }
                    })
                }}
            >
                <ReactQuill
                    value={description}
                    onChange={setDescription}
                    readOnly={!isEditing || isSaving || isCreatingPage}
                    theme={isEditing ? 'snow' : 'bubble'}
                />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary">
                    Configure the content blocks and pages for this lesson.
                </Typography>

                <Button
                    variant="contained"
                    onClick={handleGoToPagesAction}
                    disabled={isEditing || isSaving || isCreatingPage}
                    startIcon={isCreatingPage ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    {isCreatingPage ? 'Creating Page...' : hasPages ? 'Go to Pages' : 'Create First Page'}
                </Button>
            </Box>
        </Paper>
    );
};