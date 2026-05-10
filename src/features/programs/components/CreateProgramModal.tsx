import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Box, Typography, CircularProgress, Alert
} from '@mui/material';
import ReactQuill from 'react-quill-new';
import { useApolloClient } from '@apollo/client/react';
import { getOpenAPIDefinition } from '../../../api/generated/endpoints';

const api = getOpenAPIDefinition();

interface CreateProgramModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (newProgramId: string) => void;
}

export const CreateProgramModal: React.FC<CreateProgramModalProps> = ({ open, onClose, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const client = useApolloClient();

    const handleCreate = async () => {
        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        setIsSaving(true);
        setError(null);
        try {
            const response = await api.createProgram({
                title,
                description,
            });

            await client.refetchQueries({ include: 'active' });

            onSuccess(response.data.id);
            handleClose();
        } catch (err) {
            console.error('Create program failed:', err);
            setError('Failed to create program. Please check your connection.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        setTitle('');
        setDescription('');
        setError(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 700 }}>Create New Program</DialogTitle>
            <DialogContent dividers>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                    <TextField
                        label="Program Title"
                        variant="outlined"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Advanced Java Spring Boot"
                        disabled={isSaving}
                    />

                    <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                            Description
                        </Typography>
                        <ReactQuill
                            theme="snow"
                            value={description}
                            onChange={setDescription}
                            placeholder="Describe what students will learn..."
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2.5 }}>
                <Button onClick={handleClose} color="inherit" disabled={isSaving}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleCreate}
                    disabled={isSaving}
                    startIcon={isSaving && <CircularProgress size={20} color="inherit" />}
                >
                    {isSaving ? 'Creating...' : 'Create Program'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};