import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import {
    Container, Typography, Box, Button, Paper,
    TextField, MenuItem, Alert, Checkbox,
    Stack, IconButton, Divider, Grid
} from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

import { getOpenAPIDefinition } from '../../api/generated/endpoints';
import type { QuizCreate } from '../../api/generated/models';

const api = getOpenAPIDefinition();

export const QuizBuilder = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const { register, control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<QuizCreate>({
        defaultValues: {
            topic_id: topicId,
            title: '',
            questions: [
                {
                    text: '',
                    type: 'multiple_choice',
                    order_index: 0,
                    options: [
                        { text: '', is_correct: false },
                        { text: '', is_correct: false },
                        { text: '', is_correct: false },
                        { text: '', is_correct: false }
                    ]
                }
            ]
        }
    });

    const { fields: questions, append: appendQuestion, remove: removeQuestion } = useFieldArray({
        control,
        name: 'questions'
    });

    const onSubmit = async (data: QuizCreate) => {
        setErrorMsg(null);
        try {
            // Clean up order indices and filter out empty options if necessary
            const payload = {
                ...data,
                questions: data.questions.map((q, i) => ({
                    ...q,
                    order_index: i,
                    // If short answer, we might not need options depending on backend requirements
                    options: q.type === 'short_answer' ? [] : q.options
                }))
            };

            // Casting payload to handle strict OpenAPI typing if needed
            await api.quizzesPost(payload as QuizCreate);
            navigate(`/teacher/topics/${topicId}`);
        } catch (err) {
            console.error('Failed to create quiz:', err);
            // Safe error handling without 'any'
            if (err instanceof Error) {
                setErrorMsg(err.message || 'An unexpected error occurred.');
            } else {
                setErrorMsg('Failed to create the quiz. Please check your inputs.');
            }
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: { xs: 2, md: 4 }, mb: 8 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                        <QuizRoundedIcon color="primary" />
                        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                            Quiz Builder
                        </Typography>
                    </Stack>
                    <Typography variant="body2" color="textSecondary">Create an assessment for this topic</Typography>
                </Box>
                <Button
                    variant="text"
                    startIcon={<ArrowBackRoundedIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                    Back
                </Button>
            </Box>

            {errorMsg && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{errorMsg}</Alert>}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Quiz Title Card */}
                <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid #edf2f7', backgroundColor: '#f8fafc' }}>
                    <TextField
                        fullWidth
                        label="Quiz Title"
                        placeholder="e.g., Introduction to React Final Quiz"
                        variant="outlined"
                        required
                        {...register('title', { required: 'Quiz title is required' })}
                        error={!!errors.title}
                        helperText={errors.title?.message}
                        sx={{ backgroundColor: 'white', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                </Paper>

                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, px: 1 }}>Questions</Typography>

                {/* Dynamic Questions List */}
                <Stack spacing={3}>
                    {questions.map((question, qIndex) => {
                        const questionType = watch(`questions.${qIndex}.type`);

                        return (
                            <Paper
                                key={question.id}
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    border: '1px solid #edf2f7',
                                    '&:hover': { borderColor: 'primary.light' }
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                        Question {qIndex + 1}
                                    </Typography>
                                    <IconButton
                                        color="error"
                                        size="small"
                                        onClick={() => removeQuestion(qIndex)}
                                        disabled={questions.length === 1}
                                    >
                                        <DeleteOutlineRoundedIcon />
                                    </IconButton>
                                </Box>

                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 8 }}>
                                        <TextField
                                            fullWidth
                                            label="Question Text"
                                            required
                                            multiline
                                            {...register(`questions.${qIndex}.text` as const, { required: true })}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Response Type"
                                            {...register(`questions.${qIndex}.type` as const)}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        >
                                            <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
                                            <MenuItem value="true_false">True / False</MenuItem>
                                            <MenuItem value="short_answer">Short Answer</MenuItem>
                                        </TextField>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

                                {/* Options UI */}
                                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #f1f5f9' }}>
                                    {questionType === 'short_answer' ? (
                                        <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic', py: 1 }}>
                                            Students will provide a text response. Manual grading may be required.
                                        </Typography>
                                    ) : (
                                        <Stack spacing={1.5}>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', ml: 1 }}>
                                                Answer Options (Mark the correct answer)
                                            </Typography>
                                            {[0, 1, 2, 3].map((oIndex) => (
                                                <Box key={oIndex} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Checkbox
                                                        {...register(`questions.${qIndex}.options.${oIndex}.is_correct` as const)}
                                                        color="success"
                                                    />
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        placeholder={questionType === 'true_false' && oIndex < 2 ? (oIndex === 0 ? "True" : "False") : `Option ${oIndex + 1}`}
                                                        {...register(`questions.${qIndex}.options.${oIndex}.text` as const)}
                                                        sx={{ backgroundColor: 'white', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                    />
                                                </Box>
                                            ))}
                                        </Stack>
                                    )}
                                </Box>
                            </Paper>
                        );
                    })}

                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<AddRoundedIcon />}
                        sx={{
                            py: 2,
                            borderStyle: 'dashed',
                            borderRadius: 3,
                            borderWidth: 2,
                            textTransform: 'none',
                            fontWeight: 600
                        }}
                        onClick={() => appendQuestion({
                            text: '',
                            type: 'multiple_choice',
                            order_index: questions.length,
                            options: [
                                { text: '', is_correct: false },
                                { text: '', is_correct: false },
                                { text: '', is_correct: false },
                                { text: '', is_correct: false }
                            ]
                        })}
                    >
                        Add Another Question
                    </Button>
                </Stack>

                {/* Form Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 6, pt: 3, borderTop: '1px solid #edf2f7' }}>
                    <Button
                        variant="text"
                        onClick={() => navigate(`/teacher/topics/${topicId}`)}
                        disabled={isSubmitting}
                        sx={{ fontWeight: 600 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        startIcon={<SaveRoundedIcon />}
                        sx={{ borderRadius: 2, px: 4, py: 1, fontWeight: 600, boxShadow: theme => theme.shadows[2] }}
                    >
                        {isSubmitting ? 'Saving...' : 'Create Quiz'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};