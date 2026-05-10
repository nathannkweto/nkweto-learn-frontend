import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Button,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useFragment } from '../../../graphql/generated';
import type { FragmentType } from '../../../graphql/generated';
import {
    ProgramCardFieldsFragmentDoc,
} from '../../../graphql/generated/graphql';

interface Props {
    program: FragmentType<typeof ProgramCardFieldsFragmentDoc>;
    lessonsClickable: boolean;
    onOpenProgram: (id: string) => void;
    onOpenLesson?: (id: string) => void;
}

export const ProgramAccordion: React.FC<Props> = ({
                                                      program,
                                                      lessonsClickable,
                                                      onOpenProgram,
                                                      onOpenLesson
                                                  }) => {
    const data = useFragment(ProgramCardFieldsFragmentDoc, program);

    return (
        <Accordion sx={{ mb: 1, '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        mr: 2
                    }}
                >
                    <Typography sx={{ fontWeight: 600 }}>{data.title}</Typography>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpenProgram(data.id);
                        }}
                    >
                        Open
                    </Button>
                </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ px: 0, py: 0, borderTop: '1px solid', borderColor: 'divider' }}>
                <List disablePadding>
                    {data.lessons.map((lesson) => (
                        <React.Fragment key={lesson.id}>
                            {lessonsClickable ? (
                                <ListItemButton onClick={() => onOpenLesson?.(lesson.id)}>
                                    <ListItemText
                                        primary={lesson.title}
                                        sx={{
                                            '.MuiListItemText-primary': {
                                                fontSize: '0.875rem',
                                                color: 'primary.main'
                                            }
                                        }}
                                    />
                                </ListItemButton>
                            ) : (
                                <ListItem sx={{ py: 1.5, px: 2 }}>
                                    <ListItemText
                                        primary={lesson.title}
                                        sx={{
                                            '.MuiListItemText-primary': {
                                                fontSize: '0.875rem'
                                            }
                                        }}
                                    />
                                </ListItem>
                            )}
                        </React.Fragment>
                    ))}
                </List>
            </AccordionDetails>
        </Accordion>
    );
};