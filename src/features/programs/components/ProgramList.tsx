import React from 'react';
import { Box, Typography } from '@mui/material';
import { ProgramAccordion } from './ProgramAccordion';
import { useFragment } from '../../../graphql/generated';
import type { FragmentType } from '../../../graphql/generated';

import {
    ProgramCardFieldsFragmentDoc,
} from '../../../graphql/generated/graphql';

interface Props {
    title: string;
    programs: FragmentType<typeof ProgramCardFieldsFragmentDoc>[];
    lessonsClickable: boolean;
    onOpenProgram: (id: string) => void;
    onOpenLesson?: (id: string) => void;
}

export const ProgramList: React.FC<Props> = ({
                                                 title,
                                                 programs,
                                                 lessonsClickable,
                                                 onOpenProgram,
                                                 onOpenLesson
                                             }) => {
    const unmaskedPrograms = useFragment(ProgramCardFieldsFragmentDoc, programs);

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                {title}
            </Typography>

            {unmaskedPrograms && unmaskedPrograms.length > 0 ? (
                unmaskedPrograms.map((program, index) => {
                    return (
                        <ProgramAccordion
                            key={program.id}
                            program={programs[index]}
                            lessonsClickable={lessonsClickable}
                            onOpenProgram={onOpenProgram}
                            onOpenLesson={onOpenLesson}
                        />
                    );
                })
            ) : (
                <Typography color="text.secondary">No programs found.</Typography>
            )}
        </Box>
    );
};