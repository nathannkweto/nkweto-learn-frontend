import React from 'react';
import { Container, CircularProgress, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';

import { ProgramList } from '../programs/components/ProgramList';
import { useAuth } from '../../hooks/useAuth';
import { GetDashboardProgramsDocument } from '../../graphql/generated/graphql';

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const { data, loading, error } = useQuery(GetDashboardProgramsDocument);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" sx={{ p: 4 }}>
                Error loading dashboard programs.
            </Typography>
        );
    }

    const isTeacher = user?.role === 'teacher';

    return (
        <Container sx={{ py: 4 }}>
            <ProgramList
                title={isTeacher ? 'Manage Programs' : 'My Programs'}
                programs={data?.dashboardPrograms || []}
                lessonsClickable={true}
                onOpenProgram={(id) => navigate(`/programs/${id}`)}
                onOpenLesson={(id) => navigate(`/lessons/${id}`)}
            />
        </Container>
    );
};