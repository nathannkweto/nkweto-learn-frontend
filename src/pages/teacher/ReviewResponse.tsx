import { Box, Typography, Paper, Chip, Grid, Stack, Divider, Container } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';

// Mock submission data
const submissionDetails = {
    studentName: "Jane Doe",
    quizTitle: "React Hooks Assessment",
    submittedAt: "2023-10-25 14:30",
    score: "1/2",
    percentage: 50,
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

export const ReviewResponse = () => {
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, letterSpacing: '-0.02em' }}>
                Review Submission
            </Typography>

            {/* Overview Card */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 3,
                    border: '1px solid #edf2f7',
                    backgroundColor: '#f8fafc'
                }}
            >
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                            <PersonOutlineRoundedIcon fontSize="small" color="action" />
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Student</Typography>
                        </Stack>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{submissionDetails.studentName}</Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                            <EventNoteRoundedIcon fontSize="small" color="action" />
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Quiz</Typography>
                        </Stack>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{submissionDetails.quizTitle}</Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', display: 'block', mb: 0.5 }}>Final Score</Typography>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: submissionDetails.percentage >= 70 ? 'success.main' : 'error.main' }}>
                                {submissionDetails.score}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                ({submissionDetails.percentage}%)
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>

            <Divider sx={{ mb: 4 }} />

            {/* Answers Section */}
            <Stack spacing={2}>
                {submissionDetails.answers.map((ans, idx) => (
                    <Paper
                        key={idx}
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: '1px solid #edf2f7',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: '6px',
                                backgroundColor: ans.isCorrect ? '#4caf50' : '#f44336'
                            }
                        }}
                    >
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start', mb: 2 }}>
                            {ans.isCorrect ? (
                                <CheckCircleRoundedIcon color="success" sx={{ mt: 0.3 }} />
                            ) : (
                                <CancelRoundedIcon color="error" sx={{ mt: 0.3 }} />
                            )}
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.4 }}>
                                {idx + 1}. {ans.questionText}
                            </Typography>
                        </Stack>

                        <Box sx={{ ml: 4.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 110 }}>Student Answer:</Typography>
                                <Chip
                                    label={ans.studentAnswer}
                                    size="small"
                                    color={ans.isCorrect ? "success" : "error"}
                                    variant={ans.isCorrect ? "filled" : "outlined"}
                                    sx={{ fontWeight: 600 }}
                                />
                            </Box>

                            {!ans.isCorrect && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 110 }}>Correct Answer:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                                        {ans.correctAnswer}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                ))}
            </Stack>
        </Container>
    );
};