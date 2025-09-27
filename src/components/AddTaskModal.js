import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { AddPhotoAlternate as UploadIcon } from '@mui/icons-material';
import './AddTaskModal.css';

function AddTaskModal({ open, onClose, onAddTask }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState('Moderate');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setError('Title is required!');
      return;
    }
    
    onAddTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      createdOn: date || new Date().toISOString().split('T')[0],
      status: "Not Started",
      image: imagePreview || 'https://images.unsplash.com/photo-1599507593498-27b355d9b897?w=100&h=80&fit=crop'
    });
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setDate('');
    setPriority('Moderate');
    setDescription('');
    setImagePreview('');
    setError('');
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="edit-modal-container">
        <Box className="edit-modal-header">
          <Typography variant="h5" className="edit-modal-title">Add Task</Typography>
          <Button variant="text" onClick={handleClose} className="go-back-btn">Go Back</Button>
        </Box>
        <Box className="edit-modal-body">
          <Box className="form-left">
            <Typography variant="subtitle1" className="form-label">Title</Typography>
            <TextField fullWidth variant="outlined" value={title} onChange={(e) => { setTitle(e.target.value); if(error) setError(''); }} error={!!error} helperText={error} />
            
            <Typography variant="subtitle1" className="form-label">Date</Typography>
            <TextField fullWidth variant="outlined" type="date" value={date} onChange={(e) => setDate(e.target.value)} placeholder="dd/mm/yyyy" />
            
            <Typography variant="subtitle1" className="form-label">Priority</Typography>
            <RadioGroup row value={priority} onChange={(e) => setPriority(e.target.value)} className="priority-group">
              <FormControlLabel value="Extreme" control={<Radio sx={{color: 'red', '&.Mui-checked': { color: 'red' }}}/>} label="Extreme" />
              <FormControlLabel value="Moderate" control={<Radio sx={{color: '#2196f3', '&.Mui-checked': { color: '#2196f3' }}}/>} label="Moderate" />
              <FormControlLabel value="Low" control={<Radio sx={{color: 'green', '&.Mui-checked': { color: 'green' }}}/>} label="Low" />
            </RadioGroup>

            <Typography variant="subtitle1" className="form-label">Task Description</Typography>
            <TextField fullWidth variant="outlined" multiline rows={6} placeholder="Start writing here...." value={description} onChange={(e) => setDescription(e.target.value)} />
          </Box>
          <Box className="form-right">
             <Typography variant="subtitle1" className="form-label">Upload Image</Typography>
             <Box className="upload-area">
                <input accept="image/*" style={{ display: 'none' }} id="raised-button-file" type="file" onChange={handleImageChange} />
                {imagePreview ? (<img src={imagePreview} alt="preview" className="image-preview"/>) : (<Box className="upload-placeholder"><UploadIcon sx={{ fontSize: 48, color: '#ccc' }} /><Typography>Drag&Drop files here</Typography><Typography>or</Typography><label htmlFor="raised-button-file"><Button variant="outlined" component="span" className="browse-btn">Browse</Button></label></Box>)}
             </Box>
          </Box>
        </Box>
        <Box className="edit-modal-footer">
            <Button variant="contained" onClick={handleSubmit} className="done-btn">Done</Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddTaskModal;