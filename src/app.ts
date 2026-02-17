import express from "express";
import { prisma } from "./lib/prisma";
import applicationRoutes from "./routes/application.routes";


const app = express();

app.use(express.json());

// Moduled routes
app.use("/applications", applicationRoutes);

// Server Check
app.get('/',(req,res)=>{
    res.json("Server running mamae");
});

// DB helath endpoint
app.get("/health",async (req,res)=>{
    try{
        await prisma.$queryRaw`SELECT  1`;
        res.json({status:"alive",db:"connected"});
    }catch(error){
        res.status(500).json({status:"dead",db:"not connected"});
    }
});

export default app;