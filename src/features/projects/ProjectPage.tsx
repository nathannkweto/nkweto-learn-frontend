import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';

import { StudentProjectView } from './components/StudentProjectView';
import { TeacherProjectView } from './components/TeacherProjectView';

import {
    GetProjectDocument,
} from '../../graphql/generated/graphql';

import { useAuth } from '../../hooks/useAuth';

export const ProjectPage: React.FC = () => {
    const { user } = useAuth();

    const { programId, lessonId, projectId } = useParams<{ programId: string; lessonId: string; projectId: string }>();

    const { data, loading, error } = useQuery(GetProjectDocument, {
        variables: {
            id: projectId!,
        },
        skip: !projectId,
    });

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !data?.project) {
        return (
            <Typography color="error">
                Failed to load project.
            </Typography>
        );
    }

    const isTeacher = user?.role === 'teacher';

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, px: 2 }}>
            {isTeacher ? (
                <TeacherProjectView project={data.project} />
            ) : (
                <StudentProjectView
                    project={data.project}
                    programId={programId as string}
                    lessonId={lessonId as string}
                />
            )}
        </Box>
    );
};