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

export const applicationUpdateStatusController = async(
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
    const userId = req.userId;
    const applications = await prisma.application.findMany({
        where : {userId},
    });
    res.status(200).json(applications);
  } catch (error:  any) {
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
}

export const getSingleApplicationContoller = async(req:Request,res:Response) =>{
    try{
        const {id} = req.params

        const application = await prisma.application.findUnique({
            where : {id : id as string}
        });

        if(!application){
            return res.status(404).json({message : 'Application not found'});
        }
        res.status(200).json(application);
    }
    catch(error:any){
        res.status(500).json({message : 'failed to fetch application',error:error.message})
    }   
}

export const deleteApplicationController = async(req:Request,res:Response) => {
    try{
        const userId = req.userId;
        const applicationId = req.params.id as string;

        const application = await prisma.application.findFirst({
            where: {
                id: applicationId,
                userId: userId,
            },
        });
        if(!application){
            return res.status(404).json({message: "Application not found"});
        }

         await prisma.application.delete({
      where: {
        id: applicationId,
      },
    });

    res.status(200).json({ message: "Application deleted successfully" });

    }
    catch(error:any){
        res.status(500).json({
            message: "Failed to delete Application",
            error : error.message,
        });
    }
};