import React from 'react';
import { Box, Typography, Button, Divider, Paper, CircularProgress } from '@mui/material';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useFragment } from '../../../graphql/generated';
import type { FragmentType } from '../../../graphql/generated';
import {
    ProgramDetailFieldsFragmentDoc,
} from '../../../graphql/generated/graphql';

interface Props {
    program: FragmentType<typeof ProgramDetailFieldsFragmentDoc>;
    onEnroll: () => void;
    onGoToLessons: () => void;
    isEnrolling?: boolean;
}

export const StudentProgramView: React.FC<Props> = ({ program, onEnroll, onGoToLessons, isEnrolling }) => {
    const data = useFragment(ProgramDetailFieldsFragmentDoc, program);

    return (
        <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                Program
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                {data.title}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 4, '.ql-container': { border: 'none', fontSize: '1.1rem', color: 'text.secondary' } }}>
                <ReactQuill
                    value={data.description}
                    readOnly={true}
                    theme="bubble"
                />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {data.isEnrolled ? (
                    <Button
                        variant="contained"
                        size="large"
                        onClick={onGoToLessons}
                        sx={{ px: 4 }}
                    >
                        Go to Lessons
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={onEnroll}
                        disabled={isEnrolling}
                        startIcon={isEnrolling ? <CircularProgress size={20} color="inherit" /> : null}
                        sx={{ px: 4 }}
                    >
                        {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                    </Button>
                )}
            </Box>
        </Paper>
    );
};