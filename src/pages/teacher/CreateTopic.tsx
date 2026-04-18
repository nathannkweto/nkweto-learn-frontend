import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function CreateTopic() {
    const navigate = useNavigate();
    const [topic, setTopic] = useState({
        title: '',
        description: '',
        category: 'React',
        status: 'draft'
    });

    const handleSave = () => {
        // API call would go here
        console.log('Saved topic:', topic);
        navigate('/dashboard');
    };

    return (
        <Box maxWidth="md" mx="auto">
            <Typography variant="h5" gutterBottom>Create New Topic</Typography>
            <Paper sx={{ p: 4 }}>
                <TextField
                    fullWidth margin="normal" label="Topic Title"
                    value={topic.title}
                    onChange={(e) => setTopic({ ...topic, title: e.target.value })}
                />
                <TextField
                    fullWidth margin="normal" label="Description" multiline rows={4}
                    value={topic.description}
                    onChange={(e) => setTopic({ ...topic, description: e.target.value })}
                />
                <TextField
                    select fullWidth margin="normal" label="Category"
                    value={topic.category}
                    onChange={(e) => setTopic({ ...topic, category: e.target.value })}
                >
                    <MenuItem value="React">React</MenuItem>
                    <MenuItem value="TypeScript">TypeScript</MenuItem>
                    <MenuItem value="Material UI">Material UI</MenuItem>
                </TextField>
                <TextField
                    select fullWidth margin="normal" label="Status"
                    value={topic.status}
                    onChange={(e) => setTopic({ ...topic, status: e.target.value })}
                >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                </TextField>

                <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                    <Button variant="outlined" onClick={() => navigate('/dashboard')}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleSave}>Save Topic</Button>
                </Box>
            </Paper>
        </Box>
    );
}