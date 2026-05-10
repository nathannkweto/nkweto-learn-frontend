import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    CircularProgress,
    Alert,
    Stack
} from '@mui/material';
import { useApolloClient } from '@apollo/client/react';
import { getOpenAPIDefinition } from '../../../api/generated/endpoints';

const api = getOpenAPIDefinition();

interface CreateLessonModalProps {
    open: boolean;
    programId: string;
    onClose: () => void;
    onSuccess: (lessonId: string) => void;
}

export const CreateLessonModal: React.FC<CreateLessonModalProps> = ({
                                                                        open,
                                                                        programId,
                                                                        onClose,
                                                                        onSuccess
                                                                    }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const client = useApolloClient(); // NEW

    const handleClose = () => {
        if (!isSubmitting) {
            setTitle('');
            setDescription('');
            setErrorMsg(null);
            onClose();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            setErrorMsg('Lesson title is required.');
            return;
        }

        setIsSubmitting(true);
        setErrorMsg(null);

        try {
            const response = await api.createLesson({
                programId: programId,
                title: title.trim(),
                description: description.trim(),
            });

            await client.refetchQueries({ include: 'active' });

            const newLessonId = response.data.id;

            setTitle('');
            setDescription('');
            onSuccess(newLessonId);

        } catch (err) {
            console.error('Failed to create lesson:', err);
            setErrorMsg('Failed to create lesson. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 700 }}>Create New Lesson</DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {errorMsg && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {errorMsg}
                        </Alert>
                    )}

                    <Stack spacing={3}>
                        <TextField
                            label="Lesson Title"
                            variant="outlined"
                            fullWidth
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isSubmitting}
                            autoFocus
                        />
                        <TextField
                            label="Lesson Description"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isSubmitting}
                            placeholder="Briefly describe what this lesson covers..."
                        />
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        color="inherit"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Lesson'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};