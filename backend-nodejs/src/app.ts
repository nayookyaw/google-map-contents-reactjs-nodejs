import express from 'express';
import helmet from 'helmet'; 
import cors from 'cors'; 
import morgan from 'morgan'; 
import routes from './routes'; 
import { env } from './config/env'; 

const app=express();
import { json, urlencoded } from "express";

// raise limits to e.g. 10mb (tune as needed)
app.use(json({ limit: "10mb" }));
app.use(urlencoded({ extended: true, limit: "10mb" }));

app.use(helmet()); 
app.use(cors({origin: env.corsOrigin})); 
app.use(express.json()); 
app.use(morgan('dev')); 

app.use('/api', routes); 
app.get('/health', (_req,res)=>res.json({ok:true})); 

export default app;
