import React, { useEffect, useState } from 'react';

const TaskCard = React.memo(
  ({ task, onUpdateTask, onDeleteTask }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ ...task });
    const [editError, setEditError] = useState('');

    // Update edit form if task changes
    useEffect(() => {
      setEditForm({ ...task });
    }, [task]);

    // Get Task Status
    const getTaskStatus = () => {
      const taskDateTime = new Date(
        `${task.date}T${task.time}`
      );

      const now = new Date();

      const today = new Date();
      const todayStr =
        `${today.getFullYear()}-${String(
          today.getMonth() + 1
        ).padStart(2, '0')}-${String(
          today.getDate()
        ).padStart(2, '0')}`;

      if (taskDateTime < now) {
        return {
          status: 'Overdue',
          bgClass: 'bg-danger-subtle',
          badge: 'bg-danger',
        };
      }

      if (task.date === todayStr) {
        return {
          status: 'Due Today',
          bgClass: 'bg-warning-subtle',
          badge: 'bg-warning text-dark',
        };
      }

      return {
        status: 'Upcoming',
        bgClass: 'bg-white',
        badge: 'bg-primary',
      };
    };

    const { status, bgClass, badge } = getTaskStatus();

    // Handle Edit Inputs
    const handleInputChange = (field, value) => {
      setEditForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

    // Cancel Editing
    const handleCancel = () => {
      setEditForm({ ...task });
      setIsEditing(false);
      setEditError('');
    };

    // Escape Key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };

    // Save Edited Task
    const handleSave = () => {
      if (!editForm.title.trim()) {
        setEditError('Title is required.');
        return;
      }

      if (!editForm.date || !editForm.time) {
        setEditError('Date and time are required.');
        return;
      }

      const taskDateTime = new Date(
        `${editForm.date}T${editForm.time}`
      );

      if (taskDateTime < new Date()) {
        setEditError('Cannot set date/time to the past.');
        return;
      }

      onUpdateTask(editForm);

      setIsEditing(false);
      setEditError('');
    };

    // Editing Mode
    if (isEditing) {
      return (
        <div
          className="card p-3 mb-3 border shadow-sm"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <div className="mb-2">
            <input
              type="text"
              className="form-control mb-2"
              value={editForm.title}
              maxLength={30}
              onChange={(e) =>
                handleInputChange('title', e.target.value)
              }
            />

            <textarea
              className="form-control mb-2"
              value={editForm.description}
              onChange={(e) =>
                handleInputChange(
                  'description',
                  e.target.value
                )
              }
              rows="2"
            />

            <div className="d-flex gap-2 mb-2">
              <input
                type="date"
                className="form-control"
                value={editForm.date}
                onChange={(e) =>
                  handleInputChange('date', e.target.value)
                }
              />

              <input
                type="time"
                className="form-control"
                value={editForm.time}
                onChange={(e) =>
                  handleInputChange('time', e.target.value)
                }
              />
            </div>

            <select
              className="form-select mb-2"
              value={editForm.category}
              onChange={(e) =>
                handleInputChange(
                  'category',
                  e.target.value
                )
              }
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Study">Study</option>
            </select>

            {editError && (
              <div className="text-danger small mb-2">
                {editError}
              </div>
            )}
          </div>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-sm btn-success"
              onClick={handleSave}
            >
              Save
            </button>

            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={handleCancel}
            >
              Cancel (Esc)
            </button>
          </div>
        </div>
      );
    }

    // Normal Mode
    return (
      <div
        className={`card p-3 mb-3 shadow-sm ${bgClass}`}
      >
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5
            className="card-title text-truncate me-2"
            style={{ maxWidth: '200px' }}
          >
            {task.title}
          </h5>

          <div>
            <span className={`badge me-1 ${badge}`}>
              {status}
            </span>

            <span className="badge bg-secondary">
              {task.category}
            </span>
          </div>
        </div>

        <p className="card-text text-truncate">
          {task.description || 'No description'}
        </p>

        <p className="card-text small text-muted mb-3">
          📅{' '}
          {task.getFormattedDate
            ? task.getFormattedDate()
            : task.date}{' '}
          at ⏰ {task.time}
        </p>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>

          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => {
              if (
                window.confirm(
                  'Are you sure you want to delete this task?'
                )
              ) {
                onDeleteTask(task.id);
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }
);

export default TaskCard;