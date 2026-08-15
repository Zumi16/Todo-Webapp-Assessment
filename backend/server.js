import express from 'express';
import cors from 'cors';
import { db } from './database.js';
import { createClient } from '@libsql/client';

const app = express();
const PORT = 3000;
//Middleware
app.use(cors());
app.use(express.json());

app.get('/api/tasks', async (req, res) => {
    try {
        // const db = await connectDB();
        const tasks = await db.execute('SELECT * FROM tasks'); //db.all
        res.status(201).json(tasks.rows); //.rows added
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.post('/api/tasks', async (req, res) => {
    try {
        // const db = await connectDB();
        const title = req.body.title;
        const description = req.body.description;
        const status = req.body.status

        // //db.run
        // const saveTask = await db.execute(
        //     `INSERT INTO tasks (title, description, status) 
        //     VALUES (?, ?, ?);`, [title, description, status]
        // );

        const saveTask = await db.execute({
            sql: `INSERT INTO tasks (title, description, status) VALUES (?, ?, ?);`,
            args: [title, description, status],
        });

        console.log(`recieved title: ${title}, description: ${description}`);
        res.status(201).json({ message: "Success", task: saveTask.lastID });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/tasks/:id', async (req, res) => {
    try {
        // const db = await connectDB();
        const title = req.body.editTitle;
        const description = req.body.editDescription;
        const status = req.body.statusValue

        // const updateTask = await db.execute( //db.run
        //     `UPDATE tasks
        //     SET title = ?, description = ?, status = ?
        //     WHERE id = ?;`, [title, description, status, req.params.id]
        // );

        const updateTask = await db.execute({
            sql: `UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?;`,
            args: [title, description, status, req.params.id],
        });

        console.log(`recieved updated title: ${title}, updated description: ${description}, updated status: ${status}`);
        res.status(201).json({ message: "Success", task: updateTask.changes });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        // const db = await connectDB();
        const id = req.params.id

        // //db.run
        // const deleteTask = await db.execute(` 
        // DELETE FROM tasks WHERE id = ?
        // `, [id]);

        await db.execute({
            sql: `DELETE FROM tasks WHERE id = ?;`,
            args: [id],
        });

        res.status(201).json({ message: "delete success" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))