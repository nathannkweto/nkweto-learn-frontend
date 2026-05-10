import React, { useState } from 'react';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { StudentPageView } from './components/StudentPageView';
import { TeacherPageView } from './components/TeacherPageView';
import { useQuery } from '@apollo/client/react';

import {
    GetPageDocument,
    GetLessonDocument,
    PageFieldsFragmentDoc,
    LessonFieldsFragmentDoc
} from '../../graphql/generated/graphql';
import { useFragment } from '../../graphql/generated';
import { useAuth } from '../../hooks/useAuth';

import { getOpenAPIDefinition } from '../../api/generated/endpoints';
const api = getOpenAPIDefinition();

export const PageDetail: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const { lessonId } = useParams<{ lessonId: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const pageIndex = Number(searchParams.get('page')) || 1;

    const [isCreating, setIsCreating] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const { data: lessonDataWrapper, loading: lessonLoading, refetch: refetchLesson } = useQuery(GetLessonDocument, {
        variables: { id: lessonId! },
        skip: !lessonId,
    });

    const lessonData = useFragment(LessonFieldsFragmentDoc, lessonDataWrapper?.lesson);
    const pagesList = lessonData?.pages || [];

    const targetPage = pagesList.find((p) => p.orderIndex === pageIndex);

    const { data: pageDataWrapper, loading: pageLoading, error } = useQuery(GetPageDocument, {
        variables: { id: targetPage?.id as string },
        skip: !targetPage?.id,
    });

    const pageData = useFragment(PageFieldsFragmentDoc, pageDataWrapper?.page);

    if (lessonLoading || pageLoading || isCreating) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Typography color="error" sx={{ p: 4, textAlign: 'center' }}>Failed to load page.</Typography>;
    }

    if (!targetPage || !pageData) {
        return <Typography color="text.secondary" sx={{ p: 4, textAlign: 'center' }}>Page not found.</Typography>;
    }

    const isTeacher = user?.role === 'teacher';

    const hasNextPage = pagesList.some((p) => p.orderIndex === pageIndex + 1);
    const hasPrevPage = pagesList.some((p) => p.orderIndex === pageIndex - 1);
    const hasProject = !!pageData.lesson?.project?.id;

    const handleNext = async () => {
        if (hasNextPage) {
            setSearchParams({ page: String(pageIndex + 1) });
        } else if (isTeacher) {
            setIsCreating(true);
            try {
                await api.createPage(lessonId!, {
                    title: 'New Page'
                });

                await refetchLesson();
                setSearchParams({ page: String(pageIndex + 1) });
            } catch (err) {
                console.error("Failed to create new page", err);
                setErrorMsg("Failed to create new page.");
            } finally {
                setIsCreating(false);
            }
        } else if (hasProject) {
            navigate(`/projects/${pageData.lesson?.project?.id}`);
        } else {
            navigate(`/lessons/${lessonId}`);
        }
    };

    const handlePrev = () => {
        if (hasPrevPage) {
            setSearchParams({ page: String(pageIndex - 1) });
        } else {
            navigate(`/lessons/${lessonId}`);
        }
    };

    const handleProjectAction = async () => {
        if (hasProject) {
            navigate(`/projects/${pageData.lesson?.project?.id}`);
        } else if (isTeacher) {
            setIsCreating(true);
            try {
                const response = await api.createProject({
                    lessonId: lessonId!,
                    title: 'New Project',
                    instructions: '',
                });
                const newProjectId = response.data.id;
                navigate(`/projects/${newProjectId}`);
            } catch (err) {
                console.error("Failed to create new project", err);
                setErrorMsg("Failed to create new project.");
                setIsCreating(false);
            }
        }
    };

    return (
        <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', pb: 8 }}>
            {errorMsg && <Alert severity="error" sx={{ m: 2 }}>{errorMsg}</Alert>}

            {isTeacher ? (
                <TeacherPageView
                    page={pageDataWrapper!.page!}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    onProjectAction={handleProjectAction}
                    hasNextPage={hasNextPage}
                    hasPrevPage={hasPrevPage}
                    hasProject={hasProject}
                />
            ) : (
                <StudentPageView
                    page={pageDataWrapper!.page!}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    hasPrevPage={hasPrevPage}
                    hasNextPage={hasNextPage}
                />
            )}
        </Box>
    );
};