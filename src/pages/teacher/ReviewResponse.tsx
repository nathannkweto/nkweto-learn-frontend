import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Chip, Grid, Stack, Divider, Container, CircularProgress, Alert } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import { getOpenAPIDefinition } from '../../api/generated/endpoints';
import type { SubmissionDetail } from '../../api/generated/models';

const api = getOpenAPIDefinition();

export const ReviewResponse = () => {
    const { submissionId } = useParams<{ submissionId: string }>();
    const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSubmission = async () => {
            if (!submissionId) return;
            try {
                const response = await api.submissionsSubmissionIdGet(submissionId);
                setSubmission(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load submission details.");
            } finally {
                setLoading(false);
            }
        };
        void fetchSubmission();
    }, [submissionId]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    if (error || !submission) return <Container sx={{ mt: 4 }}><Alert severity="error">{error || "Submission not found"}</Alert></Container>;

    // Calculate scores strictly using snake_case properties
    const totalQuestions = submission.answers?.length ?? 0;
    const correctCount = submission.answers?.filter(a => a.is_correct).length ?? 0;

    // FIX: Cast through unknown first, or use Number() to bypass the TS2352 error
    const percentage = Math.round((submission.total_score as unknown as number) || 0);

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, letterSpacing: '-0.02em' }}>
                Review Submission
            </Typography>

            <Paper
                elevation={0}
                sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid #edf2f7', backgroundColor: '#f8fafc' }}
            >
                <Grid container spacing={3}>
                    <Grid size={{ xs: 2, sm: 4 }}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                            <PersonOutlineRoundedIcon fontSize="small" color="action" />
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Student</Typography>
                        </Stack>
                        {/* FIX: Wrap in String() to bypass the ReactNode object rendering error */}
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {String(submission.student_name ?? 'Unknown Student')}
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 2, sm: 4 }}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                            <EventNoteRoundedIcon fontSize="small" color="action" />
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Quiz</Typography>
                        </Stack>
                        {/* FIX: Wrap in String() to bypass the ReactNode object rendering error */}
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {String(submission.quiz_title ?? 'Untitled Quiz')}
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 2, sm: 4 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', display: 'block', mb: 0.5 }}>Final Score</Typography>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: percentage >= 70 ? 'success.main' : 'error.main' }}>
                                {correctCount}/{totalQuestions}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">({percentage}%)</Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>

            <Divider sx={{ mb: 4 }} />

            <Stack spacing={2}>
                {submission.answers?.map((ans, idx) => {
                    // Stripped down to only use the strict snake_case names
                    const isCorrect = ans.is_correct;
                    const questionText = ans.question_text;
                    const selectedOptionId = ans.selected_option_id;
                    const correctOptionId = ans.correct_option_id;
                    const textResponse = ans.text_response;

                    return (
                        <Paper
                            key={ans.question_id}
                            elevation={0}
                            sx={{
                                p: 3, borderRadius: 3, border: '1px solid #edf2f7', position: 'relative', overflow: 'hidden',
                                '&::before': {
                                    content: '""', position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px',
                                    backgroundColor: isCorrect ? '#4caf50' : '#f44336'
                                }
                            }}
                        >
                            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start', mb: 2 }}>
                                {isCorrect ? <CheckCircleRoundedIcon color="success" sx={{ mt: 0.3 }} /> : <CancelRoundedIcon color="error" sx={{ mt: 0.3 }} />}
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.4 }}>
                                    {idx + 1}. {questionText || `Question ${idx + 1}`}
                                </Typography>
                            </Stack>

                            <Box sx={{ ml: 4.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 110 }}>Your Response:</Typography>
                                    <Chip
                                        label={selectedOptionId || textResponse || "No answer provided"}
                                        size="small"
                                        color={isCorrect ? "success" : "error"}
                                        variant={isCorrect ? "filled" : "outlined"}
                                    />
                                </Box>

                                {!isCorrect && correctOptionId && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 110 }}>Correct Answer:</Typography>
                                        <Chip
                                            label={correctOptionId}
                                            size="small"
                                            color="success"
                                            variant="outlined"
                                            sx={{ backgroundColor: '#e8f5e9', border: '1px solid #a5d6a7', color: '#2e7d32' }}
                                        />
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    );
                })}
            </Stack>
        </Container>
    );
};