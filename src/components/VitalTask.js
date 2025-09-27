import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Checkbox } from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    RadioButtonChecked,
} from '@mui/icons-material';
import EditVitalTaskModal from './EditVitalTaskModal';
import { useDashboardContext } from './DashboardLayout';

const initialVitalTasks = [
  { 
    id: 1, 
    title: "Walk the dog", 
    description: "Take the dog to the park and bring treats.", 
    fullDescription: "Take the dog to the local park for at least 30 minutes. Remember to bring his favorite treats for training reinforcement and a ball for fetch. Ensure he has fresh water before and after the walk.", 
    priority: "Extreme", 
    status: "Not Started", 
    createdOn: "20/06/2023", 
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?fit=crop&w=600&h=400",
    checklist: [
        { id: 1, text: "Attach leash and harness", completed: true },
        { id: 2, text: "Pack water bottle and bowl", completed: false },
        { id: 3, text: "Play fetch for 15 minutes", completed: false },
    ]
  },
  { 
    id: 2, 
    title: "Take grandma to the hospital", 
    description: "Appointment with Dr. Smith at 2 PM.", 
    fullDescription: "Accompany grandma to her 2 PM appointment with Dr. Smith for her annual check-up. Make sure to bring her medical file, a list of current medications, and her insurance card.", 
    priority: "Moderate", 
    status: "In Progress", 
    createdOn: "20/06/2023", 
    image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?fit=crop&w=600&h=400",
    checklist: [
        { id: 1, text: "Confirm appointment time", completed: true },
        { id: 2, text: "Gather all medical records", completed: true },
        { id: 3, text: "Arrange for transportation", completed: false },
    ]
  },
  { 
    id: 3, 
    title: "Project Presentation Prep", 
    description: "Finalize slides and rehearse the presentation.", 
    fullDescription: "Complete the final draft of the quarterly project presentation. Review all data points for accuracy, then rehearse the full presentation at least twice to ensure timing and flow are correct.", 
    priority: "Extreme", 
    status: "Not Started", 
    createdOn: "25/06/2023", 
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?fit=crop&w=600&h=400",
    checklist: [
        { id: 1, text: "Finalize slide deck content", completed: true },
        { id: 2, text: "Review speaker notes", completed: false },
        { id: 3, text: "Conduct a mock presentation", completed: false },
    ]
  },
  { 
    id: 4, 
    title: "Book Flight Tickets", 
    description: "Book round-trip tickets to New York.", 
    fullDescription: "Book round-trip flight tickets to New York for the upcoming conference. Aim for a departure on Tuesday morning and a return flight on Friday evening. Check for preferred seating.", 
    priority: "Moderate", 
    status: "In Progress", 
    createdOn: "24/06/2023", 
    image: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?fit=crop&w=600&h=400",
    checklist: [
        { id: 1, text: "Compare flight prices online", completed: true },
        { id: 2, text: "Confirm baggage allowance", completed: true },
        { id: 3, text: "Select and confirm seats", completed: false },
    ]
  },
  { 
    id: 5, 
    title: "Grocery Shopping", 
    description: "Buy weekly groceries from the list.", 
    fullDescription: "Purchase all items on the weekly grocery list from the supermarket. Focus on fresh produce, dairy, and pantry staples. Remember to use the reusable bags.", 
    priority: "Low", 
    status: "Not Started", 
    createdOn: "26/06/2023", 
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?fit=crop&w=600&h=400",
    checklist: [
        { id: 1, text: "Check pantry for staples", completed: true },
        { id: 2, text: "Buy fresh vegetables and fruits", completed: false },
        { id: 3, text: "Get dairy products", completed: false },
    ]
  }
];

const getPriorityColor = (priority) => {
    if (priority === 'Extreme') return '#ff5757';
    if (priority === 'Moderate') return '#2196f3';
    return '#4caf50';
};

