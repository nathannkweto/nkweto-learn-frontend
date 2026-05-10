import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Divider } from '@mui/material';
import type {ReactNode} from 'react';

export interface ActionListItemData {
    id: string;
    title: string;
    subtitle?: string;
    icon: ReactNode;
    onClick: () => void;
    iconBg?: string;
    endIcon?: ReactNode;
}

export const ActionList = ({ items }: { items: ActionListItemData[] }) => (
    <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden', width: '100%' }}>
        <List disablePadding>
            {items.map((item, index) => (
                <Box key={item.id}>
                    <ListItem disablePadding>
                        <ListItemButton onClick={item.onClick} sx={{ py: 2, px: 3, '&:hover': { backgroundColor: '#f8fafc' } }}>
                            <ListItemIcon sx={{ minWidth: 56 }}>
                                <Box sx={{ p: item.iconBg ? 1.5 : 0, borderRadius: 2, backgroundColor: item.iconBg || 'transparent', display: 'flex' }}>
                                    {item.icon}
                                </Box>
                            </ListItemIcon>
                            <ListItemText
                                primary={item.title}
                                secondary={item.subtitle}
                                slotProps={{
                                    primary: { sx: { fontWeight: 600, color: '#0f172a', fontSize: '1.1rem', mb: item.subtitle ? 0.5 : 0 } },
                                    secondary: { sx: { color: 'text.secondary' } }
                                }}
                            />
                            {item.endIcon}
                        </ListItemButton>
                    </ListItem>
                    {index < items.length - 1 && <Divider />}
                </Box>
            ))}
        </List>
    </Paper>
);