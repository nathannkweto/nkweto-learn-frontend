import { Box, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function TeacherDashboard() {
    const navigate = useNavigate();

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Teacher Overview</Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Total Topics</Typography>
                            <Typography variant="h3">12</Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => navigate('/teacher/topics/new')}>Create Topic</Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: '#fff3e0' }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Pending Reviews</Typography>
                            <Typography variant="h3">8</Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => navigate('/responses')}>Review Now</Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}