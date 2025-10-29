import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to PostgreSQL using DATABASE_URL from environment variables
const pool = new Pool({connectionString: process.env.DATABASE_URL});

// Health check endpoint for Kubernetes probes and monitoring
app.get("/healthz", (_req: Request, res: Response) => res.json({ status: "ok" }));

// Get all users from the database
app.get("/users", async (_req: Request, res: Response) => {
    const queryResponse = await pool.query("SELECT * FROM users");
    res.json(queryResponse.rows);
})

// Add a new user to the database
app.post("/users", async (req: Request, res: Response) => {
    // get name from request body
    const { name } = req.body;
    if (!name){
        return res.status(400).json({ error: "Name is required" });
    }

    // insert the user into the database
    try {
        const queryResponse = await pool.query("INSERT INTO users(name) VALUES($1) RETURNING *", [name]);
        res.json(queryResponse.rows[0]);
    } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).json({ error: "Insertion failed" });
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
