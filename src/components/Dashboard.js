import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, Card, CardContent, Menu, MenuItem, TextField } from '@mui/material';
import {
  Add as AddIcon, MoreVert as MoreVertIcon, Group as GroupIcon, CheckCircleOutline as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon, DonutLarge as DonutLargeIcon, Save as SaveIcon,
  Cancel as CancelIcon, Edit as EditIcon, DynamicFeed as DynamicFeedIcon, Insights as InsightsIcon, Delete as DeleteIcon
} from '@mui/icons-material';
import './Dashboard.css';
import AddTaskModal from './AddTaskModal';
import InviteModal from './InviteModal';
import { useDashboardContext } from './DashboardLayout';

const initialTasks = [
    { id: 1, title: "Attend Nischal's Birthday Party", description: "Buy gifts on the way...", status: "Not Started", priority: "Moderate", createdOn: "20/06/2023", image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=100&h=80&fit=crop" },
    { id: 2, title: "Landing Page Design for TravelDays", description: "Get the work done by EOD...", status: "In Progress", priority: "Moderate", createdOn: "20/06/2023", image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=100&h=80&fit=crop" },
    { id: 3, title: "Presentation on Final Product", description: "Make sure everything is functioning...", status: "In Progress", priority: "High", createdOn: "19/06/2023", image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=100&h=80&fit=crop" },
    { id: 4, title: "Develop API Endpoints", description: "Create and document user auth endpoints.", status: "In Progress", priority: "High", createdOn: "19/06/2023", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=100&h=80&fit=crop"},
    { id: 5, title: "Walk the dog", description: "Take the dog to the park and bring treats.", status: "Completed", priority: "Low", createdOn: "18/06/2023", completedAgo: "2 days ago", image: "https://images.unsplash.com/photo-1504595403659-9088ce801e29?w=100&h=80&fit=crop" },
    { id: 6, title: "Conduct quarterly meeting", description: "Finalize the project requirements.", status: "Completed", priority: "High", createdOn: "18/06/2023", completedAgo: "2 days ago", image: "https://images.unsplash.com/photo-1573496130407-57329f01f769?w=100&h=80&fit=crop" }
];

const getStatusColor = (status) => {
  if (status === 'Not Started') return '#ff5757';
  if (status === 'In Progress') return '#2196f3';
  if (status === 'Completed') return '#4caf50';
  return '#888';
};

function Dashboard() {
  const { searchTerm, selectedDate } = useDashboardContext();
  const [tasks, setTasks] = useState(initialTasks);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [teamMemberCount, setTeamMemberCount] = useState(3);
  const [taskStatusData] = useState({ completed: 84, inProgress: 46, notStarted: 13 });
  const [editingTask, setEditingTask] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentMenuTask, setCurrentMenuTask] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const todoTasks = tasks.filter(t => t.status !== 'Completed');
  const completedTasks = tasks.filter(t => t.status === 'Completed');
  const filteredTodoTasks = todoTasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTask = (taskDetails) => { setTasks(prev => [{ id: Date.now(), ...taskDetails }, ...prev]); setTaskModalOpen(false); };
  const handleInvite = (email) => { setTeamMemberCount(prev => prev + 1); setInviteModalOpen(false); };
  const handleDeleteTask = (taskId) => { if (window.confirm("Are you sure?")) { setTasks(tasks.filter(task => task.id !== taskId)); } };
  
  const handleStartEditing = (task) => {
    setEditingTask({ ...task });
  };

  const handleCancelEditing = () => { setEditingTask(null); };
  const handleSaveEditing = () => { setTasks(tasks.map(t => (t.id === editingTask.id ? editingTask : t))); setEditingTask(null); };
  const handleEditChange = (e) => { setEditingTask(prev => ({ ...prev, [e.target.name]: e.target.value })); };
  const handleMenuClick = (event, task) => { setAnchorEl(event.currentTarget); setCurrentMenuTask(task); };
  const handleMenuClose = () => { setAnchorEl(null); setCurrentMenuTask(null); };

  return (
    <>
      <AddTaskModal open={isTaskModalOpen} onClose={() => setTaskModalOpen(false)} onAddTask={handleAddTask} />
      <InviteModal open={isInviteModalOpen} onClose={() => setInviteModalOpen(false)} onInvite={handleInvite} />
      
      <Box className="main-content">
          <Card className="welcome-card" elevation={0}>
              <CardContent>
                  <Box><Typography variant="h5" className="welcome-title">Welcome back, Harshith! 👋</Typography><Typography variant="body2" className="welcome-subtitle">You have {filteredTodoTasks.length} tasks pending. Keep it up!</Typography></Box>
                  <Box className="welcome-actions"><Box className="team-counter"><Typography className="counter-number">{teamMemberCount}</Typography><Typography className="counter-label">Members</Typography></Box><Button variant="contained" className="invite-btn-filled" startIcon={<GroupIcon />} onClick={() => setInviteModalOpen(true)}>Invite Team</Button></Box>
              </CardContent>
          </Card>

          <Box className="tasks-and-status-grid-v2">
              <Box className="new-card-container todo-section">
                  <Box className="section-header-v2"><Typography variant="h6" className="section-title-v2"><DynamicFeedIcon className="section-title-icon"/>Active Tasks</Typography><Button startIcon={<AddIcon />} className="add-task-btn-v2" onClick={() => setTaskModalOpen(true)}>Add task</Button></Box>
                  <Typography variant="body2" className="date-subtitle-v2">{selectedDate && selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} • Today</Typography>
                  <Box className="new-tasks-list">
                      {filteredTodoTasks.map((task) => (
                          <Card key={task.id} className="new-task-card">
                              <CardContent className="new-task-card-content">
                                  <Box sx={{ color: getStatusColor(task.status) }} className="task-status-icon">{task.status === "In Progress" ? <DonutLargeIcon /> : <RadioButtonUncheckedIcon />}</Box>
                                  <Box className="new-task-details">
                                      { editingTask?.id === task.id ? (<TextField name="title" value={editingTask.title} onChange={handleEditChange} variant="standard" fullWidth className="editing-field"/>) : (<Typography variant="h6" className="new-task-title">{task.title}</Typography>)}
                                      { editingTask?.id === task.id ? (<TextField name="description" value={editingTask.description} onChange={handleEditChange} variant="standard" fullWidth multiline className="editing-field"/>) : (<Typography variant="body2" className="new-task-description">{task.description}</Typography>)}
                                      <Box className="new-task-meta"><span>Priority: <strong>{task.priority}</strong></span><span>Status: <strong style={{ color: getStatusColor(task.status) }}>{task.status}</strong></span><span>Created on: <strong>{task.createdOn}</strong></span></Box>
                                  </Box>
                                  { editingTask?.id === task.id ? (
                                      <Box className="editing-actions"><IconButton size="small" onClick={handleSaveEditing} sx={{ color: 'green' }}><SaveIcon /></IconButton><IconButton size="small" onClick={handleCancelEditing} sx={{ color: 'red' }}><CancelIcon /></IconButton></Box>
                                  ) : (
                                      <Box className="task-image-and-options">
                                          <img src={task.image} alt="task" className="new-task-image"/>
                                          <IconButton className="new-task-options-btn" onClick={(e) => handleMenuClick(e, task)}><MoreVertIcon /></IconButton>
                                      </Box>
                                  )}
                              </CardContent>
                          </Card>
                      ))}
                  </Box>
              </Box>

              <Box className="right-column-v2">
                  <Box className="new-card-container status-section">
                      <Typography variant="h6" className="section-title-v2"><InsightsIcon className="section-title-icon"/>Analytics Overview</Typography>
                      <Box className="status-charts">
                          <Box className="chart-item"><Box className="chart-circle-v2" style={{ background: `conic-gradient(#4caf50 ${taskStatusData.completed * 3.6}deg, #e0e0e0 0deg)` }}><Typography variant="h6">{taskStatusData.completed}%</Typography></Box><Typography className="chart-label completed">Completed</Typography></Box>
                          <Box className="chart-item"><Box className="chart-circle-v2" style={{ background: `conic-gradient(#2196f3 ${taskStatusData.inProgress * 3.6}deg, #e0e0e0 0deg)` }}><Typography variant="h6">{taskStatusData.inProgress}%</Typography></Box><Typography className="chart-label in-progress">In Progress</Typography></Box>
                          <Box className="chart-item"><Box className="chart-circle-v2" style={{ background: `conic-gradient(#ff5757 ${taskStatusData.notStarted * 3.6}deg, #e0e0e0 0deg)` }}><Typography variant="h6">{taskStatusData.notStarted}%</Typography></Box><Typography className="chart-label not-started">Not Started</Typography></Box>
                      </Box>
                  </Box>
                  <Box className="new-card-container completed-section">
                       <Typography variant="h6" className="section-title-v2"><CheckCircleIcon className="section-title-icon"/>Completed Tasks</Typography>
                       <Box className="new-tasks-list">
                          {completedTasks.map((task) => (
                              <Card key={task.id} className="new-task-card">
                                  <CardContent className="new-task-card-content">
                                      <Box sx={{ color: getStatusColor(task.status) }} className="task-status-icon"><CheckCircleIcon /></Box>
                                      <Box className="new-task-details">
                                          { editingTask?.id === task.id ? (<TextField name="title" value={editingTask.title} onChange={handleEditChange} variant="standard" fullWidth className="editing-field"/>) : (<Typography variant="h6" className="new-task-title">{task.title}</Typography>)}
                                          { editingTask?.id === task.id ? (<TextField name="description" value={editingTask.description} onChange={handleEditChange} variant="standard" fullWidth multiline className="editing-field"/>) : (<Typography variant="body2" className="new-task-description">{task.description}</Typography>)}
                                          <Box className="new-task-meta"><span>Status: <strong style={{ color: getStatusColor(task.status) }}>{task.status}</strong></span><span>Completed {task.completedAgo}</span></Box>
                                      </Box>
                                      { editingTask?.id === task.id ? (
                                          <Box className="editing-actions"><IconButton size="small" onClick={handleSaveEditing} sx={{ color: 'green' }}><SaveIcon /></IconButton><IconButton size="small" onClick={handleCancelEditing} sx={{ color: 'red' }}><CancelIcon /></IconButton></Box>
                                      ) : (
                                          <Box className="task-image-and-options">
                                              <img src={task.image} alt={task.title} className="new-task-image"/>
                                              <IconButton className="new-task-options-btn" onClick={(e) => handleMenuClick(e, task)}><MoreVertIcon /></IconButton>
                                          </Box>
                                      )}
                                  </CardContent>
                              </Card>
                          ))}
                       </Box>
                  </Box>
              </Box>
          </Box>
      </Box>

      <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
        <MenuItem onClick={() => { handleStartEditing(currentMenuTask); handleMenuClose(); }}><EditIcon sx={{ marginRight: 1 }} /> Edit</MenuItem>
        <MenuItem onClick={() => { handleDeleteTask(currentMenuTask.id); handleMenuClose(); }}><DeleteIcon sx={{ marginRight: 1 }} /> Delete</MenuItem>
      </Menu>
    </>
  );
}

export default Dashboard;