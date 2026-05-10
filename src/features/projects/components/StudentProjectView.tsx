import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Box, Button, Divider, CircularProgress, Alert } from '@mui/material';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import { useFragment } from '../../../graphql/generated';
import type { FragmentType } from '../../../graphql/generated';
import { ProjectFieldsFragmentDoc } from '../../../graphql/generated/graphql';

import { getOpenAPIDefinition } from '../../../api/generated/endpoints';

const api = getOpenAPIDefinition();

interface Props {
    project: FragmentType<typeof ProjectFieldsFragmentDoc>;
    programId: string;
    lessonId: string;
}

export const StudentProjectView: React.FC<Props> = ({ project, programId, lessonId }) => {
    const unmaskedProject = useFragment(ProjectFieldsFragmentDoc, project);

    const [isChecking, setIsChecking] = useState(false);
    const [checkResult, setCheckResult] = useState<{ status: 'info' | 'success' | 'error' | 'warning'; message: string } | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const eventSourceRef = useRef<EventSource | null>(null);

    useEffect(() => {
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
    }, []);

    const handleRunCheck = async () => {
        setIsChecking(true);
        setCheckResult(null);
        setErrorMsg(null);

        try {
            // Clean request body without studentId
            const requestBody = {
                programId: programId,
                lessonId: lessonId,
            };

            const response = await api.validateProject(unmaskedProject.id, requestBody);

            if (response.data && response.data.checkId) {
                const checkId = response.data.checkId;

                const eventSource = new EventSource(`/api/projects/${unmaskedProject.id}/checks/${checkId}/stream`);
                eventSourceRef.current = eventSource;

                eventSource.onmessage = (event) => {
                    const data = JSON.parse(event.data);

                    if (data.status === 'QUEUED' || data.status === 'PROCESSING') {
                        setCheckResult({
                            status: 'info',
                            message: `Validation is ${data.status.toLowerCase()}...`
                        });
                    }
                    else if (data.status === 'COMPLETED') {
                        const finalResult = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;

                        setCheckResult({
                            status: finalResult.status === 'passed' ? 'success' : 'warning',
                            message: finalResult.message
                        });

                        setIsChecking(false);
                        eventSource.close();
                    }
                    else if (data.status === 'FAILED') {
                        setErrorMsg("The validation runner encountered an error and failed to complete.");
                        setIsChecking(false);
                        eventSource.close();
                    }
                };

                eventSource.onerror = (err) => {
                    console.error("SSE connection error:", err);
                    setErrorMsg("Lost connection to the validation stream.");
                    setIsChecking(false);
                    eventSource.close();
                };
            }
        } catch (err) {
            console.error("Validation trigger failed:", err);
            setErrorMsg("Failed to start the validation process.");
            setIsChecking(false);
        }
    };

    return (
        <Card>
            <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }} gutterBottom>
                    {unmaskedProject.title}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 4, '.ql-container': { border: 'none', fontSize: '1rem' } }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Instructions
                    </Typography>
                    <ReactQuill
                        value={unmaskedProject.description || ''}
                        readOnly={true}
                        theme="bubble"
                    />
                </Box>

                {checkResult && (
                    <Alert
                        severity={checkResult.status}
                        sx={{ mb: 3 }}
                        icon={checkResult.status === 'info' ? <CircularProgress size={20} /> : undefined}
                    >
                        {checkResult.message}
                    </Alert>
                )}

                {errorMsg && (
                    <Alert severity="error" sx={{ mb: 3 }}>{errorMsg}</Alert>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleRunCheck}
                        disabled={isChecking}
                        startIcon={isChecking ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {isChecking ? "Running..." : "Run Check"}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};