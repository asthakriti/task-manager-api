const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let tasks = [];
let nextId = 1;

function isValidStatus(status) {
  return status === "pending" || status === "done";
}

function findTaskById(id) {
  return tasks.find((task) => task.id === id);
}

// POST /tasks - Create a new task
app.post("/tasks", (req, res) => {
  const { title, description } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      message: "Invalid input: 'title' is required and must be a non-empty string."
    });
  }

  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({
      message: "Invalid input: 'description' must be a string if provided."
    });
  }

  const newTask = {
    id: nextId++,
    title: title.trim(),
    description: description ? description.trim() : "",
    status: "pending",
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);

  return res.status(201).json(newTask);
});

// GET /tasks - Get all tasks (with optional filter/sort)
app.get("/tasks", (req, res) => {
  const { status, sort } = req.query;
  let result = [...tasks];

  if (status !== undefined) {
    if (!isValidStatus(status)) {
      return res.status(400).json({
        message: "Invalid query: 'status' must be either 'pending' or 'done'."
      });
    }
    result = result.filter((task) => task.status === status);
  }

  if (sort !== undefined) {
    if (sort !== "createdAt") {
      return res.status(400).json({
        message: "Invalid query: 'sort' only supports 'createdAt'."
      });
    }
    result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  return res.status(200).json(result);
});

// GET /tasks/:id - Get single task
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id) || id <= 0) {
    return res.status(400).json({ message: "Invalid task ID." });
  }

  const task = findTaskById(id);

  if (!task) {
    return res.status(404).json({ message: `Task with id ${id} not found.` });
  }

  return res.status(200).json(task);
});

// PUT /tasks/:id - Update title and/or description
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id) || id <= 0) {
    return res.status(400).json({ message: "Invalid task ID." });
  }

  const task = findTaskById(id);

  if (!task) {
    return res.status(404).json({ message: `Task with id ${id} not found.` });
  }

  const { title, description } = req.body;

  if (title === undefined && description === undefined) {
    return res.status(400).json({
      message: "Invalid input: provide at least one field to update ('title' or 'description')."
    });
  }

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        message: "Invalid input: 'title' must be a non-empty string."
      });
    }
    task.title = title.trim();
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      return res.status(400).json({
        message: "Invalid input: 'description' must be a string."
      });
    }
    task.description = description.trim();
  }

  return res.status(200).json(task);
});

// PATCH /tasks/:id/done - Mark task as completed
app.patch("/tasks/:id/done", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id) || id <= 0) {
    return res.status(400).json({ message: "Invalid task ID." });
  }

  const task = findTaskById(id);

  if (!task) {
    return res.status(404).json({ message: `Task with id ${id} not found.` });
  }

  task.status = "done";

  return res.status(200).json(task);
});

// DELETE /tasks/:id - Delete task
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id) || id <= 0) {
    return res.status(400).json({ message: "Invalid task ID." });
  }

  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return res.status(404).json({ message: `Task with id ${id} not found.` });
  }

  tasks.splice(index, 1);

  return res.status(204).send();
});

/**
 * Bonus: 405 Method Not Allowed for valid routes with unsupported methods
 */
app.all("/tasks", (req, res, next) => {
  const allowed = ["GET", "POST"];
  if (!allowed.includes(req.method)) {
    return res.status(405).json({ message: `Method ${req.method} not allowed on /tasks.` });
  }
  next();
});

app.all("/tasks/:id", (req, res, next) => {
  const allowed = ["GET", "PUT", "DELETE"];
  if (!allowed.includes(req.method)) {
    return res.status(405).json({ message: `Method ${req.method} not allowed on /tasks/:id.` });
  }
  next();
});

app.all("/tasks/:id/done", (req, res, next) => {
  const allowed = ["PATCH"];
  if (!allowed.includes(req.method)) {
    return res.status(405).json({ message: `Method ${req.method} not allowed on /tasks/:id/done.` });
  }
  next();
});

// Fallback 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`Task Manager API is running on http://localhost:${PORT}`);
});