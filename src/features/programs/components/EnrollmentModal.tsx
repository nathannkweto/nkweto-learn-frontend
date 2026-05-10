import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    TextField,
    CircularProgress,
    Box
} from '@mui/material';

interface EnrollmentModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (githubUrl: string) => Promise<void>;
    isEnrolling: boolean;
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
                                                                    open,
                                                                    onClose,
                                                                    onSubmit,
                                                                    isEnrolling
                                                                }) => {
    const [githubUrl, setGithubUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!githubUrl.trim()) {
            setError('GitHub URL is required.');
            return;
        }
        if (!githubUrl.toLowerCase().includes('github.com')) {
            setError('Please enter a valid GitHub repository URL.');
            return;
        }

        setError('');
        await onSubmit(githubUrl.trim());
    };

    const handleClose = () => {
        setGithubUrl('');
        setError('');
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={isEnrolling ? undefined : handleClose}
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    sx: { borderRadius: 2 }
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
                Program Enrollment
            </DialogTitle>

            <DialogContent>
                <Box sx={{ mb: 3, mt: 1, p: 2, backgroundColor: 'action.hover', borderRadius: 1 }}>
                    <DialogContentText sx={{ color: 'text.secondary', fontStyle: 'italic', lineHeight: 1.6 }}>
                        "Hey, Nathan here, I'm trying to ensure that I can observe your progress in this program,
                        so kindly create a github repository for the work you will be doing in this program,
                        then copy the link to that repository and paste it in the box down there. Thanks."
                    </DialogContentText>
                </Box>

                <TextField
                    autoFocus
                    id="github-url"
                    label="GitHub Repository URL"
                    type="url"
                    fullWidth
                    variant="outlined"
                    value={githubUrl}
                    onChange={(e) => {
                        setGithubUrl(e.target.value);
                        if (error) setError('');
                    }}
                    error={!!error}
                    helperText={error || "e.g., https://github.com/username/repo-name"}
                    disabled={isEnrolling}
                    slotProps={{
                        input: {
                            sx: { backgroundColor: 'background.paper' }
                        }
                    }}
                />
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button
                    onClick={handleClose}
                    disabled={isEnrolling}
                    color="inherit"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={isEnrolling}
                    startIcon={isEnrolling ? <CircularProgress size={20} color="inherit" /> : null}
                    sx={{ px: 3 }}
                >
                    {isEnrolling ? 'Enrolling...' : 'Submit & Enroll'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};