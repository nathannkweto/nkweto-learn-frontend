import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import {
    Container, Typography, Box, Button, Card, CardContent,
    TextField, MenuItem, IconButton, Divider, Alert, Checkbox, FormControlLabel, Grid
} from '@mui/material';
// Optional: If you want icons, run `npm install @mui/icons-material`
// import DeleteIcon from '@mui/icons-material/Delete';
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
                { text: '', type: 'multiple_choice', order_index: 0, options: [{ text: '', is_correct: false }] }
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
            // Clean up order indices before sending
            const payload = {
                ...data,
                questions: data.questions.map((q, i) => ({ ...q, order_index: i }))
            };
            await api.quizzesPost(payload);
            navigate(`/teacher/topics/${topicId}`);
        } catch (err: any) {
            console.error('Failed to create quiz:', err);
            setErrorMsg(err.response?.data?.message || 'Failed to create the quiz. Please check your inputs.');
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
            <Typography variant="h4" gutterBottom>Quiz Builder</Typography>
            {errorMsg && <Alert severity="error" sx={{ mb: 3 }}>{errorMsg}</Alert>}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Quiz Title */}
                <Card sx={{ mb: 4, p: 2 }}>
                    <TextField
                        fullWidth
                        label="Quiz Title"
                        variant="outlined"
                        required
                        {...register('title', { required: 'Quiz title is required' })}
                        error={!!errors.title}
                        helperText={errors.title?.message}
                    />
                </Card>

                {/* Dynamic Questions List */}
                {questions.map((question, qIndex) => {
                    const questionType = watch(`questions.${qIndex}.type`);

                    return (
                        <Card key={question.id} sx={{ mb: 3, position: 'relative', overflow: 'visible' }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="h6">Question {qIndex + 1}</Typography>
                                    <Button color="error" onClick={() => removeQuestion(qIndex)} disabled={questions.length === 1}>
                                        Remove Question
                                    </Button>
                                </Box>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={8}>
                                        <TextField
                                            fullWidth
                                            label="Question Text"
                                            required
                                            {...register(`questions.${qIndex}.text` as const, { required: true })}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Type"
                                            {...register(`questions.${qIndex}.type` as const)}
                                        >
                                            <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
                                            <MenuItem value="true_false">True / False</MenuItem>
                                            <MenuItem value="short_answer">Short Answer</MenuItem>
                                        </TextField>
                                    </Grid>
                                </Grid>

                                {/* Simplified Options UI depending on type */}
                                <Box mt={3} p={2} bgcolor="#f8f9fa" borderRadius={2}>
                                    {questionType === 'short_answer' ? (
                                        <Typography variant="body2" color="textSecondary">
                                            Students will type their answer. This will be flagged for manual review.
                                        </Typography>
                                    ) : (
                                        <>
                                            <Typography variant="subtitle2" mb={1}>Options (Check the correct ones)</Typography>
                                            {/* For simplicity in this step, we hardcode 4 options for MCQs.
                          A nested useFieldArray can be added here if you want dynamic option counts. */}
                                            {[0, 1, 2, 3].map((oIndex) => (
                                                <Box key={oIndex} display="flex" alignItems="center" mb={1} gap={2}>
                                                    <FormControlLabel
                                                        control={<Checkbox {...register(`questions.${qIndex}.options.${oIndex}.is_correct` as const)} />}
                                                        label=""
                                                    />
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        placeholder={`Option ${oIndex + 1}`}
                                                        {...register(`questions.${qIndex}.options.${oIndex}.text` as const)}
                                                    />
                                                </Box>
                                            ))}
                                        </>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    );
                })}

                <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 4, py: 2, borderStyle: 'dashed' }}
                    onClick={() => appendQuestion({ text: '', type: 'multiple_choice', order_index: questions.length, options: [{ text: '', is_correct: false }] })}
                >
                    + Add Another Question
                </Button>

                <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button onClick={() => navigate(`/teacher/topics/${topicId}`)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Quiz'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};