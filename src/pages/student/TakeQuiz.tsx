import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
    Container, Typography, Box, Button, Card, CardContent,
    CircularProgress, Alert, Radio, RadioGroup, FormControlLabel,
    FormControl, TextField, Paper, Stack, Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import QuizIcon from '@mui/icons-material/Quiz';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { getOpenAPIDefinition } from '../../api/generated/endpoints';
import type { QuizStudentView, SubmissionCreate } from '../../api/generated/models';

const api = getOpenAPIDefinition();

type FormValues = {
    [questionId: string]: {
        selected_option_id?: string;
        text_response?: string;
    };
};

export const TakeQuiz = () => {
    const { quizId } = useParams<{ quizId: string }>();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState<QuizStudentView | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [existingSubmissionId, setExistingSubmissionId] = useState<string | null>(null);

    const { register, handleSubmit, control, formState: { isSubmitting } } = useForm<FormValues>();

    useEffect(() => {
        const fetchQuizAndStatus = async () => {
            if (!quizId) return;
            try {
                // 1. Check if the user has already submitted this quiz
                const subResponse = await api.submissionsGet({ quizId });

                if (subResponse.data && subResponse.data.length > 0) {
                    setExistingSubmissionId(subResponse.data[0].id);
                    return; // Skip loading the quiz form if already submitted
                }

                // 2. If not submitted, fetch the quiz details
                const quizResponse = await api.quizzesQuizIdGet(quizId);
                setQuiz(quizResponse.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        void fetchQuizAndStatus();
    }, [quizId]);

    const onSubmit = async (data: FormValues) => {
        setSubmitError(null);
        if (!quizId) return;

        const answersArray = Object.entries(data).map(([qId, response]) => ({
            question_id: qId,
            selected_option_id: response.selected_option_id || undefined,
            text_response: response.text_response || undefined,
        }));

        const payload: SubmissionCreate = {
            quiz_id: quizId,
            answers: answersArray
        };

        try {
            await api.submissionsPost(payload);
            navigate('/student/dashboard');
        } catch (err) {
            const axiosError = err as { response?: { data?: { message?: string }, status?: number } };
            // Catching backend 409 Conflict if they bypassed UI check
            if (axiosError.response?.status === 409) {
                setSubmitError("You have already submitted this quiz.");
            } else {
                setSubmitError(axiosError.response?.data?.message || 'Failed to submit quiz.');
            }
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress thickness={5} />
            </Box>
        );
    }

    // ALREADY SUBMITTED VIEW
    if (existingSubmissionId) {
        return (
            <Container
                maxWidth="sm"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: '80vh'
                }}
            >
                <Paper elevation={0} sx={{ p: 5, textAlign: 'center', borderRadius: 3, border: '1px solid #edf2f7' }}>
                    <CheckCircleRoundedIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                        Quiz Already Completed
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 4 }}>
                        You have already submitted your answers for this assessment. Multiple attempts are not permitted.
                    </Typography>
                    <Button
                        variant="contained"
                        disableElevation
                        onClick={() => navigate(-1)}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 4 }}
                    >
                        Back
                    </Button>
                </Paper>
            </Container>
        );
    }

    if (!quiz) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error" variant="filled" sx={{ borderRadius: 3 }}>Quiz not found.</Alert>
            </Container>
        );
    }

    // MAIN QUIZ FORM VIEW
    return (
        <Box sx={{ backgroundColor: '#f1f5f9', minHeight: '100vh', pb: 10 }}>
            <Paper
                elevation={0}
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    py: 2,
                    mb: 4
                }}
            >
                <Container maxWidth="md">
                    <Stack
                        direction="row"
                        sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        <Stack
                            direction="row"
                            spacing={1.5}
                            sx={{ alignItems: 'center' }}
                        >
                            <QuizIcon color="primary" />
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                {String(quiz.title)}
                            </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                            {quiz.questions?.length} Questions
                        </Typography>
                    </Stack>
                </Container>
            </Paper>

            <Container maxWidth="md">
                {submitError && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {submitError}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    {quiz.questions?.map((question, index) => (
                        <Card
                            key={question.id}
                            elevation={0}
                            sx={{
                                mb: 3,
                                borderRadius: 4,
                                border: '1px solid',
                                borderColor: 'divider',
                                overflow: 'visible'
                            }}
                        >
                            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: 'primary.main',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        mb: 1,
                                        letterSpacing: '0.05em'
                                    }}
                                >
                                    Question {index + 1}
                                </Typography>

                                <Typography variant="h5" sx={{ mb: 4, fontWeight: 600, color: '#1e293b' }}>
                                    {String(question.text)}
                                </Typography>

                                <Divider sx={{ mb: 4, opacity: 0.6 }} />

                                {(question.type === 'multiple_choice' || question.type === 'true_false') && (
                                    <FormControl component="fieldset" fullWidth>
                                        <Controller
                                            name={`${question.id}.selected_option_id`}
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <RadioGroup {...field}>
                                                    <Stack spacing={1.5}>
                                                        {question.options?.map((option) => (
                                                            <Paper
                                                                key={option.id}
                                                                elevation={0}
                                                                sx={{
                                                                    border: '1px solid',
                                                                    borderColor: field.value === option.id ? 'primary.main' : 'divider',
                                                                    borderRadius: 2,
                                                                    transition: '0.2s',
                                                                    backgroundColor: field.value === option.id ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
                                                                    '&:hover': {
                                                                        borderColor: 'primary.main',
                                                                        backgroundColor: 'rgba(25, 118, 210, 0.02)'
                                                                    }
                                                                }}
                                                            >
                                                                <FormControlLabel
                                                                    value={option.id}
                                                                    control={<Radio />}
                                                                    label={String(option.text)}
                                                                    sx={{
                                                                        width: '100%',
                                                                        m: 0,
                                                                        px: 2,
                                                                        py: 1,
                                                                        '& .MuiTypography-root': {
                                                                            fontSize: '1rem',
                                                                            fontWeight: 500,
                                                                            width: '100%'
                                                                        }
                                                                    }}
                                                                />
                                                            </Paper>
                                                        ))}
                                                    </Stack>
                                                </RadioGroup>
                                            )}
                                        />
                                    </FormControl>
                                )}

                                {question.type === 'short_answer' && (
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        placeholder="Type your explanation here..."
                                        {...register(`${question.id}.text_response`, { required: true })}
                                        slotProps={{
                                            input: {
                                                sx: {
                                                    fontSize: '1.1rem', borderRadius: 3
                                                }
                                            }
                                        }}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    ))}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 6 }}>
                        <Button
                            onClick={() => navigate(-1)}
                            disabled={isSubmitting}
                            sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
                        >
                            Cancel and Exit
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                            endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                            sx={{
                                px: 5,
                                py: 1.5,
                                borderRadius: 3,
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 700,
                                boxShadow: '0px 4px 14px rgba(25, 118, 210, 0.3)'
                            }}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Answers'}
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};