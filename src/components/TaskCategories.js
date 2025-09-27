import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryEditModal from '../components/CategoryEditModal';

const initialStatuses = [
    { id: 1, name: 'Not Started' },
    { id: 2, name: 'In Progress' },
    { id: 3, name: 'Completed' },
];

const initialPriorities = [
    { id: 1, name: 'Low' },
    { id: 2, name: 'Moderate' },
];

function TaskCategories() {
    const [statuses, setStatuses] = useState(initialStatuses);
    const [priorities, setPriorities] = useState(initialPriorities);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [categoryType, setCategoryType] = useState('');
    const [isInlineFormVisible, setInlineFormVisible] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    const handleOpenModal = (item, type) => {
        setCurrentItem(item);
        setCategoryType(type);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentItem(null);
        setCategoryType('');
    };

    const handleSave = (item) => {
        const listMap = {
            'Status': { list: statuses, setList: setStatuses },
            'Priority': { list: priorities, setList: setPriorities }
        };
        const { list, setList } = listMap[categoryType];

        if (item.id) {
            setList(list.map(i => (i.id === item.id ? item : i)));
        } else {
            const newItem = { ...item, id: Date.now() };
            setList([...list, newItem]);
        }
        handleCloseModal();
    };
    
    const handleDelete = (id, type) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            if (type === 'Status') {
                setStatuses(statuses.filter(item => item.id !== id));
            } else if (type === 'Priority') {
                setPriorities(priorities.filter(item => item.id !== id));
            }
        }
    };

    const handleCreateCategory = () => {
        if (newCategoryName.trim()) {
            const newItem = { id: Date.now(), name: newCategoryName };
            setStatuses([...statuses, newItem]);
            setNewCategoryName('');
            setInlineFormVisible(false);
        }
    };

    const renderTable = (title, data, type) => (
        <Box component={Paper} sx={{ mb: 4, p: 3, borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{title}</Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={() => handleOpenModal(null, type)}
                    sx={{ bgcolor: '#d9534f', '&:hover': { bgcolor: '#c9302c' }, borderRadius: '8px', textTransform: 'none' }}
                >
                    Add New {type}
                </Button>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', border: 'none' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', border: 'none' }}>Name</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', color: 'text.secondary', border: 'none' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, borderTop: '1px solid #e0e0e0' }}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell align="right">
                                    <Button 
                                        variant="outlined" 
                                        startIcon={<EditIcon />} 
                                        onClick={() => handleOpenModal(item, type)}
                                        sx={{ color: '#d9534f', borderColor: '#d9534f', textTransform: 'none', '&:hover': { borderColor: '#c9302c', bgcolor: 'rgba(217, 83, 79, 0.04)' } }}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        startIcon={<DeleteIcon />} 
                                        sx={{ ml: 1, color: '#d9534f', borderColor: '#d9534f', textTransform: 'none', '&:hover': { borderColor: '#c9302c', bgcolor: 'rgba(217, 83, 79, 0.04)' } }} 
                                        onClick={() => handleDelete(item.id, type)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    return (
        <Box sx={{ p: 4, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>Manage Categories</Typography>
            
            {!isInlineFormVisible ? (
                <Button 
                    variant="contained" 
                    sx={{ mb: 4, bgcolor: '#d9534f', '&:hover': { bgcolor: '#c9302c' }, textTransform: 'none' }}
                    onClick={() => setInlineFormVisible(true)}
                >
                    Add Category
                </Button>
            ) : (
                <Paper component="form" sx={{ p: 2, mb: 4, border: 1, borderColor: 'divider', borderRadius: '12px', boxShadow: 'none' }} onSubmit={(e) => { e.preventDefault(); handleCreateCategory(); }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter new category name..."
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button type="submit" variant="contained" sx={{ bgcolor: '#d9534f', '&:hover': { bgcolor: '#c9302c' } }}>Create</Button>
                        <Button variant="text" onClick={() => setInlineFormVisible(false)}>Cancel</Button>
                    </Box>
                </Paper>
            )}
            
            {renderTable('Task Status', statuses, 'Status')}
            {renderTable('Priorities', priorities, 'Priority')}

            <CategoryEditModal
                open={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                itemToEdit={currentItem}
                categoryType={categoryType}
            />
        </Box>
    );
}

export default TaskCategories;