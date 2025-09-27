import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

function CategoryEditModal({ open, onClose, onSave, itemToEdit, categoryType }) {
    const [name, setName] = useState('');

    useEffect(() => {
        if (itemToEdit) {
            setName(itemToEdit.name);
        } else {
            setName('');
        }
    }, [itemToEdit, open]);

    const handleSave = () => {
        if (!name.trim()) return;
        onSave({ ...itemToEdit, name });
    };

    const modalTitle = `${itemToEdit ? 'Edit' : 'Add'} ${categoryType}`;

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                borderRadius: '16px',
                boxShadow: 24,
                p: 4,
            }}>
                <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                    {modalTitle}
                </Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    label={`${categoryType} Name`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                    <Button variant="text" onClick={onClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default CategoryEditModal;