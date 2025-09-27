import React, { useState, useEffect, useRef } from 'react';
import {
    Modal, Box, Typography, TextField, IconButton, Avatar, Divider, Paper, CircularProgress
} from '@mui/material';
import { Close as CloseIcon, Send as SendIcon, SupportAgent as SupportAgentIcon } from '@mui/icons-material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '16px',
    boxShadow: 24,
    display: 'flex',
    flexDirection: 'column',
    height: '70vh',
    maxHeight: '550px'
};

const initialMessage = {
    id: 1,
    sender: 'bot',
    text: 'Welcome to Live Chat! How can I help you today? You can ask me about tasks, billing, your account, or anything else.'
};

const getBotResponse = (userMessage, currentTopic) => {
    const msg = userMessage.toLowerCase();
    let newTopic = currentTopic;
    let responseText;

    if (msg.includes('thanks') || msg.includes('thank you')) {
        return { responseText: "You're very welcome! Is there anything else I can help with today?", newTopic: null };
    }
    if (msg.includes('hello') || msg.includes('hi')) {
        return { responseText: "Hello there! What can I assist you with?", newTopic: null };
    }
    if (msg.includes('yes')) {
        return { responseText: "Great! What else can I help you with?", newTopic: currentTopic };
    }
    if (msg.includes('no')) {
        return { responseText: "Okay, is there a different topic I can help you with?", newTopic: null };
    }

    let topicIdentified = false;
    if (msg.includes('password') || msg.includes('reset')) {
        newTopic = 'password';
        responseText = "I can help with password issues. You can change your password in Settings > Security. Would you like more details?";
        topicIdentified = true;
    } else if (msg.includes('task')) {
        newTopic = 'tasks';
        responseText = "Let's talk about tasks. You can create, edit, or delete them from the Dashboard. What would you like to know?";
        topicIdentified = true;
    } else if (msg.includes('billing') || msg.includes('invoice')) {
        newTopic = 'billing';
        responseText = "For billing, you can view invoices and manage your subscription in the Settings page. Does that help?";
        topicIdentified = true;
    }

    if (!topicIdentified && currentTopic) {
        switch (currentTopic) {
            case 'tasks':
                if (msg.includes('delete') || msg.includes('remove')) {
                    responseText = "To delete a task, click the three-dot menu next to it on the Dashboard and select 'Delete'. Anything else about tasks?";
                } else if (msg.includes('create') || msg.includes('new')) {
                    responseText = "You can create a new task by clicking the 'Add Task' button on the Dashboard. What other questions do you have about tasks?";
                } else {
                    responseText = "I can help with creating, editing, and deleting tasks. Could you clarify what you'd like to do?";
                }
                break;
            case 'password':
                 responseText = "To find the password settings, go to the 'Settings' page from the sidebar, then click on the 'Security' section. Let me know if you need more help!";
                 break;
            default:
                topicIdentified = true;
        }
    }

    if (!topicIdentified) {
        responseText = "I'm not quite sure how to help with that. Could you try rephrasing? You can ask me about passwords, tasks, or billing.";
        newTopic = null;
    }

    return { responseText, newTopic };
};

function LiveChatModal({ open, onClose }) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([initialMessage]);
    const [currentTopic, setCurrentTopic] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        if (open) {
            setMessages([initialMessage]);
            setCurrentTopic(null);
        }
    }, [open]);

    const handleSendMessage = () => {
        if (!message.trim()) return;

        const userMessage = { id: Date.now(), sender: 'user', text: message };
        setMessages(prev => [...prev, userMessage]);

        const { responseText, newTopic } = getBotResponse(message, currentTopic);
        setMessage('');
        setIsTyping(true);
        setCurrentTopic(newTopic);

        setTimeout(() => {
            const botResponse = { id: Date.now() + 1, sender: 'bot', text: responseText };
            setIsTyping(false);
            setMessages(prev => [...prev, botResponse]);
        }, 1200 + Math.random() * 400);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f5f5f5', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                        Live Chat Support
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
                    {messages.map((msg) => (
                        <Box
                            key={msg.id}
                            sx={{
                                display: 'flex',
                                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                mb: 2,
                            }}
                        >
                            {msg.sender === 'bot' && (
                                <Avatar sx={{ bgcolor: 'primary.main', mr: 1.5 }}>
                                    <SupportAgentIcon />
                                </Avatar>
                            )}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 1.5,
                                    borderRadius: '12px',
                                    bgcolor: msg.sender === 'user' ? 'primary.main' : '#f0f0f0',
                                    color: msg.sender === 'user' ? 'white' : 'text.primary',
                                    maxWidth: '80%',
                                }}
                            >
                                <Typography variant="body2">{msg.text}</Typography>
                            </Paper>
                        </Box>
                    ))}
                    {isTyping && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', mr: 1.5 }}>
                                <SupportAgentIcon />
                            </Avatar>
                            <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#f0f0f0', borderRadius: '12px' }}>
                                <CircularProgress size={20} />
                            </Paper>
                        </Box>
                    )}
                    <div ref={messagesEndRef} />
                </Box>
                <Divider />
                <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
                    <TextField
                        fullWidth
                        multiline
                        maxRows={3}
                        variant="outlined"
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        InputProps={{
                            endAdornment: (
                                <IconButton color="primary" onClick={handleSendMessage} disabled={!message.trim()}>
                                    <SendIcon />
                                </IconButton>
                            ),
                            sx: { borderRadius: '12px', bgcolor: 'white' }
                        }}
                    />
                </Box>
            </Box>
        </Modal>
    );
}

export default LiveChatModal;