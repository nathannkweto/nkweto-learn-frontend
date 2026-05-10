import React from 'react';
import { Box, Typography, Button, Divider, Paper } from '@mui/material';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import { useFragment } from '../../../graphql/generated';
import type { FragmentType } from '../../../graphql/generated';
import { LessonFieldsFragmentDoc } from '../../../graphql/generated/graphql';

interface Props {
    lesson: FragmentType<typeof LessonFieldsFragmentDoc>;
    onStart: () => void;
}

const quillThemeOverrides = {
    '& .ql-editor': { color: 'text.primary', padding: 0 },
    '& .ql-container': { border: 'none', fontSize: '1.1rem' },
};

export const StudentLessonView: React.FC<Props> = ({ lesson, onStart }) => {
    const data = useFragment(LessonFieldsFragmentDoc, lesson);

    return (
        <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
            <Typography
                variant="overline"
                color="primary"
                sx={{ fontWeight: 700, letterSpacing: 1 }}
            >
                Lesson Overview
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                {data.title}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 4, ...quillThemeOverrides }}>
                <ReactQuill
                    value={data.description || ''}
                    readOnly={true}
                    theme="bubble"
                />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    size="large"
                    onClick={onStart}
                    sx={{ px: 4 }}
                >
                    Start Lesson
                </Button>
            </Box>
        </Paper>
    );
};