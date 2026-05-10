import { Box, Typography, Paper } from '@mui/material';
import type {ReactNode} from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: ReactNode;
    withPaper?: boolean;
    align?: 'left' | 'center';
}

export const PageHeader = ({ title, description, action, withPaper = false, align = 'left' }: PageHeaderProps) => {
    const content = (
        <Box sx={{ display: 'flex', justifyContent: align === 'center' ? 'center' : 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, textAlign: align }}>
            <Box sx={{ flex: 1, minWidth: '300px' }}>
                <Typography variant={withPaper ? "h3" : "h4"} sx={{ fontWeight: 800, color: '#0f172a', mb: description ? 2 : 0, fontSize: withPaper ? { xs: '2rem', md: '2.5rem' } : undefined }}>
                    {title}
                </Typography>
                {description && (
                    <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.7, fontSize: '1.1rem' }}>
                        {description}
                    </Typography>
                )}
            </Box>
            {action && <Box>{action}</Box>}
        </Box>
    );

    if (withPaper) {
        return <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, mb: 4, borderRadius: 3, border: '1px solid #e2e8f0' }}>{content}</Paper>;
    }
    return <Box sx={{ mb: 4 }}>{content}</Box>;
};