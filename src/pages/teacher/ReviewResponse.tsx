import { Box, Typography, Paper, Chip, Grid } from '@mui/material';

// Mock submission data
const submissionDetails = {
    studentName: "Jane Doe",
    quizTitle: "React Hooks Assessment",
    submittedAt: "2023-10-25 14:30",
    score: "1/2",
    answers: [
        {
            questionText: "Which hook is used to manage local state?",
            studentAnswer: "useState",
            correctAnswer: "useState",
            isCorrect: true
        },
        {
            questionText: "Can you use hooks inside a class component?",
            studentAnswer: "Yes",
            correctAnswer: "No",
            isCorrect: false
        }
    ]
};

export default function ReviewResponse() {
    return (
        <Box sx={{ maxWidth: 'md', mx: 'auto' }}>
            <Typography variant="h5" gutterBottom>Review Submission</Typography>

            <Paper sx={{ p: 3, mb: 4, bgcolor: '#f8f9fa' }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="subtitle2" color="textSecondary">Student</Typography>
                        <Typography variant="body1">{submissionDetails.studentName}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="subtitle2" color="textSecondary">Quiz</Typography>
                        <Typography variant="body1">{submissionDetails.quizTitle}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="subtitle2" color="textSecondary">Score</Typography>
                        <Typography variant="h6" color="primary">{submissionDetails.score}</Typography>
                    </Grid>
                </Grid>
            </Paper>

            {submissionDetails.answers.map((ans, idx) => (
                <Paper key={idx} sx={{ p: 3, mb: 2, borderLeft: `6px solid ${ans.isCorrect ? '#4caf50' : '#f44336'}` }}>
                    <Typography variant="subtitle1" gutterBottom>
                        {idx + 1}. {ans.questionText}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" color="textSecondary" sx={{ width: 120 }}>Student Answer:</Typography>
                            <Chip
                                label={ans.studentAnswer}
                                color={ans.isCorrect ? "success" : "error"}
                                variant="outlined"
                            />
                        </Box>

                        {!ans.isCorrect && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" color="textSecondary" sx={{ width: 120 }}>Correct Answer:</Typography>
                                <Chip label={ans.correctAnswer} color="success" size="small" />
                            </Box>
                        )}
                    </Box>
                </Paper>
            ))}
        </Box>
    );
}