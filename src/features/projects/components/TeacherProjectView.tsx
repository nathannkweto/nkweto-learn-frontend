import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Button, Divider, TextField, CircularProgress, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import 'react-quill-new/dist/quill.bubble.css';

import { useFragment } from '../../../graphql/generated';
import type { FragmentType } from '../../../graphql/generated';
import { ProjectFieldsFragmentDoc } from '../../../graphql/generated/graphql';

import { getOpenAPIDefinition } from '../../../api/generated/endpoints';

const api = getOpenAPIDefinition();

interface Props {
    project: FragmentType<typeof ProjectFieldsFragmentDoc>;
}

export const TeacherProjectView: React.FC<Props> = ({ project }) => {
    const theme = useTheme();
    const unmaskedProject = useFragment(ProjectFieldsFragmentDoc, project);

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [description, setDescription] = useState(unmaskedProject.description || '');

    const [repoUrl, setRepoUrl] = useState(
        (unmaskedProject as unknown as { checkRepositoryUrl?: string }).checkRepositoryUrl || ''
    );

    const handleSave = async () => {
        setIsSaving(true);
        setErrorMsg(null);
        try {
            await api.updateProject(unmaskedProject.id, {
                title: unmaskedProject.title,
                instructions: description,
            });
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to save project updates:", err);
            setErrorMsg("Failed to save changes. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const quillThemeOverrides = {
        '& .ql-editor': { color: 'text.primary' },
        '& .ql-toolbar': {
            borderColor: 'divider',
            backgroundColor: 'background.default',
            borderRadius: '4px 4px 0 0',
            '& .ql-stroke': { stroke: theme.palette.text.primary },
            '& .ql-fill': { fill: theme.palette.text.primary },
            '& .ql-picker': { color: 'text.primary' },
        },
        '& .ql-container': {
            borderColor: 'divider',
            borderRadius: '0 0 4px 4px',
        },
        '& .ql-tooltip': {
            backgroundColor: 'background.paper',
            borderColor: 'divider',
            color: 'text.primary',
            boxShadow: theme.shadows[4],
        }
    };

    return (
        <Card>
            <CardContent sx={{ p: 3 }}>
                {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {unmaskedProject.title}
                    </Typography>
                    <Button
                        variant={isEditing ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        disabled={isSaving}
                        startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Project"}
                    </Button>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Instructions
                    </Typography>
                    <Box sx={{
                        ...(isEditing ? quillThemeOverrides : {
                            '& .ql-container': { border: 'none', fontSize: '1rem' },
                            '& .ql-toolbar': { display: 'none' }
                        })
                    }}>
                        <ReactQuill
                            value={description}
                            onChange={setDescription}
                            readOnly={!isEditing || isSaving}
                            theme={isEditing ? "snow" : "bubble"}
                        />
                    </Box>
                </Box>

                {(isEditing || repoUrl) && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Validation Repository URL
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="https://github.com/your-org/validation-repo"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            disabled={!isEditing || isSaving}
                        />
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};