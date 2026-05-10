import React, { useState } from 'react';
import { Container, CircularProgress, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ProgramList } from './components/ProgramList';
import { useQuery } from '@apollo/client/react';
import { GetBrowseProgramsDocument } from '../../graphql/generated/graphql';
import { useAuth } from '../../hooks/useAuth';
import { CreateProgramModal } from './components/CreateProgramModal';
import AddIcon from '@mui/icons-material/Add';

export const ProgramsPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data, loading, error, refetch } = useQuery(GetBrowseProgramsDocument);

    const isTeacher = user?.role === 'teacher';

    const handleCreateSuccess = async () => {
        setIsCreateModalOpen(false);
        await refetch();
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (error) return <Typography color="error">Error loading programs.</Typography>;

    return (
        <Container sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Programs
                </Typography>
                {isTeacher && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        Create Program
                    </Button>
                )}
            </Box>

            <ProgramList
                title="Browse Programs"
                programs={data?.browsePrograms || []}
                lessonsClickable={false}
                onOpenProgram={(id) => navigate(`/programs/${id}`)}
            />

            <CreateProgramModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />
        </Container>
    );
};