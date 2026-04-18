import { Box, Typography, Paper, Button, Divider } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

export default function TopicView() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock data fetching based on ID
    const topic = {
        title: "Introduction to React Hooks",
        description: "Learn how to manage state and side effects in functional components.",
        content: "Hooks were added to React in version 16.8. They let you use state and other React features without writing a class. The most common hooks are useState and useEffect...",
        quizId: "quiz-123"
    };

    return (
        <Box maxWidth="md" mx="auto">
            <Paper sx={{ p: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>{topic.title}</Typography>
                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    {topic.description}
                </Typography>
                <Divider sx={{ my: 3 }} />

                <Typography variant="body1" paragraph lineHeight={1.8}>
                    {topic.content}
                </Typography>
                {/* Additional lesson blocks, videos, or code snippets would render here */}
            </Paper>

            <Box display="flex" justifyContent="center">
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