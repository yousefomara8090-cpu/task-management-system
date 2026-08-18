import React, { useState, useRef, useEffect } from 'react';

const TITLE_REGEX = /^[A-Za-z0-9\s]{3,30}$/;

function getTodayString() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState('Work');

  const [titleError, setTitleError] = useState('');
  const [dateError, setDateError] = useState('');

  const titleInputRef = useRef(null);

  // Focus title input when component loads
  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  // Validate Title
  const handleTitleChange = (e) => {
    const value = e.target.value;

    setTitle(value);

    if (!value) {
      setTitleError('Title is required.');
    } else if (!TITLE_REGEX.test(value)) {
      setTitleError('Title must be 3-30 letters/numbers only.');
    } else {
      setTitleError('');
    }
  };

  // Validate Date and Time
  const validateDateTime = (selectedDate, selectedTime) => {
    if (!selectedDate) {
      setDateError('Please select a date.');
      return false;
    }

    const todayStr = getTodayString();

    if (selectedDate < todayStr) {
      setDateError('Date cannot be in the past.');
      return false;
    }

    if (selectedDate === todayStr && selectedTime) {
      const now = new Date();
      const [hours, minutes] = selectedTime.split(':').map(Number);

      const selectedDateTime = new Date();

      selectedDateTime.setHours(hours, minutes, 0, 0);

      if (selectedDateTime < now) {
        setDateError('Time cannot be in the past for today.');
        return false;
      }
    }

    setDateError('');
    return true;
  };

  const handleDateChange = (e) => {
    const value = e.target.value;

    setDate(value);
    validateDateTime(value, time);
  };

  const handleTimeChange = (e) => {
    const value = e.target.value;

    setTime(value);
    validateDateTime(date, value);
  };

  // Submit Form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!TITLE_REGEX.test(title)) {
      setTitleError('Title must be 3-30 letters/numbers only.');
      return;
    }

    if (!date || !time) {
      setDateError('Please select both date and time.');
      return;
    }

    if (!validateDateTime(date, time)) {
      return;
    }

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      date,
      time,
      category,
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setCategory('Work');

    setTitleError('');
    setDateError('');

    titleInputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3 mb-4 shadow-sm">
      <h4 className="card-title mb-3">Add New Task</h4>

      {/* Title */}
      <div className="mb-2">
        <label className="form-label">Title</label>

        <input
          ref={titleInputRef}
          type="text"
          className={`form-control ${
            title ? (titleError ? 'is-invalid' : 'is-valid') : ''
          }`}
          value={title}
          onChange={handleTitleChange}
          placeholder="Task title (3-30 chars)"
          maxLength={30}
          required
        />

        {titleError && (
          <div className="text-danger small mt-1">
            {titleError}
          </div>
        )}

        {!titleError && title && (
          <div className="text-success small mt-1">
            Title looks good!
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mb-2">
        <label className="form-label">Description</label>

        <textarea
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="2"
          placeholder="Task description"
        />
      </div>

      {/* Date / Time / Category */}
      <div className="row mb-2">
        <div className="col-md-4">
          <label className="form-label">Date</label>

          <input
            type="date"
            className="form-control"
            value={date}
            min={getTodayString()}
            onChange={handleDateChange}
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Time</label>

          <input
            type="time"
            className="form-control"
            value={time}
            onChange={handleTimeChange}
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Category</label>

          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Study">Study</option>
          </select>
        </div>
      </div>

      {/* Date Error */}
      {dateError && (
        <div className="text-danger small mb-2">
          {dateError}
        </div>
      )}

      <button type="submit" className="btn btn-primary mt-2">
        Add Task
      </button>
    </form>
  );
}

export default TaskForm;