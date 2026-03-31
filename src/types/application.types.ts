import { ApplicationStatus } from "@prisma/client";

  export interface ApplicationBody {
  companyName: string;
  role: string;
  }

  export interface UpdateApplicationStatusHistort {
    status : ApplicationStatus;
    note?:string;
  }