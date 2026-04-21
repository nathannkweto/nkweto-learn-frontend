import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip,
    Box, CircularProgress, Alert, Button, Breadcrumbs, Link
} from '@mui/material';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { getOpenAPIDefinition } from '../../api/generated/endpoints';
import type { SubmissionSummary } from '../../api/generated/models';

const api = getOpenAPIDefinition();

export const QuizSubmissions = () => {
    const { topicId, quizId } = useParams<{ topicId: string, quizId: string }>();
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState<SubmissionSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSubmissions = async () => {
            if (!quizId) return;
            try {
                const response = await api.submissionsGet({ quizId });
                setSubmissions(response.data);
            } catch (err) {
                console.error(err);
                setError("Could not load submissions for this quiz.");
            } finally {
                setLoading(false);
            }
        };
        void fetchSubmissions();
    }, [quizId]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
                <Link underline="hover" color="inherit" sx={{ cursor: 'pointer' }} onClick={() => navigate(`/teacher/topics/${topicId}`)}>
                    Topic Details
                </Link>
                <Typography color="text.primary">Quiz Submissions</Typography>
            </Breadcrumbs>

            <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
                Quiz Submissions
            </Typography>

            {error ? (
                <Alert severity="error">{error}</Alert>
            ) : submissions.length === 0 ? (
                <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3 }}>
                    <Typography color="textSecondary">No students have submitted this quiz yet.</Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #edf2f7', borderRadius: 3 }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Student</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Date Submitted</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Score</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {submissions.map((sub) => (
                                <TableRow key={sub.id} hover>
                                    <TableCell sx={{ fontWeight: 500 }}>
                                        {sub.student_name || sub.student_id}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(sub.submitted_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                            {sub.total_score ?? 'N/A'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={sub.status}
                                            size="small"
                                            color={(sub.status as string) === 'GRADED' || (sub.status as string) === 'PASSED' ? "success" : "warning"}
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<VisibilityRoundedIcon />}
                                            onClick={() => navigate(`/teacher/submissions/${sub.id}`)}
                                            sx={{ borderRadius: 2, textTransform: 'none' }}
                                        >
                                            View Review
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};