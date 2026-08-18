import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';

import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import {
  Task,
  saveTasks,
  loadTasks,
} from '../utils/Task';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filterCategory, setFilterCategory] =
    useState('All');
  const [showNotification, setShowNotification] =
    useState(false);
  const [screenWidth, setScreenWidth] = useState(
    window.innerWidth
  );

  const intervalRef = useRef(null);
  const notificationTimeoutRef = useRef(null);

  // Load Tasks
  useEffect(() => {
    const loadedTasks = loadTasks();
    setTasks(loadedTasks);
  }, []);

  // Auto Save
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Cross Tab Synchronization
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'tasks_data') {
        setTasks(loadTasks());
      }
    };

    window.addEventListener(
      'storage',
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        'storage',
        handleStorageChange
      );
    };
  }, []);

  // Window Resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener(
        'resize',
        handleResize
      );
    };
  }, []);

  // Reminder
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const now = new Date();

      const year = now.getFullYear();
      const month = String(
        now.getMonth() + 1
      ).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');

      const currentDate = `${year}-${month}-${day}`;

      const currentHours = String(
        now.getHours()
      ).padStart(2, '0');

      const currentMinutes = String(
        now.getMinutes()
      ).padStart(2, '0');

      const currentTime = `${currentHours}:${currentMinutes}`;

      tasks.forEach((task) => {
        if (
          task.date === currentDate &&
          task.time === currentTime
        ) {
          alert(
            `⏰ REMINDER: Task "${task.title}" is due now!`
          );
        }
      });
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [tasks]);

  // Add Task
  const handleAddTask = useCallback((newTaskData) => {
    const newTask = new Task(
      Date.now().toString(),
      newTaskData.title,
      newTaskData.description,
      newTaskData.date,
      newTaskData.time,
      newTaskData.category
    );

    setTasks((prevTasks) => [
      ...prevTasks,
      newTask,
    ]);

    setShowNotification(true);

    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }

    notificationTimeoutRef.current =
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
  }, []);

  // Update Task
  const handleUpdateTask = useCallback(
    (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.id !== updatedTask.id) {
            return task;
          }

          return new Task(
            updatedTask.id,
            updatedTask.title,
            updatedTask.description,
            updatedTask.date,
            updatedTask.time,
            updatedTask.category
          );
        })
      );
    },
    []
  );

  // Delete Task
  const handleDeleteTask = useCallback((id) => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== id)
    );
  }, []);

  // Cleanup Notification Timer
  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(
          notificationTimeoutRef.current
        );
      }
    };
  }, []);

  return (
    <div className="row">
      {/* Notification */}
      {showNotification && (
        <div
          className="alert alert-success position-fixed top-0 end-0 m-3 z-3"
          role="alert"
        >
          Task added successfully!
        </div>
      )}

      {/* Form */}
      <div
        className={
          screenWidth < 768
            ? 'col-12 mb-4'
            : 'col-md-5'
        }
      >
        <TaskForm onAddTask={handleAddTask} />
      </div>

      {/* List */}
      <div
        className={
          screenWidth < 768
            ? 'col-12'
            : 'col-md-7'
        }
      >
        <TaskList
          tasks={tasks}
          filterCategory={filterCategory}
          onFilterChange={setFilterCategory}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>
    </div>
  );
}

export default Tasks;