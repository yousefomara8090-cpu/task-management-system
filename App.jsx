import React from 'react';
import Tasks from './pages/Tasks';

function App() {
  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">
        Task Management System
      </h1>

      <Tasks />
    </div>
  );
}

export default App;