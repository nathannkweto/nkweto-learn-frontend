import React from 'react';
import { Box, Container, CircularProgress, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { StudentLessonView } from './components/StudentLessonView';
import { TeacherLessonView } from './components/TeacherLessonView';
import { useQuery } from '@apollo/client/react';

import {
    GetLessonDocument,
    LessonFieldsFragmentDoc,
} from '../../graphql/generated/graphql';

import { useFragment } from '../../graphql/generated';
import type { FragmentType } from '../../graphql/generated';

import { useAuth } from '../../hooks/useAuth';

export const LessonScreen: React.FC = () => {
    const { user } = useAuth();
    const { lessonId } = useParams<{ lessonId: string }>();
    const navigate = useNavigate();

    const { data, loading, error } = useQuery(GetLessonDocument, {
        variables: { id: lessonId as string },
        skip: !lessonId,
    });

    // We unmask the lesson here strictly so the parent can access
    // properties like 'pages' for the handleStart routing logic.
    const unmaskedLesson = useFragment(
        LessonFieldsFragmentDoc,
        data?.lesson
    );

    if (loading) {
        return (
            <Box sx={{ py: 8, textAlign: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !data?.lesson || !unmaskedLesson) {
        return <Typography color="error">Lesson not found.</Typography>;
    }

    const handleStart = () => {
        const firstPageId = unmaskedLesson.pages?.[0]?.id;

        if (firstPageId) {
            navigate(`/lessons/${lessonId}/pages?page=${firstPageId}`);
        } else {
            navigate(`/lessons/${lessonId}/pages`);
        }
    };

    const handleGoToPages = (pageId: string) => {
        navigate(`/lessons/${lessonId}/pages?page=${pageId}`);
    };

    const isTeacher = user?.role === 'teacher';

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: 'background.default',
                py: 8,
            }}
        >
            <Container maxWidth="lg">
                {isTeacher ? (
                    <TeacherLessonView
                        lesson={data.lesson as FragmentType<typeof LessonFieldsFragmentDoc>}
                        onGoToPages={handleGoToPages}
                    />
                ) : (
                    <StudentLessonView
                        lesson={data.lesson as FragmentType<typeof LessonFieldsFragmentDoc>}
                        onStart={handleStart}
                    />
                )}
            </Container>
        </Box>
    );
};