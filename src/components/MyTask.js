import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, IconButton, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useDashboardContext } from './DashboardLayout';
import { Delete as DeleteIcon, Edit as EditIcon, MoreVert as MoreVertIcon, RadioButtonChecked, Label as LabelIcon } from '@mui/icons-material';
import EditMyTaskModal from './EditMyTaskModal';

const initialMyTasks = [
  {
    id: 201, title: "Submit Documents", shortDescription: "Make sure to submit all the necessary docum.....", priority: "Extreme", status: "Not Started", createdOn: "20/06/2023", objective: "To submit required documents for something important", taskDescription: "Review the list of documents required for submission and ensure all necessary documents are ready. Organize the documents accordingly and scan them if physical copies need to be submitted digitally. Rename the scanned files appropriately for easy identification and verify the accepted file formats. Upload the documents securely to the designated platform, double-check for accuracy, and obtain confirmation of successful submission. Follow up if necessary to ensure proper processing.", additionalNotes: ["Ensure that the documents are authentic and up-to-date.", "Maintain confidentiality and security of sensitive information during the submission process.", "If there are specific guidelines or deadlines for submission, adhere to them diligently."], deadline: "End of Day"
  },
  {
    id: 202, title: "Complete Assignments", shortDescription: "The assignments must be completed to pass final year....", priority: "Moderate", status: "In Progress", createdOn: "20/06/2023", objective: "To complete all pending academic assignments for the semester.", taskDescription: "Break down each assignment into smaller, manageable tasks. Allocate specific time slots for each assignment, prioritizing the ones with nearer deadlines. Gather all necessary resources, including textbooks, research papers, and lecture notes.", additionalNotes: ["Proofread all assignments for grammatical errors and plagiarism before submission.", "Ensure all citation and formatting guidelines are met."], deadline: "End of Week"
  },
  {
    id: 203, title: "Client Follow-up", shortDescription: "Follow up with the new client about the proposal....", priority: "Moderate", status: "Not Started", createdOn: "22/06/2023", objective: "To secure a partnership with the new client.", taskDescription: "Draft a polite and professional follow-up email regarding the business proposal sent last week. Reiterate the key benefits of the proposal and express eagerness to answer any questions they might have.", additionalNotes: ["Attach a summarized version of the proposal for their convenience.", "Suggest a brief call to discuss the proposal in more detail."], deadline: "Tomorrow"
  },
  {
    id: 204, title: "Prepare for Team Meeting", shortDescription: "Compile agenda and talking points for the weekly sync.", priority: "Low", status: "Not Started", createdOn: "24/06/2023", objective: "To ensure the weekly team meeting is productive and focused.", taskDescription: "Create a clear agenda covering key project updates, action items from the previous week, and open discussion topics. Distribute the agenda to all team members 24 hours in advance.", additionalNotes: ["Book a meeting room or set up the virtual conference link.", "Prepare a brief slide deck for project milestones."], deadline: "Wednesday, 10 AM"
  },
  {
    id: 205, title: "Update Project Roadmap", shortDescription: "Adjust Q4 roadmap based on recent feedback.", priority: "Extreme", status: "In Progress", createdOn: "25/06/2023", objective: "To align the project roadmap with new strategic priorities for Q4.", taskDescription: "Review stakeholder feedback from the last planning session. Update the project management tool with the revised timelines and deliverables. Clearly communicate the changes to all relevant teams.", additionalNotes: ["Get final approval from the project sponsor before publishing the new roadmap.", "Ensure resource allocation is updated accordingly."], deadline: "End of Month"
  }
];

const getPriorityColor = (priority) => {
    if (priority === 'Extreme') return '#ff5757';
    if (priority === 'Moderate') return '#2196f3';
    return '#4caf50';
};

