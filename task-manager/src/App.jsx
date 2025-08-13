import { useState, useEffect } from "react";

function App() {
  
 
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const [time, setTime] = useState(0);
const [timerOn, setTimerOn] = useState(false);

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



const addTask = () => {
  if (newTask.trim() === "") return;

  const now = new Date(); // full current date and time
  setTasks([
    ...tasks,
    {
      text: newTask,
      completed: false,
      dateAdded: now.toISOString(), // store in ISO format
    },
  ]);
  setNewTask("");
};



  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const toggleComplete = (index) => {
    setTasks(
      tasks.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };
  // Filter tasks added today
const tasksToday = tasks.filter(task => {
  const taskDate = new Date(task.dateAdded);
  const today = new Date();
  return (
    taskDate.getDate() === today.getDate() &&
    taskDate.getMonth() === today.getMonth() &&
    taskDate.getFullYear() === today.getFullYear()
  );
});

// Filter tasks this week (Mon-Sun)
const tasksThisWeek = tasks.filter(task => {
  const taskDate = new Date(task.dateAdded);
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ...
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - dayOfWeek);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  return taskDate >= weekStart && taskDate <= weekEnd;
});

// Filter tasks this month
const tasksThisMonth = tasks.filter(task => {
  const taskDate = new Date(task.dateAdded);
  const now = new Date();
  return (
    taskDate.getMonth() === now.getMonth() &&
    taskDate.getFullYear() === now.getFullYear()
  );
});

// For example, weekly productivity
const completedThisWeek = tasksThisWeek.filter(task => task.completed).length;
const totalThisWeek = tasksThisWeek.length;
const productivityThisWeek = totalThisWeek === 0 ? 0 : Math.round((completedThisWeek / totalThisWeek) * 100);


  // Load tasks when app starts
useEffect(() => {
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));
  if (storedTasks) setTasks(storedTasks);
}, []);

// Save tasks whenever they change
useEffect(() => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}, [tasks]);



 return (
  <div className="container">
    <h1>Task Manager</h1>

    {/* Dashboard displaying stats */}
    <div className="dashboard">
      <p>Today's tasks: {tasksToday.length} | Done: {tasksToday.filter(t => t.completed).length}</p>
      <p>This week's tasks: {tasksThisWeek.length} | Done: {completedThisWeek} | Productivity: {productivityThisWeek}%</p>
      <p>This month's tasks: {tasksThisMonth.length} | Done: {tasksThisMonth.filter(t => t.completed).length}</p>
    </div>

    <div className="timer">
      <p>Time spent: {Math.floor(time / 60)}m {time % 60}s</p>
      <button onClick={() => setTimerOn(true)}>Start</button>
      <button onClick={() => setTimerOn(false)}>Pause</button>
      <button onClick={() => { setTime(0); setTimerOn(false); }}>Reset</button>
   </div>


    {/* Input and add button */}
    <input 
      type="text" 
      placeholder="Enter a task"
      value={newTask}
      onChange={(e) => setNewTask(e.target.value)}
    />
    <button onClick={addTask}>Add Task</button>

    {/* Task list */}
    <ul>
      {tasks.map((task, index) => (
        <li key={index} className={task.completed ? "completed" : ""}>
          {task.text}
          <small style={{ marginLeft: "10px", color: "#555" }}>Added at: {task.timeAdded}</small>
          <div>
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
