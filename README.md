# Notes Webapp (Fullstack)

A simple task/notes board. Vanilla HTML/CSS/JS frontend, Express + SQLite backend.

Features: create, edit, delete tasks, filter by status (To do / In progress / Done).

## Project structure

```
Todo-Webapp-Fullstack/
├── backend/
│   ├── server.js      # Express API (port 3000)
│   ├── database.js    # SQLite connection
│   └── app.db         # SQLite database file
└── frontend/
    ├── index.html
    ├── script.js
    └── styles.css
```

## Requirements

- Node.js 18 or newer (uses ES modules and native `fetch`)
- npm

## Setup

1. Install backend dependencies:

   ```bash
   cd backend
   npm install express cors sqlite sqlite3
   ```

   (These are not yet listed in `package.json`; the command above installs and saves them.)

2. The database `backend/app.db` is already included, so no migration step is needed.
   If you need to recreate it from scratch, create a `tasks` table:

   ```sql
   CREATE TABLE "tasks" (
       "id"          INTEGER,
       "title"       TEXT,
       "description" TEXT,
       "status"      INTEGER CHECK("status" IN (0, 1, 2)),
       "createdAt"   TEXT DEFAULT CURRENT_TIMESTAMP,
       PRIMARY KEY("id" AUTOINCREMENT)
   );
   ```

## Environment

No `.env` file is required. Configuration is hardcoded:

| Setting     | Value                   | Where                  |
| ----------- | ----------------------- | ---------------------- |
| Server port | `3000`                  | `backend/server.js`    |
| Database    | `backend/app.db`        | `backend/database.js`  |
| API base URL| `http://localhost:3000` | `frontend/script.js`   |

If you change the port, update the fetch URLs in `frontend/script.js` too.

## Running locally

### 1. Start the backend

```bash
cd backend
npm start
```

You should see `Server running on port 3000`.

### 2. Open the frontend

Open `frontend/index.html` in your browser — either by double-clicking it, or with the
VS Code **Live Server** extension (right-click `index.html` → *Open with Live Server*).

CORS is enabled on the backend, so both approaches work while the server is running.

## API reference

Base URL: `http://localhost:3000`

| Method   | Endpoint          | Body                                          | Description       |
| -------- | ----------------- | --------------------------------------------- | ----------------- |
| `GET`    | `/api/tasks`      | —                                             | List all tasks    |
| `POST`   | `/api/tasks`      | `{ title, description, status }`              | Create a task     |
| `PUT`    | `/api/tasks/:id`  | `{ editTitle, editDescription, statusValue }` | Update a task     |
| `DELETE` | `/api/tasks/:id`  | —                                             | Delete a task     |

Status values: `0` = to do, `1` = in progress, `2` = done.

## Troubleshooting

- **"API Failed" in the browser console** — the backend isn't running; start it with `npm start` in `backend/`.
- **`Cannot find module 'express'`** — dependencies weren't installed; run the install command in `backend/`.
- **Port 3000 already in use** — stop the other process, or change `PORT` in `backend/server.js` and the URLs in `frontend/script.js`.
- **Database locked** — close DB Browser for SQLite (or any tool holding `app.db`) before starting the server.
