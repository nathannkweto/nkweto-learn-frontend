import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';

export default function StudentDashboard() {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>Welcome back, Student!</Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Active Quizzes</Typography>
                            <Typography variant="h5">2 Pending</Typography>
                            <Button variant="contained" sx={{ mt: 2 }} fullWidth>Resume Learning</Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Available Topics</Typography>
                            {/* Map through topics here */}
                            <Typography variant="body2" color="textSecondary">
                                React Basics, Advanced TypeScript...
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}