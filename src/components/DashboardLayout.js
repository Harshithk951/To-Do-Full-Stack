import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Outlet, useOutletContext, NavLink, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Avatar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Menu, MenuItem, Badge, Divider } from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Favorite as VitalTaskIcon,
    CheckCircle as MyTaskIcon,
    Category as TaskCategoriesIcon,
    Settings as SettingsIcon,
    Help as HelpIcon,
    Logout as LogoutIcon,
    Search as SearchIcon,
    Notifications as NotificationsIcon,
    CalendarToday as CalendarIcon,
    Reply as ReplyIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import ProfileModal from './ProfileModal';
import { toast } from 'react-toastify';

const notificationsData = [
    { title: 'Complete the UI design of Landing Page for', project: 'FoodVentures', time: '2h', priority: 'High' },
    { title: 'Complete the UI design of Landing Page for', project: 'Travel Days', time: '2h', priority: 'High' },
    { title: 'Complete the Mobile app design for', project: 'Pet Warden', time: '2h', priority: 'Extremely High' },
    { title: 'Complete the entire design for', project: 'Juice Slider', time: '2h', priority: 'High' }
];

const Header = memo(({ searchTerm, onSearchChange, selectedDate, onDateChange, onNotificationClick, notificationCount }) => (
    <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider'
    }}>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Dashboard</Typography>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <TextField
                variant="outlined" placeholder="Search your task here..." value={searchTerm} onChange={onSearchChange}
                InputProps={{
                    startAdornment: <SearchIcon sx={{ color: 'text.disabled', mr: 1 }} />,
                    sx: { borderRadius: '12px' }
                }}
                sx={{ width: '100%', maxWidth: '450px' }}
            />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={onNotificationClick}>
                <Badge badgeContent={notificationCount} color="error"><NotificationsIcon /></Badge>
            </IconButton>
            <DatePicker
                enableAccessibleFieldDOMStructure={false} value={selectedDate} onChange={onDateChange}
                slots={{
                    textField: (params) => <TextField {...params} sx={{ width: '160px' }} />,
                    openPickerIcon: CalendarIcon,
                }}
                slotProps={{ textField: { variant: 'outlined', InputProps: { sx: { borderRadius: '12px' } } } }}
            />
        </Box>
    </Box>
));

const Sidebar = memo(({ user, onProfileClick, onLogout }) => {
    const navItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Vital Task', icon: <VitalTaskIcon />, path: '/vital-task' },
        { text: 'My Task', icon: <MyTaskIcon />, path: '/my-task' },
        { text: 'Task Categories', icon: <TaskCategoriesIcon />, path: '/task-categories' },
        { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
    ];

    return (
        <Box sx={{
            width: 280, flexShrink: 0, bgcolor: '#D32F2F', height: '100vh',
            display: 'flex', flexDirection: 'column', color: 'white',
        }}>
            <Box sx={{ p: 2, textAlign: 'center', mt: 2 }}>
                <Avatar alt={user.name} src={user.avatar} sx={{ width: 80, height: 80, mx: 'auto', mb: 1, cursor: 'pointer', border: '2px solid white' }} onClick={onProfileClick}/>
                <Typography variant="h6" onClick={onProfileClick} sx={{ cursor: 'pointer' }}>{user.name}</Typography>
                <Typography variant="body2" onClick={onProfileClick} sx={{ cursor: 'pointer', opacity: 0.8 }}>{user.email}</Typography>
            </Box>
            <List sx={{ p: 1 }}>
                {navItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton component={NavLink} to={item.path} end={item.path === '/'} sx={{ borderRadius: '8px', mb: 1, '&.active': { bgcolor: 'rgba(255, 255, 255, 0.2)' }, '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}>
                            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Box sx={{ flexGrow: 1 }} />
            <List sx={{ p: 1 }}>
                 <ListItem disablePadding>
                    <ListItemButton component={NavLink} to="/help" sx={{ borderRadius: '8px', '&.active': { bgcolor: 'rgba(255, 255, 255, 0.2)' }, '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}>
                        <ListItemIcon sx={{ color: 'inherit' }}><HelpIcon /></ListItemIcon>
                        <ListItemText primary="Help" />
                    </ListItemButton>
                </ListItem>
               <ListItem disablePadding>
                    <ListItemButton onClick={onLogout} sx={{ borderRadius: '8px' }}> 
                        <ListItemIcon sx={{ color: 'inherit' }}><LogoutIcon /></ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );
});

function DashboardLayout() {
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentUser, setCurrentUser] = useState({
        name: 'Loading...',
        email: '...',
        role: '...',
        location: '...',
        avatar: ''
    });
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (!response.ok) throw new Error('Could not fetch user profile.');
                
                const data = await response.json();
                setCurrentUser(data);
            } catch (error) {
                toast.error(error.message);
                localStorage.removeItem('token');
                navigate('/login');
            }
        };
        fetchUserProfile();
    }, [token, navigate]);

    const handleUpdateUser = useCallback(async (updatedData) => {
        try {
            
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            
            setCurrentUser(prevUser => ({ ...prevUser, ...updatedData }));
            setProfileModalOpen(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(error.message);
        }
    }, [token]);

    const handleNotificationClick = useCallback((event) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleNotificationClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleProfileClick = useCallback(() => {
        setProfileModalOpen(true);
    }, []);

    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value);
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        toast.info("You have been logged out.");
        navigate('/login');
    }, [navigate]);

    const isNotificationMenuOpen = Boolean(anchorEl);

    const contextValue = useMemo(() => ({
        searchTerm,
        setSearchTerm,
        selectedDate
    }), [searchTerm, selectedDate]);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex' }}>
                <Sidebar user={currentUser} onProfileClick={handleProfileClick} onLogout={handleLogout} />
                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100vh' }}>
                    <Header
                        searchTerm={searchTerm}
                        onSearchChange={handleSearchChange}
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate}
                        onNotificationClick={handleNotificationClick}
                        notificationCount={notificationsData.length}
                    />
                    <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default', overflow: 'auto' }}>
                        <Outlet context={contextValue} />
                    </Box>
                </Box>
                <ProfileModal open={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} user={currentUser} onSave={handleUpdateUser} />
                <Menu
                    anchorEl={anchorEl}
                    open={isNotificationMenuOpen}
                    onClose={handleNotificationClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible', filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))', mt: 1.5, width: 380,
                            '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
                            '&:before': { content: '""', display: 'block', position: 'absolute', top: 0, right: 14, width: 10, height: 10, bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0 },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Notifications</Typography>
                        <IconButton size="small" sx={{ color: '#ff5722' }}><ReplyIcon sx={{ transform: 'scaleX(-1)' }} /></IconButton>
                    </Box>
                    <Box sx={{ px: 2, mb: 1 }}><Typography variant="body2" color="text.secondary">Today</Typography></Box>
                    <Divider sx={{ mb: 1 }} />
                    {notificationsData.map((notification, index) => (
                        <MenuItem key={index} onClick={handleNotificationClose} sx={{ p: 2, borderRadius: '12px', mb: 1, '&:hover': { bgcolor: '#f5f5f5' }, whiteSpace: 'normal' }}>
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="body2" sx={{ whiteSpace: 'normal' }}>
                                    {notification.title} <strong>{notification.project}</strong>.
                                    <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>{notification.time}</Typography>
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                    Priority: <Typography component="span" sx={{ color: 'red', fontWeight: 'bold' }}>{notification.priority}</Typography>
                                </Typography>
                            </Box>
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
        </LocalizationProvider>
    );
}

export function useDashboardContext() {
    return useOutletContext();
}

export default DashboardLayout;