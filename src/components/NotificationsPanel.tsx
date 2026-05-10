import { Box, Typography, IconButton, List, ListItem, ListItemText, Divider, } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CircleIcon from '@mui/icons-material/Circle';

const MOCK_NOTIFICATIONS = [
    { id: 1, title: 'New Lesson Uploaded', message: 'Advanced React Hooks is now available in Fullstack React.', time: '2m ago', unread: true },
    { id: 2, title: 'Quiz Graded', message: 'Your "Component Basics" quiz has been graded. Score: 95%', time: '1h ago', unread: true },
    { id: 3, title: 'Enrollment Approved', message: 'You have been enrolled in Cloud Deployment 101.', time: 'Yesterday', unread: false },
];

export const NotificationsPanel = ({ onClose }: { onClose?: () => void }) => {
    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Notifications</Typography>
                {onClose && (
                    <IconButton onClick={onClose} size="small">
                        <CloseRoundedIcon />
                    </IconButton>
                )}
            </Box>

            <Divider />

            {/* List */}
            <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0 }}>
                {MOCK_NOTIFICATIONS.map((notif) => (
                    <ListItem
                        key={notif.id}
                        alignItems="flex-start"
                        sx={{
                            backgroundColor: notif.unread ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
                            py: 2,
                            borderBottom: '1px solid #f1f5f9'
                        }}
                    >
                        <ListItemText
                            primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{notif.title}</Typography>
                                    {notif.unread && <CircleIcon sx={{ fontSize: 8, color: 'primary.main' }} />}
                                </Box>
                            }
                            secondary={
                                <>
                                    <Typography variant="body2" color="text.primary" sx={{ display: 'block', mb: 0.5 }}>
                                        {notif.message}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {notif.time}
                                    </Typography>
                                </>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};