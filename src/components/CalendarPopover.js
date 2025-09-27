import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './CalendarPopover.css';
import { IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight, Reply } from '@mui/icons-material';

const CustomHeader = ({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
  <div className="custom-calendar-header">
    <IconButton onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="nav-button"><ChevronLeft /></IconButton>
    <span className="month-year">{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
    <IconButton onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="nav-button"><ChevronRight /></IconButton>
  </div>
);

function CalendarPopover({ open, selectedDate, onChange, onClose }) {
  if (!open) return null;

  return (
    <div className="calendar-popover-container">
      <div className="calendar-popover-header">
        <span className="calendar-title">Calendar</span>
        <IconButton onClick={onClose} className="close-button"><Reply /></IconButton>
      </div>
      <DatePicker selected={selectedDate} onChange={onChange} inline renderCustomHeader={CustomHeader} dayClassName={() => "calendar-day"} popperPlacement="bottom-end" />
    </div>
  );
}

export default CalendarPopover;