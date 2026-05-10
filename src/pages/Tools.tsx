import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import HelpCenterRoundedIcon from '@mui/icons-material/HelpCenterRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { PageHeader } from '../components/common/PageHeader';
import { ActionList } from '../components/common/ActionList';
import type { ActionListItemData } from '../components/common/ActionList';

export const Tools = () => {
    const navigate = useNavigate();

    const toolItems: ActionListItemData[] = [
        { id: 'setup', title: 'Setup Guides', subtitle: 'Step-by-step instructions for your environment.', icon: <SettingsSuggestRoundedIcon color="primary" />, iconBg: 'rgba(25, 118, 210, 0.1)', endIcon: <ChevronRightRoundedIcon sx={{ color: '#cbd5e1' }} />, onClick: () => navigate('/tools/setup-guides') },
        { id: 'help', title: 'Ask for Help', subtitle: 'Connect with mentors or browse the FAQ.', icon: <HelpCenterRoundedIcon color="secondary" />, iconBg: 'rgba(156, 39, 176, 0.1)', endIcon: <ChevronRightRoundedIcon sx={{ color: '#cbd5e1' }} />, onClick: () => navigate('/tools/help') }
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', p: 2 }}>
            <Box sx={{ width: '100%', maxWidth: 500 }}>
                <PageHeader title="Student Toolbox" description="Everything you need to get started and stay on track." align="center" />
                <ActionList items={toolItems} />
            </Box>
        </Box>
    );
};