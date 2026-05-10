import React from 'react';
import { Box, Typography, Button, Divider, Container } from '@mui/material';
import type { Theme } from '@mui/material/styles'; // Fix 'any' type
import ReactQuill from 'react-quill-new';
import { CodeSnippet } from './CodeSnippet';
import { useFragment } from '../../../graphql/generated';
import type { FragmentType } from '../../../graphql/generated';
import {
    PageFieldsFragmentDoc,
    PageBlockFieldsFragmentDoc,
} from '../../../graphql/generated/graphql';

interface Props {
    page: FragmentType<typeof PageFieldsFragmentDoc>;
    onNext: () => void;
    onPrev: () => void;
    hasPrevPage: boolean;
    hasNextPage: boolean;
}

const quillThemeOverrides = {
    '& .ql-editor': { color: 'text.primary' },
    '& .ql-toolbar': {
        borderColor: 'divider',
        backgroundColor: 'background.default',
        '& .ql-stroke': { stroke: (theme: Theme) => theme.palette.text.primary },
        '& .ql-fill': { fill: (theme: Theme) => theme.palette.text.primary },
        '& .ql-picker': { color: 'text.primary' },
    },
    '& .ql-container': { borderColor: 'divider' },
    '& .ql-tooltip': {
        backgroundColor: 'background.default',
        borderColor: 'divider',
        color: 'text.primary',
        boxShadow: (theme: Theme) => theme.shadows[4],
    }
};

export const StudentPageView: React.FC<Props> = ({ page, onNext, onPrev, hasPrevPage, hasNextPage }) => {
    const data = useFragment(PageFieldsFragmentDoc, page);

    const blocks = useFragment(PageBlockFieldsFragmentDoc, data.blocks);

    return (
        <Container
            maxWidth="md"
            sx={{ py: 6, backgroundColor: 'background.default', minHeight: '100vh', ...quillThemeOverrides }}
        >
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 4 }}>
                {data.title}
            </Typography>

            <Box sx={{ mb: 8 }}>
                {blocks.map((block) => (
                    <Box key={block.id} sx={{ mb: 4 }}>
                        {block.type === 'TEXT' ? (
                            <ReactQuill value={block.content} readOnly={true} theme="bubble" />
                        ) : (
                            <CodeSnippet code={block.content} language={block.language || 'javascript'} />
                        )}
                    </Box>
                ))}
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="outlined" onClick={onPrev}>
                    {hasPrevPage ? 'Previous' : 'Back to Lesson'}
                </Button>
                <Button variant="outlined" onClick={onNext}>
                    {hasNextPage ? 'Next Page' : 'Finish Lesson'}
                </Button>
            </Box>
        </Container>
    );
};