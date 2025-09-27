import React, { useState, useMemo } from 'react';
import {
    Box, Typography, TextField, InputAdornment, Accordion, AccordionSummary,
    AccordionDetails, Grid, Paper, Button
} from '@mui/material';
import {
    Search as SearchIcon,
    ExpandMore as ExpandMoreIcon,
    HeadsetMic as HeadsetMicIcon,
    Email as EmailIcon,
    Chat as ChatIcon
} from '@mui/icons-material';
import LiveChatModal from './LiveChatModal'; 
const faqData = [
    {
        category: 'Getting Started',
        questions: [
            { q: 'How do I create a new task?', a: 'To create a new task, navigate to the Dashboard and click the "Add Task" button. Fill in the details in the modal that appears and click "Save".' },
            { q: 'How can I change my password?', a: 'You can change your password by going to the Settings page, under the "Security" section. You will need to enter your current password and a new password.' },
            { q: 'Where can I update my profile information?', a: 'Your profile information can be updated by clicking on your avatar in the sidebar, which opens a modal where you can edit your details.' }
        ]
    },
    {
        category: 'Task Management',
        questions: [
            { q: 'What is the difference between a Vital Task and a My Task?', a: '"Vital Tasks" are high-priority items that require immediate attention, while "My Tasks" are your personal to-do items.' },
            { q: 'How do I mark a task as complete?', a: 'You can mark a task as complete by clicking the checkbox next to the task name on the Dashboard. It will then move to the "Completed Tasks" list.' },
            { q: 'Can I edit a task after it has been created?', a: 'Yes, you can edit a task by clicking the three-dot menu next to the task and selecting "Edit". This can be done from the Dashboard, Vital Task, or My Task pages.' }
        ]
    },
    {
        category: 'Account & Billing',
        questions: [
            { q: 'How do I upgrade my subscription plan?', a: 'To upgrade your plan, go to the "Billing" section in your Settings and select a new plan. Follow the on-screen instructions to complete the process.' },
            { q: 'Where can I find my invoices?', a: 'Your past invoices are available for download in the "Billing History" section of the Settings page.' }
        ]
    }
];

function Help() {
    const [searchTerm, setSearchTerm] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [isChatModalOpen, setChatModalOpen] = useState(false); 

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleSubmitTicket = () => {
        window.location.href = "mailto:support@tododashboard.com?subject=Support Request - To-Do Dashboard";
    };

    const handleStartLiveChat = () => {
        setChatModalOpen(true); 
    };

    const filteredFaqs = useMemo(() => {
        if (!searchTerm.trim()) return faqData;

        const lowercasedFilter = searchTerm.toLowerCase();
        return faqData.map(category => ({
            ...category,
            questions: category.questions.filter(
                q => q.q.toLowerCase().includes(lowercasedFilter) || q.a.toLowerCase().includes(lowercasedFilter)
            )
        })).filter(category => category.questions.length > 0);
    }, [searchTerm]);

    return (
        <>
            <Box>
                <Box sx={{ textAlign: 'center', mb: 5, p: 4, bgcolor: 'background.paper', borderRadius: '16px', border: '1px solid #e0e0e0' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                        How can we help?
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Search our knowledge base or contact our support team directly.
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search for questions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: '12px', maxWidth: '600px', mx: 'auto' }
                        }}
                    />
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        {filteredFaqs.length > 0 ? filteredFaqs.map((category, index) => (
                            <Box key={index} sx={{ mb: 4 }}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>{category.category}</Typography>
                                {category.questions.map((faq, qIndex) => (
                                    <Accordion
                                        key={qIndex}
                                        expanded={expanded === `${index}-${qIndex}`}
                                        onChange={handleAccordionChange(`${index}-${qIndex}`)}
                                        elevation={0}
                                        sx={{ border: '1px solid #e0e0e0', '&:before': { display: 'none' }, mb: 1 }}
                                    >
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography sx={{ fontWeight: 'medium' }}>{faq.q}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography color="text.secondary">{faq.a}</Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </Box>
                        )) : (
                            <Paper sx={{ p: 4, textAlign: 'center', border: '1px solid #e0e0e0' }} elevation={0}>
                               <Typography variant="h6">No results found for "{searchTerm}"</Typography>
                               <Typography color="text.secondary">Try searching for another keyword or browse the categories.</Typography>
                            </Paper>
                        )}
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e0e0e0', position: 'sticky', top: '24px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <HeadsetMicIcon color="primary" sx={{ mr: 1.5 }} />
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Contact Support</Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Can't find the answer you're looking for? Our support team is here to help.
                            </Typography>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<EmailIcon />}
                                sx={{ mb: 2, textTransform: 'none', py: 1.5 }}
                                onClick={handleSubmitTicket}
                            >
                                Submit a Ticket
                            </Button>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<ChatIcon />}
                                sx={{ textTransform: 'none', py: 1.5 }}
                                onClick={handleStartLiveChat}
                            >
                                Start a Live Chat
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
            <LiveChatModal open={isChatModalOpen} onClose={() => setChatModalOpen(false)} />
        </>
    );
}

export default Help;