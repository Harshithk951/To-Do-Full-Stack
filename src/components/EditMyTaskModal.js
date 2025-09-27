import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const InputFieldWrapper = ({ label, children }) => (
    <Box>
        <Typography variant="caption" sx={{ fontWeight: 'medium', color: 'text.secondary', display: 'block', mb: 0.5 }}>
            {label}
        </Typography>
        {children}
    </Box>
);

function EditMyTaskModal({ open, onClose, onUpdateTask, taskToEdit }) {
  const [formData, setFormData] = useState({
    title: '',
    objective: '',
    taskDescription: '',
    deadline: ''
  });

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        objective: taskToEdit.objective || '',
        taskDescription: taskToEdit.taskDescription || '',
        deadline: taskToEdit.deadline || ''
      });
    }
  }, [taskToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onUpdateTask({
      ...taskToEdit,
      ...formData
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{
        bgcolor: 'background.paper',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        p: 4,
        width: 'clamp(500px, 50vw, 600px)',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        outline: 'none'
      }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 3 }}>
          Edit Task
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, overflowY: 'auto', pr: 1 }}>
          <InputFieldWrapper label="Task Title">
            <TextField fullWidth name="title" value={formData.title} onChange={handleChange} variant="outlined" />
          </InputFieldWrapper>
          
          <InputFieldWrapper label="Objective">
            <TextField fullWidth name="objective" value={formData.objective} onChange={handleChange} variant="outlined" />
          </InputFieldWrapper>
          
          <InputFieldWrapper label="Task Description">
            <TextField fullWidth multiline rows={4} name="taskDescription" value={formData.taskDescription} onChange={handleChange} variant="outlined" />
          </InputFieldWrapper>

          <InputFieldWrapper label="Deadline">
            <TextField fullWidth name="deadline" value={formData.deadline} onChange={handleChange} variant="outlined" />
          </InputFieldWrapper>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 3, mt: 'auto' }}>
          <Button variant="text" onClick={onClose} sx={{ color: 'text.secondary', textTransform: 'none', fontSize: '1rem' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: '#ff6f61', '&:hover': { bgcolor: '#e05252' }, borderRadius: '12px', textTransform: 'none', fontSize: '1rem', boxShadow: 'none' }}>Save Changes</Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default EditMyTaskModal;