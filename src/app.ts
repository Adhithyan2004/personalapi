import express from "express";
import { prisma } from "./lib/prisma";
import applicationRoutes from "./routes/application.routes";
import authRoutes from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import helmet from "helmet";

const app = express();

app.use(express.json());
app.use(cookieParser()); //For proper cookie parsing as json
app.use(helmet()); //Provide some rules that avoids some web attacks ensuing more security

// Moduled routes
app.use("/applications", applicationRoutes);
app.use("/auth",authRoutes);

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