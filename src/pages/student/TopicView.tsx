import { Box, Typography, Paper, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function TopicView() {
    // Fix 1: Commented out 'id' until you are ready to fetch real data to satisfy TS6133
    // const { id } = useParams();
    const navigate = useNavigate();

    // Mock data fetching based on ID
    const topic = {
        title: "Introduction to React Hooks",
        description: "Learn how to manage state and side effects in functional components.",
        content: "Hooks were added to React in version 16.8. They let you use state and other React features without writing a class. The most common hooks are useState and useEffect...",
        quizId: "quiz-123"
    };

    return (
        // Fix 2: Moved maxWidth and mx into the sx prop
        <Box sx={{ maxWidth: 'md', mx: 'auto' }}>
            <Paper sx={{ p: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>{topic.title}</Typography>
                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    {topic.description}
                </Typography>
                <Divider sx={{ my: 3 }} />

                {/* Fix 2: Moved lineHeight into the sx prop */}
                <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
                    {topic.content}
                </Typography>
                {/* Additional lesson blocks, videos, or code snippets would render here */}
            </Paper>

            {/* Fix 2: Moved display and justifyContent into the sx prop */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => navigate(`/quiz/${topic.quizId}/take`)}
                >
                    Take the Quiz
                </Button>
            </Box>
        </Box>
    );
}