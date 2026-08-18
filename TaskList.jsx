import React from 'react';
import TaskCard from './TaskCard';

function TaskList({
  tasks,
  filterCategory,
  onFilterChange,
  onUpdateTask,
  onDeleteTask,
}) {
  // Category Statistics
  const stats = tasks.reduce(
    (acc, task) => {
      if (task.category === 'Work') {
        acc.Work++;
      } else if (task.category === 'Personal') {
        acc.Personal++;
      } else if (task.category === 'Study') {
        acc.Study++;
      }

      return acc;
    },
    {
      Work: 0,
      Personal: 0,
      Study: 0,
    }
  );

  // Filter Tasks
  const filteredTasks = tasks.filter((task) => {
    if (filterCategory === 'All') {
      return true;
    }

    return task.category === filterCategory;
  });

  return (
    <div>
      {/* Statistics */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <span className="badge bg-dark p-2">
          Work: {stats.Work}
        </span>

        <span className="badge bg-dark p-2">
          Personal: {stats.Personal}
        </span>

        <span className="badge bg-dark p-2">
          Study: {stats.Study}
        </span>
      </div>

      {/* Filter */}
      <div className="mb-3">
        <label className="form-label me-2 fw-bold">
          Filter by Category:
        </label>

        <select
          className="form-select d-inline-block w-auto"
          value={filterCategory}
          onChange={(e) =>
            onFilterChange(e.target.value)
          }
        >
          <option value="All">All Categories</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Study">Study</option>
        </select>
      </div>

      {/* Tasks */}
      <div>
        {filteredTasks.length === 0 ? (
          <div className="alert alert-info text-center">
            No tasks yet
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TaskList;