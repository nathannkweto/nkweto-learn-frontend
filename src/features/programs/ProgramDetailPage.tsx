import React, { useState } from 'react';
import { Box, Container, CircularProgress, Typography, Alert, Snackbar } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { StudentProgramView } from './components/StudentProgramView';
import { TeacherProgramView } from './components/TeacherProgramView';
import { EnrollmentModal } from './components/EnrollmentModal'; // ✅ Import the new modal
import { useQuery } from '@apollo/client/react';
import { GetProgramDocument } from '../../graphql/generated/graphql';
import { getOpenAPIDefinition } from '../../api/generated/endpoints';
import { useAuth } from '../../hooks/useAuth';

const api = getOpenAPIDefinition();

export const ProgramDetail: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const { programId } = useParams<{ programId: string }>();
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false); // ✅ Modal state
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [enrollError, setEnrollError] = useState<string | null>(null);

    const { data, loading, error, refetch } = useQuery(GetProgramDocument, {
        variables: { id: programId! },
        skip: !programId,
    });

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
    if (error || !data?.program) return <Typography>Program not found.</Typography>;

    const handleEnrollClick = () => {
        if (!isAuthenticated) {
            setEnrollError("You must be logged in to enroll.");
            return;
        }
        setIsModalOpen(true);
    };

    const handleEnrollSubmit = async (githubUrl: string) => {
        setIsEnrolling(true);
        setEnrollError(null);
        try {
            await api.enrollInProgram(programId!, {
                github_repo_url: githubUrl
            });
            await refetch();
            setIsModalOpen(false); // Close modal on success
        } catch (err) {
            console.error("Failed to enroll:", err);
            setEnrollError("Failed to enroll in the program. Please try again.");
        } finally {
            setIsEnrolling(false);
        }
    };

    const handleGoToLessons = () => {
        navigate(`/programs/${programId}/lessons`);
    };

    const isTeacher = user?.role === 'teacher';

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', py: 8 }}>
            <Container maxWidth="lg">
                {isTeacher ? (
                    <TeacherProgramView
                        program={data.program}
                        onGoToLessons={handleGoToLessons}
                    />
                ) : (
                    <StudentProgramView
                        program={data.program}
                        onEnroll={handleEnrollClick}
                        onGoToLessons={handleGoToLessons}
                        isEnrolling={isEnrolling}
                    />
                )}
            </Container>

            <EnrollmentModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleEnrollSubmit}
                isEnrolling={isEnrolling}
            />

            <Snackbar open={!!enrollError} autoHideDuration={6000} onClose={() => setEnrollError(null)}>
                <Alert onClose={() => setEnrollError(null)} severity="error" sx={{ width: '100%' }}>
                    {enrollError}
                </Alert>
            </Snackbar>
        </Box>
    );
};