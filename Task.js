export function Task(id, title, description, date, time, category) {
  this.id = id;
  this.title = title;
  this.description = description;
  this.date = date;
  this.time = time;
  this.category = category;
}

Task.prototype.getFormattedDate = function () {
  if (!this.date) return '';

  const dateObj = new Date(
    `${this.date}T${this.time || '00:00'}`
  );

  if (Number.isNaN(dateObj.getTime())) {
    return this.date;
  }

  return dateObj.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

Task.prototype.setTitle = function (newTitle) {
  const titleRegex = /^[A-Za-z0-9\s]{3,30}$/;

  if (!titleRegex.test(newTitle)) {
    throw new Error(
      'Title must be 3-30 letters/numbers only.'
    );
  }

  this.title = newTitle;
};

export function saveTasks(tasks) {
  localStorage.setItem(
    'tasks_data',
    JSON.stringify(tasks)
  );
}

export function loadTasks() {
  const storageString =
    localStorage.getItem('tasks_data');

  if (!storageString) {
    return [];
  }

  try {
    const savedTasks = JSON.parse(storageString);

    if (!Array.isArray(savedTasks)) {
      return [];
    }

    return savedTasks.map(
      (task) =>
        new Task(
          task.id,
          task.title,
          task.description,
          task.date,
          task.time,
          task.category
        )
    );
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
}