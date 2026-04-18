import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
    Container, Typography, Box, Button, Card, CardContent,
    CircularProgress, Alert, Radio, RadioGroup, FormControlLabel, FormControl, TextField
} from '@mui/material';
import { getOpenAPIDefinition } from '../../api/generated/endpoints';
import type { QuizStudentView, SubmissionCreate } from '../../api/generated/models';

const api = getOpenAPIDefinition();

// We create a custom map type for React Hook Form to handle dynamic questions easily
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

    const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>();

    useEffect(() => {
        const fetchQuiz = async () => {
            if (!quizId) return;
            try {
                // Notice we are using the Student View endpoint here!
                const response = await api.quizzesQuizIdGet(quizId);
                setQuiz(response.data);
            } catch (err) {
                // Fix 1: Removed ': any'
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [quizId]);

    const onSubmit = async (data: FormValues) => {
        setSubmitError(null);
        if (!quizId) return;

        // Transform our flat form data into the specific array format the backend wants
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
            // If successful, take them back to the dashboard (or to a "Results" page later!)
            navigate('/student/dashboard');
        } catch (err) {
            // Fix 1: Safely handle error without ': any'
            const axiosError = err as { response?: { data?: { message?: string } } };
            console.error('Submission failed', err);
            setSubmitError(axiosError.response?.data?.message || 'Failed to submit quiz.');
        }
    };

    // Fix 3: Moved display, justifyContent, and mt into the sx prop
    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    // Fix 3: Moved mt into the sx prop
    if (!quiz) return <Container sx={{ mt: 4 }}><Alert severity="error">Quiz not found.</Alert></Container>;

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
            {/* Fix 2: Cast quiz.title to string */}
            <Typography variant="h4" gutterBottom>{String(quiz.title)}</Typography>
            {submitError && <Alert severity="error" sx={{ mb: 3 }}>{submitError}</Alert>}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                {quiz.questions?.map((question, index) => (
                    <Card key={question.id} sx={{ mb: 3 }}>
                        <CardContent>
                            {/* Fix 2 & 3: Cast question.text to string and moved mb into sx */}
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                {index + 1}. {String(question.text)}
                            </Typography>

                            {/* Multiple Choice & True/False */}
                            {(question.type === 'multiple_choice' || question.type === 'true_false') && (
                                <FormControl component="fieldset" fullWidth>
                                    {/* We use standard HTML radio logic hooked into React Hook Form to bypass complex MUI Controller setups */}
                                    <RadioGroup>
                                        {question.options?.map((option) => (
                                            <FormControlLabel
                                                key={option.id}
                                                value={option.id}
                                                control={<Radio {...register(`${question.id}.selected_option_id`)} required />}
                                                label={String(option.text)} // Fix 2: Cast option text as well just in case
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            )}

                            {/* Short Answer */}
                            {question.type === 'short_answer' && (
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    placeholder="Type your answer here..."
                                    {...register(`${question.id}.text_response`, { required: true })}
                                />
                            )}
                        </CardContent>
                    </Card>
                ))}

                {/* Fix 3: Moved display, justifyContent, and gap into sx */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button onClick={() => navigate(-1)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};