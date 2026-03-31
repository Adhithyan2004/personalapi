import { Request,Response } from "express";
import { ApplicationBody, UpdateApplicationStatusHistort } from "../types/application.types";
import { createApplication,updateApplicationStatus } from "../services/application.service";
import { prisma } from "../lib/prisma";

export const applicationController = async(
    req:Request<{},{},ApplicationBody>,
    res:Response) => {
        try{ const { companyName, role} = req.body;

         const userId = req.userId!;
         const appliedDate = new Date();
        
          const application = await createApplication(
            userId,
            companyName,
            role,
            appliedDate
          );
        
          res.json(application);
        }
        catch(error:any){
            res.status(500).json({message:error.message});
        }
    };

export const applicationUpdateController = async(
    req:Request<{},{},UpdateApplicationStatusHistort>,
    res:Response) => {
        try{ const { status, note } = req.body;
         const userId = req.userId!;

  const updated = await updateApplicationStatus(
    userId,
    status,
    note
  );

  res.json(updated);}
         catch(error:any){
            res.status(500).json({message:error.message});
        }
    }


export const getAllApplicationContoller = async(req:Request,res:Response) =>{
    
  try {
    const applications = await prisma.application.findMany();
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications', error: error });
  }
}