function MyTask() {
  const { searchTerm } = useDashboardContext();
  const [tasks, setTasks] = useState(initialMyTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTaskForMenu, setCurrentTaskForMenu] = useState(null);

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (selectedTask && !filteredTasks.some(t => t.id === selectedTask.id)) {
        setSelectedTask(filteredTasks.length > 0 ? filteredTasks[0] : null);
    } else if (!selectedTask && filteredTasks.length > 0) {
        setSelectedTask(filteredTasks[0]);
    }
  }, [searchTerm, filteredTasks, selectedTask]);

  const handleOpenEditModal = (task) => {
    setSelectedTask(task);
    setEditModalOpen(true);
    handleMenuClose();
  };

  const handleDeleteTask = (taskToDelete) => {
      if (window.confirm(`Are you sure you want to delete "${taskToDelete.title}"?`)) {
          const newTasks = tasks.filter(t => t.id !== taskToDelete.id);
          setTasks(newTasks);
          if (selectedTask?.id === taskToDelete.id) {
            setSelectedTask(newTasks.length > 0 ? newTasks[0] : null);
          }
      }
      handleMenuClose();
  };

  const handleUpdateTask = (updatedTask) => {
      const newTasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
      setTasks(newTasks);
      setSelectedTask(updatedTask);
  };
  
  const handleMenuClick = (event, task) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setCurrentTaskForMenu(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentTaskForMenu(null);
  };

  return (
    <>
      <EditMyTaskModal 
        open={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        taskToEdit={selectedTask}
        onUpdateTask={handleUpdateTask}
      />
      <Box sx={{ display: 'flex', height: '100%', gap: 3 }}>
        <Box sx={{ width: '450px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', pr: 1 }}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <Card key={task.id} onClick={() => setSelectedTask(task)} elevation={2} sx={{ bgcolor: '#fff', borderRadius: '16px', cursor: 'pointer', border: '2px solid', borderColor: selectedTask?.id === task.id ? getPriorityColor(task.priority) : 'transparent', boxShadow: selectedTask?.id === task.id ? `0 4px 12px ${getPriorityColor(task.priority)}40` : '0 2px 4px rgba(0,0,0,0.05)', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' } }}>
                <CardContent sx={{ p: '16px !important', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gridTemplateRows: 'auto auto auto', gap: '4px 16px', alignItems: 'center' }}>
                  <RadioButtonChecked sx={{ gridRow: '1 / span 2', color: getPriorityColor(task.priority) }} />
                  <Typography variant="h6" sx={{ gridColumn: '2 / 3', color: 'text.primary', fontSize: '1rem', fontWeight: 600 }}>{task.title}</Typography>
                  <IconButton onClick={(e) => handleMenuClick(e, task)} sx={{ gridColumn: '3 / 4', gridRow: '1 / span 2', color: 'text.secondary' }}><MoreVertIcon /></IconButton>
                  <Typography variant="body2" sx={{ gridColumn: '2 / 3', gridRow: '2 / 3', color: 'text.secondary' }}>{task.shortDescription}</Typography>
                  <Box sx={{ gridColumn: '1 / 4', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'text.secondary', borderTop: '1px solid #f0f0f0', pt: 1.5, mt: 1 }}>
                    <Typography variant="caption">Priority: <span style={{ color: getPriorityColor(task.priority), fontWeight: 'bold' }}>{task.priority}</span></Typography>
                    <Typography variant="caption">Status: <span style={{ color: task.status === 'In Progress' ? '#2196f3' : getPriorityColor(task.priority), fontWeight: 'bold' }}>{task.status}</span></Typography>
                    <Typography variant="caption">Created on: {task.createdOn}</Typography>
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : ( <Typography sx={{ color: 'text.secondary', p: 2, textAlign: 'center' }}>No tasks found for "{searchTerm}"</Typography> )}
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#fff', borderRadius: '20px', p: 4, position: 'relative', overflowY: 'auto', border: '1px solid #f0f0f0' }}>
          {selectedTask ? (
            <Box sx={{ paddingBottom: '80px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0', pb: 2, mb: 3}}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>{selectedTask.title}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 4, color: 'text.secondary', mb: 4 }}>
                <Typography variant="body2">Priority: <span style={{ fontWeight: '600', color: getPriorityColor(selectedTask.priority) }}>{selectedTask.priority}</span></Typography>
                <Typography variant="body2">Status: <span style={{ fontWeight: '600', color: selectedTask.status === 'In Progress' ? '#2196f3' : getPriorityColor(selectedTask.priority) }}>{selectedTask.status}</span></Typography>
                <Typography variant="body2">Created on: <span style={{ fontWeight: '600', color: 'text.primary' }}>{selectedTask.createdOn}</span></Typography>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>Objective</Typography>
              <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7, color: 'text.secondary' }}>{selectedTask.objective}</Typography>
              
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>Task Description</Typography>
              <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7, color: 'text.secondary' }}>{selectedTask.taskDescription}</Typography>
              
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}>Additional Notes</Typography>
              <List sx={{ p: 0, mb: 4 }}>
                {selectedTask.additionalNotes.map((note, index) => (
                    <ListItem key={index} sx={{ p: 0 }}>
                        <ListItemIcon sx={{ minWidth: '32px' }}><LabelIcon fontSize="small" sx={{ color: getPriorityColor(selectedTask.priority) }} /></ListItemIcon>
                        <ListItemText primary={note} primaryTypographyProps={{ color: 'text.secondary' }} />
                    </ListItem>
                ))}
              </List>

              <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>Deadline: <span style={{ fontWeight: 'normal' }}>{selectedTask.deadline}</span></Typography>
              </Box>

              <Box sx={{ position: 'absolute', bottom: 32, right: 32, display: 'flex', gap: 2 }}>
                <IconButton onClick={() => handleDeleteTask(selectedTask)} sx={{ width: 60, height: 60, color: 'white', bgcolor: '#ff6f61', '&:hover': { bgcolor: '#e05252' } }}><DeleteIcon /></IconButton>
                <IconButton onClick={() => handleOpenEditModal(selectedTask)} sx={{ width: 60, height: 60, color: 'white', bgcolor: '#2196f3', '&:hover': { bgcolor: '#1976d2' } }}><EditIcon /></IconButton>
              </Box>
            </Box>
          ) : ( <Typography sx={{ color: 'text.secondary', textAlign: 'center', mt: 5 }}>Select a task to see the details.</Typography> )}
        </Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } }}
      >
        <MenuItem onClick={() => handleOpenEditModal(currentTaskForMenu)}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Edit Task</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDeleteTask(currentTaskForMenu)}>
          <ListItemIcon><DeleteIcon fontSize="small" sx={{ color: '#ff5757' }} /></ListItemIcon>
          <ListItemText>Delete Task</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

export default MyTask;