import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Divider,
    Paper,
    CircularProgress,
    Alert,
    Stack
} from '@mui/material';
import type { Theme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import 'react-quill-new/dist/quill.bubble.css';
import { useNavigate } from 'react-router-dom';

// GraphQL Imports
import { useFragment } from '../../../graphql/generated';
import type { FragmentType } from '../../../graphql/generated';
import { ProgramDetailFieldsFragmentDoc } from '../../../graphql/generated/graphql';

// API & Components
import { getOpenAPIDefinition } from '../../../api/generated/endpoints';
import { CreateProgramModal } from './CreateProgramModal';
import { CreateLessonModal } from '../../lessons/components/CreateLessonModal'; // NEW IMPORT

const api = getOpenAPIDefinition();

interface Props {
    program: FragmentType<typeof ProgramDetailFieldsFragmentDoc>;
    onGoToLessons: () => void;
}

// ReactQuill dark mode overrides
const quillThemeOverrides = {
    '& .ql-editor': { color: 'text.primary' },
    '& .ql-toolbar': {
        borderColor: 'divider',
        backgroundColor: 'background.default',
        borderRadius: '8px 8px 0 0',
        '& .ql-stroke': { stroke: (theme: Theme) => theme.palette.text.primary },
        '& .ql-fill': { fill: (theme: Theme) => theme.palette.text.primary },
        '& .ql-picker': { color: 'text.primary' },
    },
    '& .ql-container': {
        borderColor: 'divider',
        borderRadius: '0 0 8px 8px',
        minHeight: '250px',
        fontSize: '1rem'
    },
    '& .ql-tooltip': {
        backgroundColor: 'background.paper',
        borderColor: 'divider',
        color: 'text.primary',
        boxShadow: (theme: Theme) => theme.shadows[4],
    }
};

export const TeacherProgramView: React.FC<Props> = ({ program }) => {
    const data = useFragment(ProgramDetailFieldsFragmentDoc, program);
    const navigate = useNavigate();

    // UI State
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [description, setDescription] = useState(data.description);

    const [isCreateProgramModalOpen, setIsCreateProgramModalOpen] = useState(false);
    const [isCreateLessonModalOpen, setIsCreateLessonModalOpen] = useState(false); // NEW STATE

    /**
     * Updates the current program's description
     */
    const handleSaveDescription = async () => {
        setIsSaving(true);
        setErrorMsg(null);
        try {
            await api.updateProgram(data.id, {
                title: data.title,
                description,
            });
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to update program description:', err);
            setErrorMsg('Failed to save changes. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    /**
     * Logic for when a new program is successfully created via the Modal
     */
    const handleCreateProgramSuccess = (newProgramId: string) => {
        setIsCreateProgramModalOpen(false);
        navigate(`/teacher/programs/${newProgramId}`);
    };

    /**
     * Logic for when a new lesson is successfully created via the Modal
     */
    const handleCreateLessonSuccess = (newLessonId: string) => {
        setIsCreateLessonModalOpen(false);
        navigate(`/teacher/lessons/${newLessonId}`);
    };

    return (
        <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto', borderRadius: 3 }}>
            {errorMsg && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {errorMsg}
                </Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 1.2 }}>
                        Program Management
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                        {data.title}
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                </Stack>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: 'text.secondary' }}>
                PROGRAM DESCRIPTION
            </Typography>

            <Box
                sx={{
                    mb: 4,
                    ...(isEditing ? quillThemeOverrides : {
                        '& .ql-container': { border: 'none', fontSize: '1.1rem', px: 0 },
                        '& .ql-toolbar': { display: 'none' }
                    })
                }}
            >
                <ReactQuill
                    value={description}
                    onChange={setDescription}
                    readOnly={!isEditing || isSaving}
                    theme={isEditing ? 'snow' : 'bubble'}
                    placeholder="Enter a detailed description of the program..."
                />
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 4,
                    pt: 3,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Button
                    variant={isEditing ? 'contained' : 'outlined'}
                    size="large"
                    color={isEditing ? 'success' : 'primary'}
                    onClick={isEditing ? handleSaveDescription : () => setIsEditing(true)}
                    disabled={isSaving}
                    sx={{ px: 4, borderRadius: 2 }}
                    startIcon={
                        isSaving ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : isEditing ? (
                            <SaveIcon />
                        ) : (
                            <EditIcon />
                        )
                    }
                >
                    {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Info'}
                </Button>

                <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    onClick={() => setIsCreateLessonModalOpen(true)}
                    disabled={isEditing || isSaving}
                    sx={{ px: 4, borderRadius: 2 }}
                    startIcon={<AddIcon />}
                >
                    Add Lesson
                </Button>
            </Box>

            <CreateProgramModal
                open={isCreateProgramModalOpen}
                onClose={() => setIsCreateProgramModalOpen(false)}
                onSuccess={handleCreateProgramSuccess}
            />

            <CreateLessonModal
                open={isCreateLessonModalOpen}
                programId={data.id}
                onClose={() => setIsCreateLessonModalOpen(false)}
                onSuccess={handleCreateLessonSuccess}
            />
        </Paper>
    );
};