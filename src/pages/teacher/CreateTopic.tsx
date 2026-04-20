import { useState } from 'react';
import {
    Box, Button, TextField, Typography, Paper, MenuItem,
    Container, Breadcrumbs, Link, Stack, useTheme, useMediaQuery,
    Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

export default function CreateTopic() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [topic, setTopic] = useState({
        title: '',
        description: '',
        category: 'React',
        status: 'draft'
    });

    const handleSave = () => {
        // API call logic would be integrated here
        console.log('Saved topic:', topic);
        navigate('/teacher/dashboard');
    };

    return (
        <Container maxWidth="md" sx={{ mt: { xs: 2, md: 4 }, mb: 8 }}>
            {/* Consistent Breadcrumbs */}
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
                <Link
                    underline="hover"
                    color="inherit"
                    sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}
                    onClick={() => navigate('/teacher/dashboard')}
                >
                    Dashboard
                </Link>
                <Typography color="text.primary" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    New Topic
                </Typography>
            </Breadcrumbs>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}>
                    Create New Topic
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Set up a new educational module for your students.
                </Typography>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, md: 5 },
                    borderRadius: 4,
                    border: '1px solid #edf2f7',
                    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.02)'
                }}
            >
                <Stack spacing={3}>
                    <TextField
                        fullWidth
                        label="Topic Title"
                        placeholder="e.g. Advanced State Management"
                        value={topic.title}
                        onChange={(e) => setTopic({ ...topic, title: e.target.value })}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />

                    <TextField
                        fullWidth
                        label="Description"
                        multiline
                        rows={4}
                        placeholder="What will students learn in this topic?"
                        value={topic.description}
                        onChange={(e) => setTopic({ ...topic, description: e.target.value })}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />

                    <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
                        <TextField
                            select
                            fullWidth
                            label="Category"
                            value={topic.category}
                            onChange={(e) => setTopic({ ...topic, category: e.target.value })}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        >
                            <MenuItem value="React">React</MenuItem>
                            <MenuItem value="TypeScript">TypeScript</MenuItem>
                            <MenuItem value="Material UI">Material UI</MenuItem>
                        </TextField>

                        <TextField
                            select
                            fullWidth
                            label="Initial Status"
                            value={topic.status}
                            onChange={(e) => setTopic({ ...topic, status: e.target.value })}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        >
                            <MenuItem value="draft">Draft</MenuItem>
                            <MenuItem value="published">Published</MenuItem>
                        </TextField>
                    </Stack>

                    <Divider sx={{ my: 1 }} />

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2
                    }}>
                        <Button
                            startIcon={<ArrowBackRoundedIcon />}
                            onClick={() => navigate('/teacher/dashboard')}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                color: 'text.secondary'
                            }}
                        >
                            Back to Dashboard
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                            disableElevation
                            startIcon={<SaveRoundedIcon />}
                            sx={{
                                borderRadius: 2,
                                px: 4,
                                py: 1.2,
                                textTransform: 'none',
                                fontWeight: 600
                            }}
                        >
                            Save Topic
                        </Button>
                    </Box>
                </Stack>
            </Paper>
        </Container>
    );
}