function VitalTask() {
  const { searchTerm } = useDashboardContext();
  const [tasks, setTasks] = useState(initialVitalTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (filteredTasks.length > 0 && !selectedTask) {
        setSelectedTask(filteredTasks[0]);
    } else if (selectedTask && !filteredTasks.find(t => t.id === selectedTask.id)) {
        setSelectedTask(filteredTasks.length > 0 ? filteredTasks[0] : null);
    }
  }, [searchTerm, filteredTasks, selectedTask]);

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure?")) { 
        const newTasks = tasks.filter(t => t.id !== taskId); 
        setTasks(newTasks); 
        if (selectedTask?.id === taskId) {
            setSelectedTask(newTasks.length > 0 ? newTasks[0] : null);
        }
    }
  };

  const handleUpdateTask = (updatedTask) => {
    const newTasks = tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)); 
    setTasks(newTasks); 
    setSelectedTask(updatedTask); 
    setEditModalOpen(false);
  };

  const handleToggleChecklist = (taskId, checklistItemId) => {
    const newTasks = tasks.map(task => {
        if (task.id === taskId) {
            const newChecklist = task.checklist.map(item => {
                if (item.id === checklistItemId) {
                    return { ...item, completed: !item.completed };
                }
                return item;
            });
            return { ...task, checklist: newChecklist };
        }
        return task;
    });
    setTasks(newTasks);
    if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask(newTasks.find(t => t.id === taskId));
    }
  };

  return (
    <>
      <EditVitalTaskModal open={isEditModalOpen} onClose={() => setEditModalOpen(false)} taskToEdit={selectedTask} onUpdateTask={handleUpdateTask} />
      <Box sx={{ display: 'flex', height: '100%', gap: 3 }}>
        <Box sx={{ width: '450px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', pr: 1 }}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <Card key={task.id} onClick={() => setSelectedTask(task)} elevation={2} sx={{ bgcolor: '#fff', borderRadius: '16px', cursor: 'pointer', border: '2px solid', borderColor: selectedTask?.id === task.id ? '#ff6f61' : 'transparent', boxShadow: selectedTask?.id === task.id ? '0 4px 12px rgba(255, 111, 97, 0.4)' : '0 2px 4px rgba(0,0,0,0.05)', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' } }}>
                <CardContent sx={{ p: '16px !important', display: 'grid', gridTemplateColumns: '1fr 100px', gap: '12px 16px', alignItems: 'center' }}>
                  <Box sx={{ gridColumn: '1 / 2', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <RadioButtonChecked sx={{ color: getPriorityColor(task.priority) }} />
                    <Typography variant="h6" sx={{ color: 'text.primary', fontSize: '1rem', fontWeight: 600 }}>{task.title}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ gridColumn: '1 / 2', color: 'text.secondary' }}>{task.description}</Typography>
                  <Box sx={{ gridColumn: '2 / 3', gridRow: '1 / 4', width: '100px', height: '80px', borderRadius: '12px', overflow: 'hidden' }}>
                      <img src={task.image} alt={task.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                  <Box sx={{ gridColumn: '1 / 2', display: 'flex', justifyContent: 'space-between', color: 'text.secondary', pt: 1, mt: 1, borderTop: '1px solid #f0f0f0' }}>
                    <Typography variant="caption">Priority: <span style={{ color: getPriorityColor(task.priority), fontWeight: 'bold' }}>{task.priority}</span></Typography>
                    <Typography variant="caption">Status: <span style={{ color: getPriorityColor(task.priority), fontWeight: 'bold' }}>{task.status}</span></Typography>
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography sx={{ color: 'text.secondary', p: 2, textAlign: 'center' }}>No vital tasks found for "{searchTerm}"</Typography>
          )}
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#fff', borderRadius: '20px', p: 4, position: 'relative', overflowY: 'auto', border: '1px solid #f0f0f0' }}>
          {selectedTask ? (
            <>
              <Box sx={{ paddingBottom: '80px' }}>
                <Box sx={{ width: '100%', height: '300px', borderRadius: '16px', mb: 3, overflow: 'hidden' }}>
                  <img src={selectedTask.image} alt={selectedTask.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
                <Box sx={{ display: 'flex', gap: 3, color: 'text.secondary', mb: 2 }}>
                  <Typography variant="body2">Priority: <span style={{ color: getPriorityColor(selectedTask.priority), fontWeight: '600' }}>{selectedTask.priority}</span></Typography>
                  <Typography variant="body2">Status: <span style={{ color: getPriorityColor(selectedTask.priority), fontWeight: '600' }}>{selectedTask.status}</span></Typography>
                  <Typography variant="body2">Created on: {selectedTask.createdOn}</Typography>
                </Box>
                <Typography variant="h4" sx={{ mb: 2, fontWeight: '700', color: 'text.primary' }}>{selectedTask.title}</Typography>
                <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7, color: 'text.secondary', whiteSpace: 'pre-wrap' }}>{selectedTask.fullDescription}</Typography>
                
                <Typography variant="h6" sx={{ mb: 2, fontWeight: '600', color: 'text.primary' }}>Checklist</Typography>
                <List>
                  {selectedTask.checklist.map(item => (
                    <ListItem key={item.id} dense button onClick={() => handleToggleChecklist(selectedTask.id, item.id)}>
                      <ListItemIcon>
                        <Checkbox edge="start" checked={item.completed} tabIndex={-1} disableRipple />
                      </ListItemIcon>
                      <ListItemText primary={item.text} sx={{ textDecoration: item.completed ? 'line-through' : 'none', color: item.completed ? 'text.disabled' : 'text.primary' }} />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Box sx={{ position: 'absolute', bottom: 32, right: 32, display: 'flex', gap: 2 }}>
                <IconButton onClick={() => handleDeleteTask(selectedTask.id)} sx={{ width: 60, height: 60, color: 'white', bgcolor: '#ff6f61', '&:hover': { bgcolor: '#e05252' } }}><DeleteIcon /></IconButton>
                <IconButton onClick={() => setEditModalOpen(true)} sx={{ width: 60, height: 60, color: 'white', bgcolor: '#2196f3', '&:hover': { bgcolor: '#1976d2' } }}><EditIcon /></IconButton>
              </Box>
            </>
          ) : ( <Typography sx={{ color: 'text.secondary', textAlign: 'center', mt: 5 }}>No vital tasks to display.</Typography> )}
        </Box>
      </Box>
    </>
  );
}

export default VitalTask;