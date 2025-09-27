import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { AppThemeProvider, useThemeContext } from './theme/ThemeContext';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import AuthLayout from './components/AuthLayout';
import Dashboard from './components/Dashboard';
import DashboardLayout from './components/DashboardLayout';
import VitalTask from './components/VitalTask';
import MyTask from './components/MyTask';
import TaskCategories from './components/TaskCategories';
import Settings from './components/Settings';
import Help from './components/Help';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const AppContent = () => {
  const { themeMode } = useThemeContext();

  return (
    <>
      <CssBaseline />
      <ToastContainer theme={themeMode} position="bottom-right" autoClose={3000} />
      <Router>
        <Routes>
          <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
          <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
          <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
          <Route path="/reset-password/:token" element={<AuthLayout><ResetPassword /></AuthLayout>} />
          <Route
            path="/"
            element={<PrivateRoute><DashboardLayout /></PrivateRoute>}
          >
            <Route index element={<Dashboard />} />
            <Route path="vital-task" element={<VitalTask />} />
            <Route path="my-task" element={<MyTask />} />
            <Route path="task-categories" element={<TaskCategories />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<Help />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  )
}

function App() {
  return (
    <AppThemeProvider>
      <AppContent />
    </AppThemeProvider>
  );
}

export default App;