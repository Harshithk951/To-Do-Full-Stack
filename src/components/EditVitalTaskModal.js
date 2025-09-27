import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, RadioGroup, FormControlLabel, Radio } from '@mui/material'; // No longer imports IconButton
import { FileUpload as FileUploadIcon } from '@mui/icons-material';

function EditVitalTaskModal({ open, onClose, onUpdateTask, taskToEdit }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Moderate');
  const [description, setDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setPriority(taskToEdit.priority || 'Moderate');
      setDescription(taskToEdit.description || '');
      setFullDescription(taskToEdit.fullDescription || '');
      setImagePreview(taskToEdit.image || '');
      setImageUrl('');
    }
  }, [taskToEdit]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newImagePreview = URL.createObjectURL(file);
      setImagePreview(newImagePreview);
      setImageUrl('');
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setImagePreview(url);
  };
  
  const handleSubmit = () => {
    if (!title.trim()) { setError('Title is required!'); return; }
    onUpdateTask({ ...taskToEdit, title: title.trim(), description: description.trim(), fullDescription: fullDescription.trim(), priority, image: imagePreview });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ bgcolor: 'white', borderRadius: '16px', boxShadow: 24, p: 4, width: '900px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', outline: 'none' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0', pb: 2, mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>Edit Vital Task</Typography>
            <Box sx={{ width: '40px', height: '4px', bgcolor: '#ff6f61', borderRadius: '2px', mt: 0.5 }} />
          </Box>
          <Button variant="text" onClick={onClose} sx={{ color: 'text.secondary' }}>Cancel</Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 4, overflowY: 'auto', pr: 2 }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'medium', color: 'text.secondary' }}>Title</Typography>
              <TextField fullWidth variant="outlined" size="small" value={title} onChange={(e) => { setTitle(e.target.value); if(error) setError(''); }} error={!!error} helperText={error} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'medium', color: 'text.secondary' }}>Priority</Typography>
              <RadioGroup row value={priority} onChange={(e) => setPriority(e.target.value)}>
                <FormControlLabel value="Extreme" control={<Radio sx={{color: 'red', '&.Mui-checked': { color: 'red' }}}/>} label="Extreme" />
                <FormControlLabel value="Moderate" control={<Radio sx={{color: '#2196f3', '&.Mui-checked': { color: '#2196f3' }}}/>} label="Moderate" />
                <FormControlLabel value="Low" control={<Radio sx={{color: 'green', '&.Mui-checked': { color: 'green' }}}/>} label="Low" />
              </RadioGroup>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'medium', color: 'text.secondary' }}>Short Description (Card View)</Typography>
              <TextField fullWidth variant="outlined" multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'medium', color: 'text.secondary' }}>Full Description (Details View)</Typography>
              <TextField fullWidth variant="outlined" multiline rows={6} value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} />
            </Box>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'medium', color: 'text.secondary' }}>Upload Image</Typography>
              <Box sx={{ height: '200px', border: '2px dashed #e0e0e0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url(${imagePreview})`, position: 'relative', overflow: 'hidden' }}>
                {!imagePreview && <Typography sx={{ color: 'text.disabled' }}>Image Preview</Typography>}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button variant="outlined" component="label" startIcon={<FileUploadIcon />} sx={{ flexShrink: 0 }}> Upload File <input type="file" hidden accept="image/*" onChange={handleFileChange} /> </Button>
              <TextField fullWidth variant="outlined" size="small" label="Or paste image URL" value={imageUrl} onChange={handleUrlChange} />
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', pt: 3, mt: 'auto', borderTop: '1px solid #e0e0e0' }}>
          <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: '#ff6f61', color: 'white', textTransform: 'none', fontWeight: 'bold', fontSize: '1rem', px: 4, py: 1, borderRadius: '8px', '&:hover': { bgcolor: '#e05252' } }}> Update Task </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default EditVitalTaskModal;