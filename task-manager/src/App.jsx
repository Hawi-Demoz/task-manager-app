import { useState, useEffect } from "react";
import "./styles.css";

function App() {
  // ----- State -----
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [time, setTime] = useState(0);       // timer in seconds
  const [timerOn, setTimerOn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // ----- Timer -----
  useEffect(() => {
    let interval = null;
    if (timerOn) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerOn]);

  // ----- Task Functions -----
  const addTask = () => {
    if (newTask.trim() === "") return;
    const now = new Date();
    setTasks([
      ...tasks,
      { text: newTask, completed: false, dateAdded: now.toISOString() },
    ]);
    setNewTask("");
  };

  const toggleComplete = (index) => {
    setTasks(
      tasks.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  // ----- Dashboard Filters -----
  const tasksToday = tasks.filter(task => {
    const taskDate = new Date(task.dateAdded);
    const today = new Date();
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    );
  });

  const tasksThisWeek = tasks.filter(task => {
    const taskDate = new Date(task.dateAdded);
    const now = new Date();
    const dayOfWeek = now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return taskDate >= weekStart && taskDate <= weekEnd;
  });

  const tasksThisMonth = tasks.filter(task => {
    const taskDate = new Date(task.dateAdded);
    const now = new Date();
    return taskDate.getMonth() === now.getMonth() && taskDate.getFullYear() === now.getFullYear();
  });

  const completedThisWeek = tasksThisWeek.filter(t => t.completed).length;
  const totalThisWeek = tasksThisWeek.length;
  const productivityThisWeek = totalThisWeek === 0 ? 0 : Math.round((completedThisWeek / totalThisWeek) * 100);

  // ----- Local Storage -----
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // ----- JSX -----
  return (
    <div className={`container ${darkMode ? "dark" : "light"}`}>
      <h1>
        Task Manager
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="theme-toggle"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </h1>

      {/* Dashboard */}
      <div className="dashboard">
        <p>Today's tasks: {tasksToday.length} | Done: {tasksToday.filter(t => t.completed).length}</p>
        <p>This week's tasks: {tasksThisWeek.length} | Done: {completedThisWeek} | Productivity: {productivityThisWeek}%</p>
        <p>This month's tasks: {tasksThisMonth.length} | Done: {tasksThisMonth.filter(t => t.completed).length}</p>
      </div>

      {/* Timer */}
      <div className="timer">
        <p>Time spent: {Math.floor(time / 60)}m {time % 60}s</p>
        <button onClick={() => setTimerOn(true)}>Start</button>
        <button onClick={() => setTimerOn(false)}>Pause</button>
        <button onClick={() => { setTime(0); setTimerOn(false); }}>Reset</button>
      </div>

      {/* Input and Add Button */}
      <div className="task-input">
        <input
          type="text"
          placeholder="Enter a task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Task List */}
      <ul>
        {tasks.map((task, index) => (
          <li key={index} className={task.completed ? "completed" : ""}>
            {task.text}
            <small style={{ marginLeft: "10px", color: "#555" }}>
              Added at: {new Date(task.dateAdded).toLocaleTimeString()}
            </small>
            <div className="task-buttons">
              <button onClick={() => toggleComplete(index)}>
                {task.completed ? "Undo" : "Complete"}
              </button>
              <button onClick={() => deleteTask(index)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
