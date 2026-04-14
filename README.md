# Task Manager API

A simple RESTful Task Manager API built with **Node.js** and **Express.js**
- Create a task
- Get all tasks
- Get a task by ID
- Update task title/description
- Mark task as done
- Delete a task
- Input validation and proper HTTP status codes
- Bonus features:
  - Filter tasks by status (`pending` / `done`)
  - Sort tasks by creation time (`createdAt`)
  - Handle unsupported methods with `405 Method Not Allowed`

---

## Tech Stack

- Node.js
- Express.js

---

## Project Structure

- `server.js` – main API logic
- `package.json` – project metadata and scripts
- `package-lock.json` – dependency lock file
- `.gitignore` – ignored files/folders

---

##  Setup & Run Locally

### 1) Clone the repository

```bash
git clone https://github.com/asthakriti/task-manager-api.git
cd task-manager-api
```

### 2) Install dependencies

```bash
npm install
```

### 3) Start the server

```bash
npm start
```

Server runs at:

```text
http://localhost:3000
```

---

##  API Endpoints

### 1. Create Task
**POST** `/tasks`

Request body:
```json
{
  "title": "Learn Express",
  "description": "Build Task Manager API"
}
```

Response: `201 Created`

---

### 2. Get All Tasks
**GET** `/tasks`

Optional query params:
- `status=pending|done`
- `sort=createdAt`

Examples:
- `GET /tasks`
- `GET /tasks?status=pending`
- `GET /tasks?sort=createdAt`
- `GET /tasks?status=done&sort=createdAt`

Response: `200 OK`

---

### 3. Get Task by ID
**GET** `/tasks/:id`

Response:
- `200 OK` (found)
- `404 Not Found` (if task does not exist)

---

### 4. Update Task
**PUT** `/tasks/:id`

Request body (one or both fields):
```json
{
  "title": "Updated title",
  "description": "Updated description"
}
```

Response:
- `200 OK`
- `400 Bad Request` (invalid input)
- `404 Not Found`

---

### 5. Mark Task as Done
**PATCH** `/tasks/:id/done`

Response:
- `200 OK`
- `404 Not Found`

---

### 6. Delete Task
**DELETE** `/tasks/:id`

Response:
- `204 No Content`
- `404 Not Found`

---

## Validation & Error Handling

- `400 Bad Request` for invalid inputs
- `404 Not Found` for unknown task ID/route
- `405 Method Not Allowed` for unsupported HTTP methods on valid routes

Examples:
- `PATCH /tasks` → `405`
- `POST /tasks/:id` → `405`
- `GET /tasks/:id/done` → `405`

---

## Sample cURL Commands

### Create task
```bash
curl -i -X POST http://localhost:3000/tasks \
-H "Content-Type: application/json" \
-d "{\"title\":\"Task A\",\"description\":\"First task\"}"
```

### Get all tasks
```bash
curl -i http://localhost:3000/tasks
```

### Filter by status
```bash
curl -i "http://localhost:3000/tasks?status=done"
```

### Sort by createdAt
```bash
curl -i "http://localhost:3000/tasks?sort=createdAt"
```

### Mark done
```bash
curl -i -X PATCH http://localhost:3000/tasks/1/done
```

### Delete task
```bash
curl -i -X DELETE http://localhost:3000/tasks/1
```

---

## Note

This project uses **in-memory storage**, so all tasks are reset when the server restarts.

---

## Author

**Astha Kriti Rai**  
GitHub: [@asthakriti](https://github.com/asthakriti)
